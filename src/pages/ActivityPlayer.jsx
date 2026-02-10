import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useProgressTracker } from '../hooks/useProgressTracker'
import CompletionModal from '../components/activities/CompletionModal'
import QuizPlayer from '../components/QuizPlayer'
import VocabularyActivity from '../components/activities/VocabularyActivity'
import ReadingActivity from '../components/activities/ReadingActivity'
import GrammarActivity from '../components/activities/GrammarActivity'
import RestaurantDesignActivity from '../components/activities/RestaurantDesignActivity'
import { PageShell, Header } from '../components/ui/SharedUI'
import { colors as b } from '../styles/theme'

export default function ActivityPlayer({ user, dark, toggleTheme }) {
  const { activityId } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)

  // Progress tracking
  const {
    saving,
    error: progressError,
    startActivity,
    resetAttempts,
    updateProgress,
    completeActivity,
    getProgress,
  } = useProgressTracker(user?.id)

  const [completionData, setCompletionData] = useState(null)
  const [showCompletion, setShowCompletion] = useState(false)

  useEffect(() => {
    loadActivity()
  }, [activityId])

  // Start tracking when activity loads
  useEffect(() => {
    if (activity && user?.id) {
      resetAttempts()
      startActivity(activityId)
    }
  }, [activity, user?.id, activityId, startActivity, resetAttempts])

  const loadActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single()

      if (error) throw error
      setActivity(data)
    } catch (error) {
      console.error('Error loading activity:', error)
    } finally {
      setLoading(false)
    }
  }

  // ── Completion handler ──
  const handleActivityComplete = async (score) => {
    if (!activity) return
    const result = await completeActivity(activityId, activity.activity_type, score)
    if (result) {
      setCompletionData(result)
      setShowCompletion(true)
    }
  }

  const handleQuizComplete = async (results) => {
    await handleActivityComplete(results.score)
  }

  const handlePartialProgress = async (currentScore) => {
    await updateProgress(activityId, currentScore)
  }

  const handleRetry = () => {
    setShowCompletion(false)
    setCompletionData(null)
    startActivity(activityId)
  }

  const handleContinue = () => {
    setShowCompletion(false)
    navigate(-1)
  }

  if (loading) {
    return (
      <PageShell dark={dark}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: `3px solid ${dark ? 'rgba(255,255,255,0.1)' : b.greyBlue}`,
            borderTopColor: b.red,
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </PageShell>
    )
  }

  if (!activity) {
    return (
      <PageShell dark={dark}>
        <Header dark={dark} title="Activity" onBack={() => navigate(-1)} toggleTheme={toggleTheme} />
        <div style={{ padding: 40, textAlign: 'center', color: dark ? '#7B8FA3' : '#5A6B7D' }}>
          <p style={{ fontSize: 18, marginBottom: 12 }}>Activity not found</p>
          <span onClick={() => navigate('/dashboard')} style={{ color: b.red, cursor: 'pointer', fontWeight: 600 }}>
            Return to Dashboard
          </span>
        </div>
      </PageShell>
    )
  }

  // Dark mode override styles for Tailwind-based activity components
  const darkOverrides = dark ? `
    .activity-wrapper { color-scheme: dark; }
    .activity-wrapper, .activity-wrapper > div { background: transparent !important; }
    .activity-wrapper .max-w-4xl, .activity-wrapper .max-w-2xl { background: transparent !important; }

    /* Cards */
    .activity-wrapper [class*="rounded-xl"], 
    .activity-wrapper [class*="rounded-lg"],
    .activity-wrapper .border {
      background: rgba(255,255,255,0.04) !important;
      border-color: rgba(255,255,255,0.08) !important;
      color: ${b.greyBlue} !important;
    }

    /* Text */
    .activity-wrapper p, .activity-wrapper span, .activity-wrapper label,
    .activity-wrapper h2, .activity-wrapper h3, .activity-wrapper h4 {
      color: ${b.greyBlue} !important;
    }
    .activity-wrapper .text-gray-600, .activity-wrapper .text-gray-700,
    .activity-wrapper .text-gray-800, .activity-wrapper .text-gray-500 {
      color: #7B8FA3 !important;
    }
    .activity-wrapper .text-blue-600 { color: ${b.pink} !important; }
    .activity-wrapper .font-bold, .activity-wrapper .font-semibold {
      color: ${b.greyBlue} !important;
    }

    /* Inputs */
    .activity-wrapper input, .activity-wrapper textarea {
      background: rgba(255,255,255,0.04) !important;
      border-color: rgba(255,255,255,0.1) !important;
      color: ${b.greyBlue} !important;
    }
    .activity-wrapper input::placeholder, .activity-wrapper textarea::placeholder {
      color: #5A6B7D !important;
    }

    /* Buttons - primary */
    .activity-wrapper button[class*="bg-"] {
      background: ${b.red} !important;
      color: white !important;
    }
    .activity-wrapper button[class*="outline"],
    .activity-wrapper button[class*="variant"] {
      background: rgba(255,255,255,0.06) !important;
      border-color: rgba(255,255,255,0.12) !important;
      color: ${b.greyBlue} !important;
    }

    /* Progress bar */
    .activity-wrapper [class*="bg-gray-50"], .activity-wrapper [class*="bg-gray-100"] {
      background: rgba(255,255,255,0.06) !important;
    }
    .activity-wrapper [class*="bg-blue-50"] {
      background: rgba(240,242,121,0.08) !important;
    }
    .activity-wrapper [class*="bg-yellow-50"] {
      background: rgba(240,242,121,0.08) !important;
    }

    /* Correct/incorrect feedback */
    .activity-wrapper [class*="bg-green-50"], .activity-wrapper .border-green-500 {
      background: rgba(34,197,94,0.08) !important;
      border-color: rgba(34,197,94,0.3) !important;
    }
    .activity-wrapper [class*="bg-red-50"], .activity-wrapper .border-red-500 {
      background: rgba(236,39,59,0.08) !important;
      border-color: rgba(236,39,59,0.3) !important;
    }
    .activity-wrapper .text-green-600 { color: #4ADE80 !important; }
    .activity-wrapper .text-red-600 { color: ${b.red} !important; }

    /* Radio buttons & hover states */
    .activity-wrapper .hover\\:bg-gray-50:hover {
      background: rgba(255,255,255,0.06) !important;
    }

    /* Flashcard specific */
    .activity-wrapper .text-4xl { color: ${b.greyBlue} !important; }
    .activity-wrapper .cursor-pointer.min-h-\\[300px\\] {
      background: rgba(255,255,255,0.04) !important;
    }

    /* Step indicators */
    .activity-wrapper .bg-gray-200 {
      background: rgba(255,255,255,0.08) !important;
    }
    .activity-wrapper .text-gray-600.text-sm { color: #5A6B7D !important; }
  ` : '';

  return (
    <PageShell dark={dark}>
      <Header
        dark={dark}
        title={activity.title}
        onBack={() => navigate(-1)}
        toggleTheme={toggleTheme}
      />

      <style>{darkOverrides}</style>

      <div className="activity-wrapper" style={{ padding: '0 0 40px' }}>
        <main style={{ maxWidth: 900, margin: '0 auto' }}>
          {activity.activity_type === 'quiz' && (
            <QuizPlayer activity={activity} onComplete={handleQuizComplete} />
          )}

          {activity.activity_type === 'vocabulary' && (
            <VocabularyActivity
              onComplete={handleActivityComplete}
              onProgress={handlePartialProgress}
            />
          )}

          {activity.activity_type === 'reading' && (
            <ReadingActivity
              onComplete={handleActivityComplete}
              onProgress={handlePartialProgress}
            />
          )}

          {activity.activity_type === 'grammar' && activity.id === 6 && (
            <GrammarActivity
              onComplete={handleActivityComplete}
              onProgress={handlePartialProgress}
            />
          )}

          {activity.activity_type === 'grammar' && activity.id === 10 && (
            <RestaurantDesignActivity
              onComplete={handleActivityComplete}
              onProgress={handlePartialProgress}
            />
          )}

          {activity.activity_type !== 'quiz' &&
           activity.activity_type !== 'vocabulary' &&
           activity.activity_type !== 'reading' &&
           activity.activity_type !== 'grammar' && (
            <div style={{
              maxWidth: 600, margin: '40px auto', textAlign: 'center', padding: 32,
              borderRadius: 18,
              background: dark ? 'rgba(255,255,255,0.04)' : 'white',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : b.greyBlue}`,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: dark ? b.greyBlue : b.blue, marginBottom: 8 }}>Coming Soon!</h2>
              <p style={{ color: dark ? '#7B8FA3' : '#5A6B7D', marginBottom: 20 }}>
                This activity type ({activity.activity_type}) will be available soon.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Saving indicator */}
      {saving && (
        <div style={{
          position: 'fixed', top: 16, right: 16, zIndex: 50,
          background: b.blue, color: b.greyBlue,
          padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>Saving progress...</div>
      )}

      {/* Error indicator */}
      {progressError && (
        <div style={{
          position: 'fixed', bottom: 16, right: 16, zIndex: 50,
          background: b.red, color: 'white',
          padding: '8px 16px', borderRadius: 10, fontSize: 13,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>Save error: {progressError}</div>
      )}

      {/* Completion modal */}
      {showCompletion && completionData && (
        <CompletionModal
          score={completionData.progress.score}
          xpEarned={completionData.xpEarned}
          newBadges={completionData.newBadges}
          onRetry={handleRetry}
          onContinue={handleContinue}
        />
      )}
    </PageShell>
  )
}
