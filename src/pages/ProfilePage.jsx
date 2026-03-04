import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { colors as b, fonts } from '../styles/theme';
import { PageShell } from '../components/ui/SharedUI';
import UKLCIcon from '../components/ui/UKLCIcon';

// Badge display names
const BADGE_NAMES = {
  first_activity: 'First Steps',
  streak_3: 'On Fire',
  streak_7: 'Week Warrior',
  perfect_score: 'Perfectionist',
  xp_500: 'Rising Star',
  xp_1000: 'Superstar',
  all_activities: 'Explorer',
};

const ProfilePage = ({ darkMode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // ── Topic metadata ────────────────────────────────────────
  const TOPICS = [
    { id: 1, title: 'Food & Restaurants', iconType: 'food', activityCount: 4 },
    { id: 2, title: 'Music & Culture', iconType: 'music', activityCount: 4 },
    { id: 3, title: 'Travel & Adventure', iconType: 'plane', activityCount: 4 },
    { id: 4, title: 'AI & Technology', iconType: 'robot', activityCount: 4 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        // Fetch progress from student_progress
        try {
          const { data: progressData } = await supabase
            .from('student_progress')
            .select('activity_id, completed, score, time_spent_seconds, attempts')
            .eq('student_id', authUser.id);
          setProgress(progressData || []);
        } catch {
          setProgress([]);
        }

        // Fetch stats from student_stats
        try {
          const { data: statsData } = await supabase
            .from('student_stats')
            .select('*')
            .eq('student_id', authUser.id)
            .single();
          setStats(statsData || null);
        } catch {
          setStats(null);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    navigate('/');
  };

  // ── Derived data ──────────────────────────────────────────
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const email = user?.email || '';
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '';

  const completedActivities = progress.filter(p => p.completed).length;
  const totalXP = stats?.total_xp || 0;
  const currentStreak = stats?.current_streak || 0;
  const badges = stats?.badges || [];
  const totalActivities = TOPICS.reduce((sum, t) => sum + t.activityCount, 0);

  // ── Trial calculation ─────────────────────────────────────
  const trialDays = 30;
  const createdAt = user?.created_at ? new Date(user.created_at) : new Date();
  const trialEnd = new Date(createdAt);
  trialEnd.setDate(trialEnd.getDate() + trialDays);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));
  const trialProgress = Math.min(100, Math.round(((trialDays - daysLeft) / trialDays) * 100));

  const getTopicProgress = (topicId) => {
    const ranges = { 1: [4, 5, 6, 10], 2: [11, 12, 13, 14], 3: [15, 16, 17, 18], 4: [19, 20, 21, 22] };
    const ids = ranges[topicId] || [];
    const completed = progress.filter(p => p.completed && ids.includes(p.activity_id)).length;
    return { completed, total: ids.length };
  };

  // ── Palette ───────────────────────────────────────────────
  const textPrimary = darkMode ? b.greyBlue : b.blue;
  const textSecondary = darkMode ? '#7B8FA3' : '#5A6B7D';
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : b.greyBlue;
  const cardBg = darkMode ? 'rgba(255,255,255,0.04)' : `${b.white}EE`;

  // ── Styles ────────────────────────────────────────────────
  const styles = {
    container: {
      padding: '22px 20px 100px',
      maxWidth: 460,
      margin: '0 auto',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 'none',
      color: textSecondary,
      fontFamily: fonts.body,
      fontSize: 14,
      cursor: 'pointer',
      padding: '4px 0',
      marginBottom: 24,
    },
    header: {
      textAlign: 'center',
      marginBottom: 28,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${b.red}, ${b.blue})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: 32,
      fontFamily: fonts.heading,
      fontWeight: 700,
      color: b.white,
      letterSpacing: 1,
      boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(28,48,72,0.15)',
    },
    name: {
      fontFamily: fonts.heading,
      fontWeight: 700,
      fontSize: 26,
      color: textPrimary,
      margin: '0 0 4px',
    },
    email: {
      fontSize: 14,
      color: textSecondary,
      margin: 0,
      fontFamily: fonts.body,
    },
    memberSince: {
      fontSize: 12,
      color: textSecondary,
      marginTop: 6,
      opacity: 0.7,
      fontFamily: fonts.body,
    },
    card: {
      background: cardBg,
      borderRadius: 18,
      padding: '20px 24px',
      marginBottom: 14,
      border: `1px solid ${borderColor}`,
      backdropFilter: 'blur(10px)',
    },
    cardTitle: {
      fontFamily: fonts.heading,
      fontWeight: 700,
      fontSize: 16,
      color: textPrimary,
      margin: '0 0 16px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10,
    },
    statBox: {
      textAlign: 'center',
      padding: '12px 8px',
      borderRadius: 12,
      background: darkMode ? 'rgba(255,255,255,0.05)' : b.greyBlue,
    },
    statValue: {
      fontFamily: fonts.heading,
      fontWeight: 700,
      fontSize: 24,
      color: b.red,
      margin: 0,
    },
    statLabel: {
      fontSize: 10,
      color: textSecondary,
      marginTop: 4,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: 600,
      fontFamily: fonts.body,
    },
    topicRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: `1px solid ${borderColor}`,
    },
    topicInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    topicIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode ? 'rgba(255,255,255,0.06)' : b.greyBlue,
    },
    topicTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: textPrimary,
      fontFamily: fonts.heading,
    },
    topicProgressText: {
      fontSize: 12,
      color: textSecondary,
      fontVariantNumeric: 'tabular-nums',
      fontFamily: fonts.body,
    },
    progressBarOuter: {
      width: 80,
      height: 6,
      borderRadius: 3,
      background: darkMode ? 'rgba(255,255,255,0.08)' : b.greyBlue,
      overflow: 'hidden',
      marginTop: 4,
    },
    signOutButton: {
      width: '100%',
      padding: '14px 24px',
      borderRadius: 12,
      border: `1.5px solid ${b.red}`,
      background: 'transparent',
      color: b.red,
      fontFamily: fonts.heading,
      fontWeight: 700,
      fontSize: 15,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    noProgressNote: {
      fontSize: 13,
      color: textSecondary,
      textAlign: 'center',
      padding: '8px 0',
      fontStyle: 'italic',
      fontFamily: fonts.body,
    },
  };

  if (loading) {
    return (
      <PageShell dark={darkMode}>
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <p style={{ color: textSecondary, fontSize: 15, fontFamily: fonts.body }}>Loading profile...</p>
        </div>
      </PageShell>
    );
  }

  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const hasProgress = progress.length > 0;

  return (
    <PageShell dark={darkMode}>
      <div style={styles.container}>
        {/* Back to Dashboard */}
        <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
          <UKLCIcon type="back" size={16} color={textSecondary} />
          Back to Dashboard
        </button>

        {/* Header / Avatar */}
        <div style={styles.header}>
          <div style={styles.avatar}>{initials}</div>
          <h1 style={styles.name}>{displayName}</h1>
          <p style={styles.email}>{email}</p>
          {memberSince && <p style={styles.memberSince}>Member since {memberSince}</p>}
        </div>

        {/* Stats Overview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your Progress</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <p style={styles.statValue}>{completedActivities}</p>
              <p style={styles.statLabel}>Completed</p>
            </div>
            <div style={styles.statBox}>
              <p style={styles.statValue}>{totalXP}</p>
              <p style={styles.statLabel}>Total XP</p>
            </div>
            <div style={styles.statBox}>
              <p style={styles.statValue}>{currentStreak}</p>
              <p style={styles.statLabel}>Day Streak</p>
            </div>
          </div>
          {!hasProgress && (
            <p style={styles.noProgressNote}>Complete activities to start tracking your progress!</p>
          )}
        </div>

        {/* Badges */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Badges</h2>
          {badges.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {badges.map((badgeKey) => (
                <div key={badgeKey} style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: darkMode ? 'rgba(240,242,121,0.1)' : `${b.yellow}44`,
                  border: `1px solid ${darkMode ? 'rgba(240,242,121,0.2)' : `${b.yellow}88`}`,
                  fontSize: 12,
                  fontWeight: 600,
                  color: darkMode ? b.yellow : b.blue,
                  fontFamily: fonts.body,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <UKLCIcon type="badge" size={14} />
                  {BADGE_NAMES[badgeKey] || badgeKey}
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noProgressNote}>Complete activities to earn badges!</p>
          )}
        </div>

        {/* Topic Breakdown */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Topics</h2>
          {TOPICS.map((topic, idx) => {
            const tp = getTopicProgress(topic.id);
            const pct = tp.total > 0 ? Math.round((tp.completed / tp.total) * 100) : 0;
            return (
              <div
                key={topic.id}
                style={{
                  ...styles.topicRow,
                  ...(idx === TOPICS.length - 1 ? { borderBottom: 'none' } : {}),
                }}
              >
                <div style={styles.topicInfo}>
                  <div style={styles.topicIcon}>
                    <UKLCIcon type={topic.iconType} size={18} />
                  </div>
                  <div>
                    <div style={styles.topicTitle}>{topic.title}</div>
                    <div style={styles.topicProgressText}>{tp.completed}/{tp.total} activities</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: pct === 100 ? '#22C55E' : textSecondary, fontFamily: fonts.body }}>
                    {pct}%
                  </div>
                  <div style={styles.progressBarOuter}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        borderRadius: 3,
                        background: pct === 100
                          ? '#22C55E'
                          : `linear-gradient(90deg, ${b.pink}, ${b.yellow})`,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Billing / Trial */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Account & Billing</h2>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <div>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: textPrimary,
                fontFamily: fonts.heading,
                marginBottom: 2,
              }}>
                Free Trial
              </div>
              <div style={{
                fontSize: 12,
                color: textSecondary,
                fontFamily: fonts.body,
              }}>
                {daysLeft > 0
                  ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining`
                  : 'Trial expired'}
              </div>
            </div>
            <div style={{
              padding: '5px 12px',
              borderRadius: 20,
              background: daysLeft > 7
                ? (darkMode ? 'rgba(34,197,94,0.15)' : '#DCFCE7')
                : daysLeft > 0
                  ? (darkMode ? 'rgba(251,191,36,0.15)' : '#FEF3C7')
                  : (darkMode ? 'rgba(236,39,59,0.15)' : '#FEE2E2'),
              fontSize: 11,
              fontWeight: 700,
              color: daysLeft > 7 ? '#22C55E' : daysLeft > 0 ? '#F59E0B' : b.red,
              fontFamily: fonts.body,
            }}>
              {daysLeft > 0 ? 'Active' : 'Expired'}
            </div>
          </div>

          {/* Trial progress bar */}
          <div style={{
            height: 6,
            borderRadius: 3,
            background: darkMode ? 'rgba(255,255,255,0.08)' : b.greyBlue,
            overflow: 'hidden',
            marginBottom: 14,
          }}>
            <div style={{
              width: `${trialProgress}%`,
              height: '100%',
              borderRadius: 3,
              background: daysLeft > 7
                ? `linear-gradient(90deg, #22C55E, #4ADE80)`
                : daysLeft > 0
                  ? `linear-gradient(90deg, #F59E0B, #FBBF24)`
                  : `linear-gradient(90deg, ${b.red}, #F87171)`,
              transition: 'width 0.5s ease',
            }} />
          </div>

          <div style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: darkMode ? 'rgba(255,255,255,0.03)' : b.greyBlue + '88',
            border: `1px solid ${borderColor}`,
          }}>
            <div style={{
              fontSize: 12,
              color: textSecondary,
              fontFamily: fonts.body,
              lineHeight: 1.5,
            }}>
              Your free trial includes full access to all topics and activities. Upgrade to a school licence for unlimited access for your students.
            </div>
            <button
              style={{
                marginTop: 10,
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: b.red,
                color: b.white,
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: `0 2px 8px ${b.red}33`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = `0 4px 12px ${b.red}55`; }}
              onMouseLeave={(e) => { e.target.style.transform = 'none'; e.target.style.boxShadow = `0 2px 8px ${b.red}33`; }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div style={styles.card}>
          <button
            style={{
              ...styles.signOutButton,
              ...(signingOut ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
            }}
            onClick={handleSignOut}
            disabled={signingOut}
            onMouseEnter={(e) => {
              if (!signingOut) {
                e.target.style.background = b.red;
                e.target.style.color = b.white;
              }
            }}
            onMouseLeave={(e) => {
              if (!signingOut) {
                e.target.style.background = 'transparent';
                e.target.style.color = b.red;
              }
            }}
          >
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </PageShell>
  );
};

export default ProfilePage;
