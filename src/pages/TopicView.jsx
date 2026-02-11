import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { colors as b, fonts } from '../styles/theme';
import { PageShell } from '../components/ui/SharedUI';
import UKLCLogo from '../components/ui/UKLCLogo';

export default function TopicPage({ dark }) {
  const navigate = useNavigate();
  const { id } = useParams(); // <-- /topic/:id
  const topicId = Number(id);

  const [topic, setTopic] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchTopicAndActivities = async () => {
      try {
        setLoading(true);
        setErr(null);

        if (!topicId || Number.isNaN(topicId)) {
          throw new Error('Invalid topic id in URL');
        }

        console.log('[TopicPage] Fetching topic + activities for id:', topicId);

        // 1) Fetch topic
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .select('id, title, description, slug, level, age_group, is_published')
          .eq('id', topicId)
          .maybeSingle();

        console.log('[TopicPage] Topic response:', { topicData, topicError });

        if (topicError) throw topicError;
        if (!topicData) throw new Error('Topic not found in database');

        // Optional: if you only want published topics visible in the app
        if (topicData.is_published === false) {
          throw new Error('Topic exists but is not published');
        }

        setTopic(topicData);

        // 2) Fetch activities
        const { data: acts, error: actsError } = await supabase
          .from('activities')
          .select('id, topic_id, title, activity_type, order_number, content')
          .eq('topic_id', topicId)
          .order('order_number', { ascending: true });

        console.log('[TopicPage] Activities response:', { acts, actsError });

        if (actsError) throw actsError;

        setActivities(acts || []);
      } catch (e) {
        console.error('[TopicPage] Error:', e);
        setErr(e?.message || 'Failed to load topic');
        setTopic(null);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicAndActivities();
  }, [topicId]);

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
            fontWeight: 700,
            fontFamily: fonts.body,
            background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue,
            color: dark ? b.greyBlue : b.blue,
          }}
        >
          ← Dashboard
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '22px 20px 80px' }}>
        {loading ? (
          <div style={{ color: dark ? '#7B8FA3' : '#5A6B7D', fontFamily: fonts.body }}>
            Loading topic...
          </div>
        ) : err ? (
          <div>
            <div style={{ color: b.red, fontFamily: fonts.body, fontWeight: 700, marginBottom: 8 }}>
              {err}
            </div>
            <div
              onClick={() => navigate('/dashboard')}
              style={{ color: b.red, cursor: 'pointer', fontFamily: fonts.body, fontWeight: 700 }}
            >
              Return to Dashboard
            </div>
          </div>
        ) : (
          <>
            {/* Topic Header */}
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 900,
                color: dark ? b.greyBlue : b.blue,
                fontFamily: fonts.heading,
              }}
            >
              {topic.title}
            </h1>

            <div
              style={{
                marginTop: 8,
                color: dark ? '#7B8FA3' : '#5A6B7D',
                fontFamily: fonts.body,
                lineHeight: 1.5,
              }}
            >
              {topic.description}
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: fonts.body,
                  color: dark ? b.greyBlue : b.blue,
                }}
              >
                Level: {topic.level}
              </span>
              <span
                style={{
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue,
                  fontSize: 12,
                  fontWeight: 700,
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
                marginTop: 22,
                fontSize: 16,
                fontWeight: 900,
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activities.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 16,
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : b.greyBlue}`,
                      background: dark ? 'rgba(255,255,255,0.03)' : `${b.white}CC`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: fonts.heading,
                        fontWeight: 800,
                        color: dark ? b.greyBlue : b.blue,
                        marginBottom: 4,
                      }}
                    >
                      {a.order_number}. {a.title}
                    </div>
                    <div style={{ fontFamily: fonts.body, color: dark ? '#7B8FA3' : '#5A6B7D', fontSize: 12 }}>
                      Type: {a.activity_type}
                    </div>

                    {/* Optional: route to activity page if you have one */}
                    {/* <button onClick={() => navigate(`/activity/${a.id}`)}>Open</button> */}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
