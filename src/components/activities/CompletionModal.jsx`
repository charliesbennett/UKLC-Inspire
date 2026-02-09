import React from 'react';

const BADGE_EMOJIS = {
  first_activity: '🎯',
  streak_3: '🔥',
  streak_7: '⚔️',
  perfect_score: '💎',
  xp_500: '⭐',
  xp_1000: '🌟',
  all_activities: '🗺️',
};

export default function CompletionModal({ score, xpEarned, newBadges, onContinue, onRetry }) {
  const isPerfect = score === 100;
  const isGood = score >= 70;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 32, maxWidth: 420,
        width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease-out',
      }}>
        {/* Score circle */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%', margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 700, color: 'white',
          background: isPerfect ? '#10b981' : isGood ? '#3b82f6' : '#f59e0b',
        }}>
          {score}%
        </div>

        <h2 style={{ margin: '0 0 8px', fontSize: 24 }}>
          {isPerfect ? '🎉 Perfect!' : isGood ? '👏 Great job!' : '💪 Keep going!'}
        </h2>

        {/* XP earned */}
        <p style={{ fontSize: 18, color: '#6b7280', margin: '0 0 16px' }}>
          +{xpEarned} XP earned
        </p>

        {/* New badges */}
        {newBadges && newBadges.length > 0 && (
          <div style={{
            background: '#fef3c7', borderRadius: 12, padding: 16, marginBottom: 16,
          }}>
            <p style={{ fontWeight: 600, margin: '0 0 8px', fontSize: 14 }}>
              🏆 New Badge{newBadges.length > 1 ? 's' : ''} Unlocked!
            </p>
            {newBadges.map((badge) => (
              <div key={badge.key} style={{ fontSize: 16 }}>
                {BADGE_EMOJIS[badge.key] || '🏅'} {badge.name}
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          {score < 100 && (
            <button
              onClick={onRetry}
              style={{
                padding: '10px 24px', borderRadius: 8, border: '2px solid #3b82f6',
                background: 'white', color: '#3b82f6', fontSize: 16,
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          )}
          <button
            onClick={onContinue}
            style={{
              padding: '10px 24px', borderRadius: 8, border: 'none',
              background: '#3b82f6', color: 'white', fontSize: 16,
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
```
