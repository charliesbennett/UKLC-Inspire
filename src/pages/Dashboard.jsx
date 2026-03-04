import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { colors as b, fonts } from '../styles/theme';
import { PageShell, ProgressBar } from '../components/ui/SharedUI';
import BrandPatterns from '../components/ui/BrandPatterns';
import UKLCLogo from '../components/ui/UKLCLogo';
import UKLCIcon from '../components/ui/UKLCIcon';

// Activity ID ranges per topic
const TOPIC_ACTIVITY_IDS = {
  1: [4, 5, 6, 10],
  2: [11, 12, 13, 14],
  3: [15, 16, 17, 18],
  4: [19, 20, 21, 22],
};

const StatCard = ({ iconType, value, label, accentBg, dark }) => (
  <div
    style={{
      flex: 1,
      padding: '16px 10px',
      borderRadius: 16,
      textAlign: 'center',
      background: dark ? 'rgba(255,255,255,0.05)' : accentBg,
      border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
      transition: 'transform 0.2s',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
      <UKLCIcon type={iconType} size={28} />
    </div>
    <div
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: dark ? b.greyBlue : b.blue,
        fontFamily: fonts.heading,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: 10,
        color: dark ? '#7B8FA3' : '#5A6B7D',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginTop: 2,
        fontFamily: fonts.body,
      }}
    >
      {label}
    </div>
  </div>
);

