import React from 'react';
import { colors as b } from '../../styles/theme';
import BrandPatterns from './BrandPatterns';
import UKLCLogo from './UKLCLogo';
import UKLCIcon from './UKLCIcon';

/** Full-page wrapper with gradient background, brand patterns, and font import */
export function PageShell({ dark, children }) {
  return (
    <div style={{
      minHeight: '100vh', position: 'relative', fontFamily: fonts.body,
      background: dark
        ? `linear-gradient(160deg, ${b.blueDk}, ${b.blue})`
        : `linear-gradient(160deg, #F7F9FC, ${b.white}, ${b.pink}22)`,
    }}>
      <BrandPatterns dark={dark} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      <style>{`
        @import url('${fontImportUrl}');
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>
    </div>
  );
}

/** Page header with back arrow, title, and theme toggle */
export function Header({ dark, title, onBack, toggleTheme }) {
  return (
    <div style={{
      padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : b.greyBlue}`,
    }}>
      <div onClick={onBack} style={{ cursor: 'pointer', display: 'flex' }}>
        <UKLCIcon type="back" size={22} color={dark ? b.greyBlue : b.blue} />
      </div>
      <span style={{
        fontSize: 16, fontWeight: 700, fontFamily: fonts.heading,
        color: dark ? b.greyBlue : b.blue, flex: 1,
      }}>{title}</span>
      <div onClick={toggleTheme} style={{
        width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
        background: dark ? 'rgba(255,255,255,0.06)' : b.greyBlue,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, color: dark ? b.greyBlue : b.blue,
      }}>{dark ? '☀' : '☾'}</div>
    </div>
  );
}

/** Progress bar with gradient fill */
export function ProgressBar({ value, dark, height = 6 }) {
  return (
    <div style={{
      height, borderRadius: height / 2, overflow: 'hidden',
      background: dark ? 'rgba(255,255,255,0.08)' : b.greyBlue,
    }}>
      <div style={{
        width: `${Math.min(100, Math.max(0, value))}%`,
        height: '100%', borderRadius: height / 2,
        background: `linear-gradient(90deg, ${b.pink}, ${b.yellow})`,
        transition: 'width 0.5s ease',
      }} />
    </div>
  );
}

/** Brand-styled button: primary (red), secondary (outline), ghost */
export function Btn({ children, onClick, disabled, variant = 'primary', style: sx = {} }) {
  const base = {
    padding: '12px 20px', borderRadius: 12, border: 'none',
    fontSize: 14, fontWeight: 700, fontFamily: fonts.heading,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s', opacity: disabled ? 0.4 : 1,
    display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
    ...sx,
  };
  const styles = {
    primary:   { ...base, background: b.red, color: b.white, boxShadow: `0 3px 12px ${b.red}33` },
    secondary: { ...base, background: 'transparent', color: b.greyBlue, border: `2px solid ${b.greyBlue}55` },
    ghost:     { ...base, background: 'transparent', color: b.blue, padding: '8px 14px' },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={styles[variant]}>
      {children}
    </button>
  );
}

/** Frosted glass card */
export function Card({ dark, children, style: sx = {} }) {
  return (
    <div style={{
      borderRadius: 18, padding: 20,
      background: dark ? 'rgba(255,255,255,0.04)' : `${b.white}EE`,
      border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : b.greyBlue}`,
      backdropFilter: 'blur(10px)',
      ...sx,
    }}>
      {children}
    </div>
  );
}
