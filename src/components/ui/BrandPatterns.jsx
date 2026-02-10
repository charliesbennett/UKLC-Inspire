import React from 'react';
import { colors as b } from '../../styles/theme';

/**
 * Decorative background patterns from UKLC Brand Guidelines:
 * dot grids, triangle rows, zigzag lines, and diamond outlines.
 */
export default function BrandPatterns({ dark }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Dot grid - top right (pink circles) */}
      <svg style={{ position: 'absolute', top: '3%', right: '-1%', opacity: dark ? 0.05 : 0.1 }} width="100" height="100" viewBox="0 0 100 100">
        {[0,1,2,3].map(r => [0,1,2,3].map(c =>
          <circle key={`${r}${c}`} cx={12 + c * 24} cy={12 + r * 24} r="4.5" fill={b.pink} />
        ))}
      </svg>

      {/* Triangle row - bottom left (blue) */}
      <svg style={{ position: 'absolute', bottom: '6%', left: '2%', opacity: dark ? 0.04 : 0.08 }} width="150" height="24" viewBox="0 0 150 24">
        {[0,1,2,3,4].map(i =>
          <polygon key={i} points={`${i*30+5},20 ${i*30+15},4 ${i*30+25},20`} fill={b.blue} opacity="0.5" />
        )}
      </svg>

      {/* Zigzag - mid right (red) */}
      <svg style={{ position: 'absolute', top: '40%', right: '1%', opacity: dark ? 0.05 : 0.08 }} width="80" height="30" viewBox="0 0 80 30">
        <polyline points="0,25 12,8 24,25 36,8 48,25 60,8 72,25" fill="none" stroke={b.red} strokeWidth="2.5" opacity="0.5" />
      </svg>

      {/* Diamond outlines */}
      {[
        { top: '20%', left: '2%',  size: 16, color: b.yellow, op: dark ? 0.08 : 0.2 },
        { top: '65%', left: '5%',  size: 12, color: b.pink,   op: dark ? 0.06 : 0.15 },
        { top: '35%', right: '8%', size: 10, color: b.greyBlue, op: dark ? 0.06 : 0.12 },
      ].map((d, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: d.top, left: d.left, right: d.right,
          width: d.size, height: d.size,
          border: `2px solid ${d.color}`,
          transform: 'rotate(45deg)',
          opacity: d.op,
        }} />
      ))}
    </div>
  );
}