const TopicCard = ({ iconType, title, description, progress, dark, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: '18px 20px',
        borderRadius: 18,
        cursor: 'pointer',
        background: dark
          ? h
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(255,255,255,0.03)'
          : h
            ? b.white
            : `${b.greyBlue}88`,
        border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : b.greyBlue}`,
        transition: 'all 0.25s',
        transform: h ? 'translateY(-2px)' : 'none',
        boxShadow: h
          ? dark
            ? '0 8px 24px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(28,48,72,0.08)'
          : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            flexShrink: 0,
            background: dark ? 'rgba(255,255,255,0.06)' : b.pink + '66',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UKLCIcon type={iconType} size={28} />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: dark ? b.greyBlue : b.blue,
              fontFamily: fonts.heading,
              marginBottom: 3,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: dark ? '#7B8FA3' : '#5A6B7D',
              lineHeight: 1.4,
              fontFamily: fonts.body,
            }}
          >
            {description}
          </div>

          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <ProgressBar value={progress} dark={dark} />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: dark ? '#7B8FA3' : '#5A6B7D',
                fontFamily: fonts.body,
              }}
            >
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Choose an icon based on slug/title (customise anytime)
function pickIcon(slug = '', title = '') {
  const s = (slug || title || '').toLowerCase();
  if (s.includes('food')) return 'food';
  if (s.includes('music') || s.includes('culture')) return 'music';
  if (s.includes('travel') || s.includes('adventure')) return 'plane';
  if (s.includes('ai') || s.includes('tech')) return 'robot';
  return 'book';
}

export default function Dashboard({ user, dark, toggleTheme }) {
  const navigate = useNavigate();
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Student';

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  })();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [topicsError, setTopicsError] = useState(null);

  // Live stats from student_stats and student_progress
  const [stats, setStats] = useState({ streak: 0, xp: 0, badges: 0 });
  const [completedActivityIds, setCompletedActivityIds] = useState(new Set());

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Fetch topics from Supabase
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoadingTopics(true);
        setTopicsError(null);

        const { data, error } = await supabase
          .from('topics')
          .select('id, title, description, slug, order_number')
          .eq('is_published', true)
          .order('order_number', { ascending: true });

        if (error) throw error;

        const mapped = (data || []).map((t) => ({
          id: String(t.id),
          numericId: t.id,
          iconType: pickIcon(t.slug, t.title),
          title: t.title,
          description: t.description || '',
        }));

        setTopics(mapped);
      } catch (e) {
        console.error('[Dashboard] Error fetching topics:', e);
        setTopics([]);
        setTopicsError(e?.message || 'Failed to load topics');
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  // Fetch live stats
  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        // Fetch student_stats
        const { data: statsData } = await supabase
          .from('student_stats')
          .select('total_xp, current_streak, badges')
          .eq('student_id', user.id)
          .single();

        if (statsData) {
          setStats({
            streak: statsData.current_streak || 0,
            xp: statsData.total_xp || 0,
            badges: Array.isArray(statsData.badges) ? statsData.badges.length : 0,
          });
        }

        // Fetch completed activities for progress bars
        const { data: progressData } = await supabase
          .from('student_progress')
          .select('activity_id')
          .eq('student_id', user.id)
          .eq('completed', true);

        if (progressData) {
          setCompletedActivityIds(new Set(progressData.map((p) => p.activity_id)));
        }
      } catch (e) {
        console.error('[Dashboard] Error fetching stats:', e);
      }
    };

    fetchStats();
  }, [user?.id]);

  // Calculate topic progress from completed activity IDs
  const getTopicProgress = (numericTopicId) => {
    const ids = TOPIC_ACTIVITY_IDS[numericTopicId] || [];
    if (ids.length === 0) return 0;
    const completed = ids.filter((id) => completedActivityIds.has(id)).length;
    return Math.round((completed / ids.length) * 100);
  };

  const navItems = [
    { icon: 'home', label: 'Home', active: true, action: () => navigate('/dashboard') },
    { icon: 'chart', label: 'Progress', active: false, action: () => {} },
    { icon: 'badge', label: 'Badges', active: false, action: () => {} },
    { icon: 'user', label: 'Profile', active: false, action: () => navigate('/profile') },
  ];

  return (
    <PageShell dark={dark}>
      {/* Header */}
      <div
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : b.greyBlue}`,
        }}
      >
        <UKLCLogo dark={dark} size="small" />

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={toggleTheme}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: dark ? b.greyBlue : b.blue,
            }}
          >
            {dark ? '☀' : '☾'}
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UKLCIcon type="user" size={16} color={dark ? '#7B8FA3' : b.blue} />
            </button>

            {showProfileMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 42,
                  right: 0,
                  zIndex: 50,
                  background: dark ? b.blueLt : b.white,
                  borderRadius: 14,
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : b.greyBlue}`,
                  boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(28,48,72,0.1)',
                  padding: 6,
                  minWidth: 160,
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: dark ? b.greyBlue : b.blue,
                    fontFamily: fonts.heading,
                    borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : b.greyBlue}`,
                    marginBottom: 4,
                  }}
                >
                  {name}
                </div>

                <div
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile');
                  }}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    borderRadius: 10,
                    cursor: 'pointer',
                    color: dark ? '#7B8FA3' : '#5A6B7D',
                    fontFamily: fonts.body,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = dark ? 'rgba(255,255,255,0.06)' : b.greyBlue)}
                  onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                >
                  Profile
                </div>

                <div
                  onClick={handleLogout}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    borderRadius: 10,
                    cursor: 'pointer',
                    color: b.red,
                    fontWeight: 600,
                    fontFamily: fonts.body,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = dark ? 'rgba(236,39,59,0.1)' : `${b.red}11`)}
                  onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                >
                  Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '22px 20px 100px', maxWidth: 460, margin: '0 auto' }}>
        {/* Welcome */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: dark ? '#5A6B7D' : '#8899AA', fontWeight: 500, marginBottom: 3 }}>
            {greeting}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: dark ? b.greyBlue : b.blue, margin: 0, fontFamily: fonts.heading }}>
            {name}
          </h1>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              padding: '5px 12px',
              borderRadius: 20,
              background: dark ? 'rgba(230,238,243,0.08)' : b.greyBlue,
              fontSize: 11,
              fontWeight: 600,
              color: dark ? b.greyBlue : b.blue,
            }}
          >
            <UKLCIcon type="book" size={14} /> Level B1-B2 · Ages 13–16
          </div>
        </div>

        {/* Live Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <StatCard iconType="flame" value={stats.streak} label="Streak" accentBg={`${b.yellow}44`} dark={dark} />
          <StatCard iconType="star" value={stats.xp} label="XP" accentBg={`${b.pink}88`} dark={dark} />
          <StatCard iconType="trophy" value={stats.badges} label="Badges" accentBg={b.greyBlue} dark={dark} />
        </div>

        {/* Daily goal (still hardcoded for now) */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 16,
            marginBottom: 28,
            background: dark ? 'rgba(255,255,255,0.03)' : `${b.white}CC`,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : b.greyBlue}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: dark ? b.greyBlue : b.blue, fontFamily: fonts.heading }}>
              Daily Goal
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: b.red, fontFamily: fonts.body }}>2 / 3</span>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue }}>
            <div
              style={{
                width: '66%',
                height: '100%',
                borderRadius: 4,
                background: `linear-gradient(90deg, ${b.red}, ${b.pink})`,
                transition: 'width 0.8s ease',
              }}
            />
          </div>
        </div>

        {/* Topics */}
        <h2 style={{ fontSize: 17, fontWeight: 800, color: dark ? b.greyBlue : b.blue, marginBottom: 14, fontFamily: fonts.heading }}>
          Your Topics
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loadingTopics ? (
            <div style={{ color: dark ? '#7B8FA3' : '#5A6B7D', fontFamily: fonts.body, fontSize: 13 }}>
              Loading topics...
            </div>
          ) : topicsError ? (
            <div style={{ color: b.red, fontFamily: fonts.body, fontSize: 13 }}>
              {topicsError}
            </div>
          ) : topics.length === 0 ? (
            <div style={{ color: dark ? '#7B8FA3' : '#5A6B7D', fontFamily: fonts.body, fontSize: 13 }}>
              No topics found.
            </div>
          ) : (
            topics.map((t) => (
              <TopicCard
                key={t.id}
                iconType={t.iconType}
                title={t.title}
                description={t.description}
                progress={getTopicProgress(t.numericId)}
                dark={dark}
                onClick={() => navigate(`/topic/${t.id}`)}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: dark ? `${b.blueDk}EE` : `${b.white}EE`,
          backdropFilter: 'blur(12px)',
          borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : b.greyBlue}`,
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 0 14px',
        }}
      >
        {navItems.map((item, i) => (
          <div
            key={i}
            onClick={item.action}
            style={{
              flex: 1,
              maxWidth: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
              opacity: item.active ? 1 : 0.35,
            }}
          >
            <UKLCIcon type={item.icon} size={22} color={item.active ? b.red : dark ? b.greyBlue : b.blue} />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                fontFamily: fonts.body,
                color: item.active ? b.red : dark ? '#7B8FA3' : '#5A6B7D',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
