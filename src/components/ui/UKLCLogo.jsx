import React from 'react';
import { colors as b, fonts } from '../../styles/theme';

/**
 * UKLC Logo rendered as styled text.
 * In production, replace with actual logo PNG/SVG from brand assets.
 * For now this matches the brand guidelines: UK (red) + LC (blue).
 *
 * @param {boolean} dark - dark mode
 * @param {'large'|'small'} size - large for login, small for headers
 */
export default function UKLCLogo({ dark, size = 'large' }) {
  const lg = size === 'large';
  return (
    <div style={{ textAlign: lg ? 'center' : 'left' }}>
      <div style={{ display: 'inline-flex', alignItems: 'baseline', lineHeight: 1 }}>
        <span style={{
          fontSize: lg ? 56 : 24,
          fontWeight: 800,
          color: b.red,
          fontFamily: fonts.heading,
          letterSpacing: '-1.5px',
        }}>UK</span>
        <span style={{
          fontSize: lg ? 56 : 24,
          fontWeight: 800,
          color: dark ? b.greyBlue : b.blue,
          fontFamily: fonts.heading,
          letterSpacing: '-1.5px',
        }}>LC</span>
      </div>
      {lg && (
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: dark ? '#8899AA' : b.blue,
          letterSpacing: '3.5px',
          marginTop: 6,
          fontFamily: fonts.body,
          opacity: 0.8,
        }}>
          EDUCATE · INSPIRE · ENRICH
        </div>
      )}
    </div>
  );
}
