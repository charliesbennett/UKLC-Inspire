import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { colors as b, fonts } from '../styles/theme';
import { PageShell, Header } from '../components/ui/SharedUI';
import UKLCIcon from '../components/ui/UKLCIcon';

// Topic data - expand this as you add more topics
const TOPICS = {
  'food-restaurants': {
    title: 'Food & Restaurants',
    description: 'Vocabulary, reading & grammar for dining out',
    iconType: 'food',
    activities: [
      { id: 'vocab-food',    activityType: 'vocabulary',  iconType: 'vocab',   title: 'Restaurant Vocabulary',   type: 'Vocabulary',       minutes: 10, xp: 50  },
      { id: 'reading-food',  activityType: 'reading',     iconType: 'reading', title: 'Crazy Restaurants',       type: 'Reading',          minutes: 15, xp: 60  },
      { id: 'grammar-food',  activityType: 'grammar',     iconType: 'grammar', title: 'Grammar Practice',        type: 'Grammar',          minutes: 12, xp: 50  },
      { id: 'design-food',   activityType: 'restaurant',  iconType: 'design',  title: 'Design Your Restaurant',  type: 'Creative Project', minutes: 20, xp: 100 },
    ],
  },
};

export default function TopicView({ dark, toggleTheme }) {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = TOPICS[topicId];

  if (!topic) {
    return (
      <PageShell dark={dark}>
        <Header dark={dark} title="Topic" onBack={() => navigate('/dashboard')} toggleTheme={toggleTheme} />
        <div style={{ padding: 40, textAlign: 'center', color: dark ? '#7B8FA3' : '#5A6B7D', fontFamily: fonts.body }}>
          Topic not found. <span onClick={() => navigate('/dashboard')} style={{ color: b.red, cursor: 'pointer' }}>Return to Dashboard</span>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell dark={dark}>
      <Header dark={dark} title={topic.title} onBack={() => navigate('/dashboard')} toggleTheme={toggleTheme} />

      <div style={{ padding: '20px 20px 40px', maxWidth: 460, margin: '0 auto' }}>
        {/* Hero banner */}
        <div style={{
          borderRadius: 20, padding: '28px 22px', marginBottom: 24, position: 'relative', overflow: 'hidden',
          background: dark ? `linear-gradient(135deg, ${b.blueLt}, ${b.blue})` : `linear-gradient(135deg, ${b.blue}, ${b.blueLt})`,
        }}>
          <svg style={{ position: 'absolute', top: 10, right: 10, opacity: 0.15 }} width="60" height="60" viewBox="0 0 60 60">
            {[0,1,2].map(r => [0,1,2].map(c => <circle key={`${r}${c}`} cx={10+c*20} cy={10+r*20} r="4" fill={b.pink} />))}
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UKLCIcon type={topic.iconType} size={36} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: b.white, fontFamily: fonts.heading, marginBottom: 4 }}>{topic.title}</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{topic.description}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 18, position: 'relative', zIndex: 1 }}>
            {[{ label: `${topic.activities.length} Activities`, icon: 'star' }, { label: `~${topic.activities.reduce((s, a) => s + a.minutes, 0)} min`, icon: 'clock' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <UKLCIcon type={item.icon} size={16} color="rgba(255,255,255,0.6)" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{item.label}</span>
              </div>
            ))}
          </div>
          <svg style={{ position: 'absolute', bottom: 0, left: 20, opacity: 0.1 }} width="100" height="16" viewBox="0 0 100 16">
            <polyline points="0,14 10,2 20,14 30,2 40,14 50,2 60,14 70,2 80,14 90,2 100,14" fill="none" stroke={b.red} strokeWidth="2" />
          </svg>
        </div>

        {/* Activity list */}
        <h2 style={{ fontSize: 16, fontWeight: 800, color: dark ? b.greyBlue : b.blue, fontFamily: fonts.heading, marginBottom: 14 }}>Activities</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topic.activities.map((act) => (
            <div key={act.id} onClick={() => navigate(`/activity/${act.id}`)}
              style={{
                padding: '16px 18px', borderRadius: 16, cursor: 'pointer',
                background: dark ? 'rgba(255,255,255,0.04)' : `${b.white}EE`,
                border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : b.greyBlue}`,
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = dark ? '0 6px 20px rgba(0,0,0,0.3)' : '0 6px 20px rgba(28,48,72,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: dark ? 'rgba(255,255,255,0.06)' : `${b.pink}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UKLCIcon type={act.iconType} size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: dark ? b.greyBlue : b.blue, fontFamily: fonts.heading, marginBottom: 2 }}>{act.title}</div>
                <div style={{ fontSize: 12, color: dark ? '#7B8FA3' : '#5A6B7D', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span>{act.type}</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span>{act.minutes} min</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span style={{ color: b.red, fontWeight: 700 }}>+{act.xp} XP</span>
                </div>
              </div>
              <UKLCIcon type="right" size={18} color={dark ? '#4A5A6B' : '#CBD5E1'} />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
