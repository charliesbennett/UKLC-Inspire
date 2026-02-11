import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { colors as b, fonts } from '../styles/theme';
import { PageShell } from '../components/ui/SharedUI';
import UKLCLogo from '../components/ui/UKLCLogo';
import UKLCIcon from '../components/ui/UKLCIcon';

const levelToCEFR = (level) => {
  // Adjust this mapping to match your DB meaning
  // Your DB currently has level as an integer
  const map = {
    1: 'A1',
    2: 'A2',
    3: 'B1',
    4: 'B2',
    5: 'C1',
    6: 'C2',
  };
  return map[level] || String(level ?? '');
};

const activityTypeLabel = (type) => {
  const map = {
    vocabulary: 'Vocabulary',
    reading: 'Reading',
    grammar: 'Grammar',
    project: 'Project',
    quiz: 'Quiz',
  };
  return map[type] || type || 'Activity';
};

// Use icon names you already have in UKLCIcon.
// If some don’t exist, it will still render (or you can swap them).
const activityTypeIcon = (type) => {
  const map = {
    vocabulary: 'cards',    // flashcards vibe
    reading: 'document',    // text/article vibe
    grammar: 'edit',        // rules/fixing vibe
    project: 'rocket',      // building/creating vibe
    quiz: 'check',          // test vibe
  };
  return map[type] || 'document';
};

const ActivityCard = ({ a, dark, onClick }) => {
  const [h, setH] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: '16px 18px',
        borderRadius: 18,
        cursor: 'pointer',
        background: dark
          ? h
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(255,255,255,0.03)'
          : h
          ? b.white
          : `${b.white}CC`,
        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : b.greyBlue}`,
        transition: 'all 0.2s',
        transform: h ? 'translateY(-2px)' : 'none',
        boxShadow: h ? (dark ? '0 10px 26px rgba(0,0,0,0.35)' : '0 10px 26px rgba(28,48,72,0.10)') : 'none',
        display: 'flex',
        gap: 14,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          flexShrink: 0,
          background: dark ? 'rgba(255,255,255,0.06)' : `${b.pink}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UKLCIcon type={activityTypeIcon(a.activity_type)} size={22} color={dark ? '#7B8FA3' : b.blue} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 900,
            color: dark ? b.greyBlue : b.blue,
            fontSize: 16,
            marginBottom: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {a.order_number}. {a.title}
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            color: dark ? '#7B8FA3' : '#5A6B7D',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontWeight: 800 }}>{activityTypeLabel(a.activity_type)}</span>
          <span style={{ opacity: 0.7 }}>•</span>
          <span style={{ opacity: 0.9 }}>Tap to open</span>
        </div>
      </div>

      <div style={{ opacity: 0.6 }}>
        <UKLCIcon type="chart" size={18} color={dark ? '#7B8FA3' : b.blue} />
      </div>
    </div>
  );
};

export default function TopicView({ dark }) {
  const navigate = useNavigate();
  const params = useParams();

  // supports /topic/:id OR /topic/:slug (depending on how your routes are set)
  const topicParam = params.id || params.topicId || params.slug;

  const isNumeric = useMemo(() => /^\d+$/.test(String(topicParam || '')), [topicParam]);

  const [topic, setTopic] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr(null);

        if (!topicParam) throw new Error('Missing topic in URL');

        console.log('[TopicView] Fetching topic with param:', topicParam);

        const base = supabase
          .from('topics')
          .select('id, title, description, slug, level, age_group, order_number, is_published')
          .limit(1);

        const { data: t, error: tErr } = isNumeric
          ? await base.eq('id', Number(topicParam)).maybeSingle()
          : await base.eq('slug', String(topicParam)).maybeSingle();

        console.log('[TopicView] Topic result:', { t, tErr });

        if (tErr) throw tErr;
        if (!t) throw new Error('Topic not found');

        if (t.is_published === false) throw new Error('Topic exists but is not published');

        setTopic(t);

        console.log('[TopicView] Fetching activities for topic_id:', t.id);

        const { data: acts, error: aErr } = await supabase
          .from('activities')
          .select('id, topic_id, title, activity_type, order_number')
          .eq('topic_id', t.id)
          .order('order_number', { ascending: true });

        console.log('[TopicView] Activities result:', { acts, aErr });

        if (aErr) throw aErr;

        setActivities(acts || []);
      } catch (e) {
        console.error('[TopicView] Error:', e);
        setErr(e?.message || 'Failed to load topic');
        setTopic(null);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [topicParam, isNumeric]);

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
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 12,
            fontWeight: 800,
            fontFamily: fonts.body,
            background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue,
            color: dark ? b.greyBlue : b.blue,
          }}
        >
          ← Dashboard
        </button>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '26px 20px 90px' }}>
        {loading ? (
          <div style={{ color: dark ? '#7B8FA3' : '#5A6B7D', fontFamily: fonts.body }}>
            Loading topic...
          </div>
        ) : err ? (
          <div>
            <div style={{ color: b.red, fontFamily: fonts.body, fontWeight: 900, marginBottom: 8 }}>
              {err}
            </div>
            <div
              onClick={() => navigate('/dashboard')}
              style={{ color: b.red, cursor: 'pointer', fontFamily: fonts.body, fontWeight: 900 }}
            >
              Return to Dashboard
            </div>
          </div>
        ) : (
          <>
            {/* Topic header */}
            <h1
              style={{
                margin: 0,
                fontSize: 44,
                fontWeight: 950,
                color: dark ? b.greyBlue : b.blue,
                fontFamily: fonts.heading,
                letterSpacing: '-0.5px',
              }}
            >
              {topic.title}
            </h1>

            <div
              style={{
                marginTop: 10,
                color: dark ? '#7B8FA3' : '#5A6B7D',
                fontFamily: fonts.body,
                lineHeight: 1.55,
                fontSize: 18,
                maxWidth: 640,
              }}
            >
              {topic.description}
            </div>

            {/* Chips (NO SLUG CHIP) */}
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue,
                  fontSize: 14,
                  fontWeight: 900,
                  fontFamily: fonts.body,
                  color: dark ? b.greyBlue : b.blue,
                }}
              >
                Level: {levelToCEFR(topic.level)}
              </span>
              <span
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue,
                  fontSize: 14,
                  fontWeight: 900,
                  fontFamily: fonts.body,
                  color: dark ? b.greyBlue : b.blue,
                }}
              >
                Ages: {topic.age_group}
              </span>
            </div>

            {/* Activities */}
            <h2
              style={{
                marginTop: 28,
                fontSize: 26,
                fontWeight: 950,
                color: dark ? b.greyBlue : b.blue,
                fontFamily: fonts.heading,
              }}
            >
              Activities
            </h2>

            {activities.length === 0 ? (
              <div style={{ color: dark ? '#7B8FA3' : '#5A6B7D', fontFamily: fonts.body }}>
                No activities found for this topic.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                {activities.map((a) => (
                  <ActivityCard
                    key={a.id}
                    a={a}
                    dark={dark}
                    onClick={() => {
                      // If you already have an Activity page route, use it here.
                      // Common options:
                      // navigate(`/activity/${a.id}`);
                      // navigate(`/topic/${topic.id}/activity/${a.id}`);
                      console.log('[TopicView] Activity clicked:', a.id);
                      navigate(`/activity/${a.id}`);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
