import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// ── Brand tokens (matching theme.js) ──────────────────────────
const BRAND = {
  blue: '#1C3048',
  red: '#EC273B',
  neonYellow: '#F0F279',
  pink: '#FAD7D8',
  greyBlue: '#E6EEF3',
  white: '#FFFFFF',
};

const ProfilePage = ({ darkMode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // ── Topic metadata ────────────────────────────────────────
  const TOPICS = [
    { id: 1, title: 'Food & Restaurants', icon: '🍽️', activityCount: 4 },
    { id: 2, title: 'Music & Culture', icon: '🎵', activityCount: 4 },
    { id: 3, title: 'Travel & Adventure', icon: '✈️', activityCount: 4 },
    { id: 4, title: 'AI & Technology', icon: '🤖', activityCount: 4 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        // Attempt to fetch progress — table may not exist yet
        try {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('activity_id, completed, xp_earned, completed_at')
            .eq('user_id', authUser.id);
          setProgress(progressData || []);
        } catch {
          setProgress([]);
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
  const totalXP = progress.reduce((sum, p) => sum + (p.xp_earned || 0), 0);
  const totalActivities = TOPICS.reduce((sum, t) => sum + t.activityCount, 0);

  const getTopicProgress = (topicId) => {
    // Map topic IDs to activity ID ranges
    const ranges = { 1: [4, 5, 6, 10], 2: [11, 12, 13, 14], 3: [15, 16, 17, 18], 4: [19, 20, 21, 22] };
    const ids = ranges[topicId] || [];
    const completed = progress.filter(p => p.completed && ids.includes(p.activity_id)).length;
    return { completed, total: ids.length };
  };

  // ── Palette ───────────────────────────────────────────────
  const bg = darkMode ? '#0F1A2B' : BRAND.greyBlue;
  const cardBg = darkMode ? '#1A2640' : BRAND.white;
  const textPrimary = darkMode ? BRAND.greyBlue : BRAND.blue;
  const textSecondary = darkMode ? '#8BA3BF' : '#5A7A9A';
  const borderColor = darkMode ? '#2A3E5C' : '#D0DCE6';

  // ── Styles ────────────────────────────────────────────────
  const styles = {
    page: {
      minHeight: '100vh',
      background: bg,
      fontFamily: "'Open Sans', sans-serif",
      padding: '24px 16px 80px',
      maxWidth: 640,
      margin: '0 auto',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 'none',
      color: textSecondary,
      fontFamily: "'Open Sans', sans-serif",
      fontSize: 14,
      cursor: 'pointer',
      padding: '4px 0',
      marginBottom: 24,
    },
    header: {
      textAlign: 'center',
      marginBottom: 32,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${BRAND.red}, ${BRAND.blue})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: 32,
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 700,
      color: BRAND.white,
      letterSpacing: 1,
      boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(28,48,72,0.15)',
    },
    name: {
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 700,
      fontSize: 26,
      color: textPrimary,
      margin: '0 0 4px',
    },
    email: {
      fontSize: 14,
      color: textSecondary,
      margin: 0,
    },
    memberSince: {
      fontSize: 12,
      color: textSecondary,
      marginTop: 6,
      opacity: 0.7,
    },
    card: {
      background: cardBg,
      borderRadius: 14,
      padding: '20px 24px',
      marginBottom: 16,
      border: `1px solid ${borderColor}`,
      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(28,48,72,0.06)',
    },
    cardTitle: {
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 700,
      fontSize: 16,
      color: textPrimary,
      margin: '0 0 16px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 12,
    },
    statBox: {
      textAlign: 'center',
      padding: '12px 8px',
      borderRadius: 10,
      background: darkMode ? '#0F1A2B' : BRAND.greyBlue,
    },
    statValue: {
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 700,
      fontSize: 24,
      color: BRAND.red,
      margin: 0,
    },
    statLabel: {
      fontSize: 11,
      color: textSecondary,
      marginTop: 4,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
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
      fontSize: 20,
      width: 36,
      height: 36,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode ? '#0F1A2B' : BRAND.greyBlue,
    },
    topicTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: textPrimary,
    },
    topicProgressText: {
      fontSize: 13,
      color: textSecondary,
      fontVariantNumeric: 'tabular-nums',
    },
    progressBarOuter: {
      width: 80,
      height: 6,
      borderRadius: 3,
      background: darkMode ? '#0F1A2B' : BRAND.greyBlue,
      overflow: 'hidden',
      marginTop: 4,
    },
    signOutButton: {
      width: '100%',
      padding: '14px 24px',
      borderRadius: 12,
      border: `1.5px solid ${BRAND.red}`,
      background: 'transparent',
      color: BRAND.red,
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 700,
      fontSize: 15,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: 8,
    },
    noProgressNote: {
      fontSize: 13,
      color: textSecondary,
      textAlign: 'center',
      padding: '8px 0',
      fontStyle: 'italic',
    },
  };

  if (loading) {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: textSecondary, fontSize: 15 }}>Loading profile...</p>
      </div>
    );
  }

  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const hasProgress = progress.length > 0;

  return (
    <div style={styles.page}>
      {/* Back to Dashboard */}
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
            <p style={styles.statValue}>{totalActivities - completedActivities}</p>
            <p style={styles.statLabel}>Remaining</p>
          </div>
          <div style={styles.statBox}>
            <p style={styles.statValue}>{totalXP}</p>
            <p style={styles.statLabel}>Total XP</p>
          </div>
        </div>
        {!hasProgress && (
          <p style={styles.noProgressNote}>Complete activities to start tracking your progress!</p>
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
                <div style={styles.topicIcon}>{topic.icon}</div>
                <div>
                  <div style={styles.topicTitle}>{topic.title}</div>
                  <div style={styles.topicProgressText}>{tp.completed}/{tp.total} activities</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: pct === 100 ? '#22C55E' : textSecondary }}>
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
                        : `linear-gradient(90deg, ${BRAND.red}, ${BRAND.blue})`,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
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
              e.target.style.background = BRAND.red;
              e.target.style.color = BRAND.white;
            }
          }}
          onMouseLeave={(e) => {
            if (!signingOut) {
              e.target.style.background = 'transparent';
              e.target.style.color = BRAND.red;
            }
          }}
        >
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
