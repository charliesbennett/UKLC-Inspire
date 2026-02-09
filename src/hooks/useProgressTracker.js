import { useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

// XP rewards per activity type
const XP_REWARDS = {
  vocabulary: { base: 50, perCorrect: 10 },
  reading: { base: 60, perCorrect: 15 },
  grammar: { base: 50, perCorrect: 10 },
  restaurant_design: { base: 100, perCorrect: 0 }, // flat reward for creative task
};

// Badge definitions
const BADGES = {
  first_activity: { name: 'First Steps', condition: (stats) => stats.total_completed >= 1 },
  streak_3: { name: 'On Fire', condition: (stats) => stats.current_streak >= 3 },
  streak_7: { name: 'Week Warrior', condition: (stats) => stats.current_streak >= 7 },
  perfect_score: { name: 'Perfectionist', condition: (stats) => stats.last_score === 100 },
  xp_500: { name: 'Rising Star', condition: (stats) => stats.total_xp >= 500 },
  xp_1000: { name: 'Superstar', condition: (stats) => stats.total_xp >= 1000 },
  all_activities: { name: 'Explorer', condition: (stats) => stats.unique_activities >= 4 },
};

export function useProgressTracker(studentId) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(null);
  const attemptsRef = useRef(0);

  // Call when an activity begins
  const startActivity = useCallback((activityId) => {
    startTimeRef.current = Date.now();
    attemptsRef.current += 1;
    setError(null);
    console.log(`[Progress] Started activity: ${activityId}, attempt: ${attemptsRef.current}`);
  }, []);

  // Reset attempt counter (call when switching activities)
  const resetAttempts = useCallback(() => {
    attemptsRef.current = 0;
    startTimeRef.current = null;
  }, []);

  // ── Internal: raw upsert without touching saving/error state ──
  // Used by completeActivity which manages its own setSaving lifecycle
  const _upsertProgress = useCallback(async (activityId, { completed, score }) => {
    if (!studentId || !activityId) return null;

    const timeSpent = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0;

    const { data, error: dbError } = await supabase
      .from('student_progress')
      .upsert(
        {
          student_id: studentId,
          activity_id: activityId,
          completed: completed || false,
          score: score || 0,
          time_spent_seconds: timeSpent,
          attempts: attemptsRef.current,
        },
        { onConflict: 'student_id,activity_id' }
      )
      .select()
      .single();

    if (dbError) throw dbError;

    console.log(`[Progress] Saved progress for ${activityId}:`, data);
    return data;
  }, [studentId]);

  // Save progress to student_progress table (standalone, with saving state)
  const saveProgress = useCallback(async (activityId, { completed, score }) => {
    setSaving(true);
    setError(null);

    try {
      const data = await _upsertProgress(activityId, { completed, score });
      return data;
    } catch (err) {
      console.error('[Progress] Save failed:', err);
      setError(err.message);
      return null;
    } finally {
      setSaving(false);
    }
  }, [_upsertProgress]);

  // Update partial progress (e.g., mid-quiz)
  const updateProgress = useCallback(async (activityId, score) => {
    return saveProgress(activityId, { completed: false, score });
  }, [saveProgress]);

  // ── Helper: count unique completed activities (client-side dedupe) ──
  const _countUniqueCompleted = useCallback(async () => {
    const { data: completedRows, error: countError } = await supabase
      .from('student_progress')
      .select('activity_id')
      .eq('student_id', studentId)
      .eq('completed', true);

    if (countError) throw countError;

    // Dedupe to get truly unique activity count
    const uniqueIds = new Set(completedRows?.map((r) => r.activity_id));
    return {
      uniqueActivities: uniqueIds.size,
      totalCompleted: completedRows?.length || 0,
    };
  }, [studentId]);

  // Complete activity: save progress + update stats + check badges
  const completeActivity = useCallback(async (activityId, activityType, score) => {
    setSaving(true);
    setError(null);

    try {
      // 1. Save final progress (uses internal fn — no double setSaving)
      const progress = await _upsertProgress(activityId, { completed: true, score });
      if (!progress) throw new Error('Failed to save progress');

      // 2. Calculate XP earned
      const rewards = XP_REWARDS[activityType] || XP_REWARDS.vocabulary;
      const scorePercent = score / 100;
      const xpEarned = Math.round(rewards.base + (rewards.perCorrect * scorePercent * 10));

      // 3. Fetch current stats
      const { data: currentStats, error: fetchError } = await supabase
        .from('student_stats')
        .select('*')
        .eq('student_id', studentId)
        .single();

      // 4. Calculate streak
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let newStreak = 1;
      let longestStreak = 1;

      if (currentStats && !fetchError) {
        const lastDate = currentStats.last_activity_date;
        if (lastDate === today) {
          newStreak = currentStats.current_streak; // same day, keep streak
        } else if (lastDate === yesterday) {
          newStreak = currentStats.current_streak + 1; // consecutive day
        }
        // else streak resets to 1
        longestStreak = Math.max(newStreak, currentStats.longest_streak || 0);
      }

      // 5. Count unique + total completed activities (properly deduped)
      const { uniqueActivities, totalCompleted } = await _countUniqueCompleted();

      // 6. Check for new badges
      const statsForBadgeCheck = {
        total_xp: (currentStats?.total_xp || 0) + xpEarned,
        current_streak: newStreak,
        last_score: score,
        total_completed: totalCompleted,
        unique_activities: uniqueActivities,
      };

      const existingBadges = currentStats?.badges || [];
      const newBadges = [];

      Object.entries(BADGES).forEach(([key, badge]) => {
        if (!existingBadges.includes(key) && badge.condition(statsForBadgeCheck)) {
          newBadges.push(key);
        }
      });

      const allBadges = [...existingBadges, ...newBadges];

      // 7. Upsert student_stats
      const statsData = {
        student_id: studentId,
        total_xp: statsForBadgeCheck.total_xp,
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_activity_date: today,
        badges: allBadges,
      };

      const { data: updatedStats, error: statsError } = await supabase
        .from('student_stats')
        .upsert(statsData, { onConflict: 'student_id' })
        .select()
        .single();

      if (statsError) throw statsError;

      console.log(`[Progress] Activity complete! XP earned: ${xpEarned}, New badges:`, newBadges);

      return {
        progress,
        stats: updatedStats,
        xpEarned,
        newBadges: newBadges.map((key) => ({ key, ...BADGES[key] })),
      };
    } catch (err) {
      console.error('[Progress] Complete activity failed:', err);
      setError(err.message);
      return null;
    } finally {
      setSaving(false);
    }
  }, [studentId, _upsertProgress, _countUniqueCompleted]);

  // Fetch existing progress for an activity
  const getProgress = useCallback(async (activityId) => {
    if (!studentId || !activityId) return null;

    try {
      const { data, error: dbError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('activity_id', activityId)
        .single();

      if (dbError && dbError.code !== 'PGRST116') throw dbError; // PGRST116 = not found
      return data || null;
    } catch (err) {
      console.error('[Progress] Fetch failed:', err);
      return null;
    }
  }, [studentId]);

  // Fetch student stats
  const getStats = useCallback(async () => {
    if (!studentId) return null;

    try {
      const { data, error: dbError } = await supabase
        .from('student_stats')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (dbError && dbError.code !== 'PGRST116') throw dbError;
      return data || null;
    } catch (err) {
      console.error('[Progress] Stats fetch failed:', err);
      return null;
    }
  }, [studentId]);

  return {
    saving,
    error,
    startActivity,
    resetAttempts,
    updateProgress,
    completeActivity,
    getProgress,
    getStats,
  };
}

