import React from 'react';
import { colors as b } from '../styles/theme';

/**
 * Custom SVG icons following UKLC's geometric brand style.
 * Uses brand colours for fills/strokes. Pass `color` for nav/UI icons.
 *
 * Usage: <UKLCIcon type="food" size={24} />
 */
export default function UKLCIcon({ type, size = 24, color = b.blue }) {
  const s = { width: size, height: size, display: 'block', flexShrink: 0 };

  const icons = {
    // ── Navigation / UI ──
    back:  <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    right: <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    left:  <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    check: <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    x:     <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></svg>,
    flip:  <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 019-9m9 9a9 9 0 01-9 9" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M12 3l3 3-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 21l-3-3 3-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    bulb:  <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M9 21h6M12 3a6 6 0 014 10.5V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-3.5A6 6 0 0112 3z" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
    clock: <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,

    // ── Bottom nav ──
    home:  <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 12l9-8 9 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={color} strokeWidth="2"/></svg>,
    chart: <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="14" width="4" height="6" rx="1" fill={color} opacity="0.4"/><rect x="10" y="8" width="4" height="12" rx="1" fill={color} opacity="0.6"/><rect x="16" y="4" width="4" height="16" rx="1" fill={color} opacity="0.9"/></svg>,
    badge: <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="6" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5"/><path d="M9 15l-2 6 5-3 5 3-2-6" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    user:  <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,

    // ── Stats ──
    flame: <svg style={s} viewBox="0 0 32 32" fill="none"><path d="M16 4C16 4 8 12 8 20a8 8 0 0016 0c0-8-8-16-8-16z" fill={b.red} opacity="0.9"/><path d="M16 14c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z" fill={b.yellow}/></svg>,
    star:  <svg style={s} viewBox="0 0 32 32" fill="none"><path d="M16 3l3.7 7.5 8.3 1.2-6 5.8 1.4 8.3L16 22l-7.4 3.8 1.4-8.3-6-5.8 8.3-1.2z" fill={b.yellow} stroke={b.blue} strokeWidth="0.5"/></svg>,
    trophy:<svg style={s} viewBox="0 0 32 32" fill="none"><rect x="11" y="22" width="10" height="3" rx="1" fill={b.blue} opacity="0.3"/><rect x="9" y="25" width="14" height="2" rx="1" fill={b.blue} opacity="0.5"/><path d="M10 6h12v10a6 6 0 01-12 0V6z" fill={b.yellow}/><path d="M10 8H6a2 2 0 000 4h1a5 5 0 003-1V8z" fill={b.pink}/><path d="M22 8h4a2 2 0 010 4h-1a5 5 0 01-3-1V8z" fill={b.pink}/><circle cx="16" cy="12" r="2" fill={b.red}/></svg>,
    book:  <svg style={s} viewBox="0 0 32 32" fill="none"><rect x="6" y="5" width="20" height="22" rx="2" fill={b.greyBlue}/><rect x="6" y="5" width="10" height="22" rx="1" fill={b.blue} opacity="0.15"/><path d="M16 7v18M10 11h-2M10 15h-2M22 11h-2M22 15h-2" stroke={b.blue} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/></svg>,

    // ── Topics ──
    food:    <svg style={s} viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="11" fill={b.greyBlue} stroke={b.blue} strokeWidth="1.5"/><circle cx="16" cy="16" r="7" fill="none" stroke={b.pink} strokeWidth="1.5"/><path d="M6 8V4M6 4L6 10M4 4h4" stroke={b.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M27 4v5a2 2 0 01-2 2h0a2 2 0 01-2-2V4" stroke={b.red} strokeWidth="1.8" strokeLinecap="round"/><path d="M25 11v5" stroke={b.red} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    music:   <svg style={s} viewBox="0 0 32 32" fill="none"><circle cx="10" cy="24" r="4" fill={b.pink}/><circle cx="24" cy="20" r="4" fill={b.yellow}/><path d="M14 24V8l14-4v16" stroke={b.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    plane:   <svg style={s} viewBox="0 0 32 32" fill="none"><path d="M4 17l24-11-7 22-5-8z" fill={b.greyBlue} stroke={b.blue} strokeWidth="1.5" strokeLinejoin="round"/><path d="M28 6L17 20" stroke={b.red} strokeWidth="1.5"/></svg>,
    robot:   <svg style={s} viewBox="0 0 32 32" fill="none"><rect x="8" y="10" width="16" height="14" rx="3" fill={b.greyBlue}/><rect x="8" y="10" width="16" height="14" rx="3" stroke={b.blue} strokeWidth="1.5"/><circle cx="13" cy="17" r="2" fill={b.blue}/><circle cx="19" cy="17" r="2" fill={b.blue}/><line x1="16" y1="4" x2="16" y2="10" stroke={b.blue} strokeWidth="1.5"/><circle cx="16" cy="4" r="2" fill={b.yellow}/><rect x="4" y="14" width="3" height="6" rx="1.5" fill={b.pink}/><rect x="25" y="14" width="3" height="6" rx="1.5" fill={b.pink}/></svg>,

    // ── Activity types ──
    vocab:   <svg style={s} viewBox="0 0 32 32" fill="none"><rect x="5" y="4" width="22" height="24" rx="3" fill={b.greyBlue}/><rect x="5" y="4" width="22" height="24" rx="3" stroke={b.blue} strokeWidth="1.5"/><path d="M10 11h12M10 16h8M10 21h10" stroke={b.blue} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/><circle cx="22" cy="22" r="5" fill={b.yellow}/><path d="M20 22l1.5 1.5 3-3" stroke={b.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    reading: <svg style={s} viewBox="0 0 32 32" fill="none"><path d="M4 6c4-2 8-1 12 1 4-2 8-3 12-1v20c-4-2-8-1-12 1-4-2-8-3-12-1V6z" fill={b.greyBlue} stroke={b.blue} strokeWidth="1.5"/><path d="M16 7v20" stroke={b.blue} strokeWidth="1" opacity="0.3"/><path d="M8 11h5M8 15h4M8 19h5M20 11h5M20 15h4M20 19h5" stroke={b.blue} strokeWidth="1" strokeLinecap="round" opacity="0.3"/></svg>,
    grammar: <svg style={s} viewBox="0 0 32 32" fill="none"><rect x="4" y="6" width="24" height="20" rx="3" fill={b.pink} opacity="0.5"/><rect x="4" y="6" width="24" height="20" rx="3" stroke={b.blue} strokeWidth="1.5"/><path d="M9 13h6M9 18h10" stroke={b.blue} strokeWidth="2" strokeLinecap="round"/><circle cx="23" cy="13" r="3" fill={b.yellow}/><path d="M21.5 13l1 1 2.5-2.5" stroke={b.blue} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    design:  <svg style={s} viewBox="0 0 32 32" fill="none"><rect x="6" y="4" width="20" height="24" rx="3" fill={b.greyBlue}/><rect x="9" y="8" width="14" height="10" rx="2" fill={b.pink}/><circle cx="16" cy="13" r="3" fill={b.red} opacity="0.6"/><path d="M10 22h12M12 25h8" stroke={b.blue} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/></svg>,
  };

  return icons[type] || null;
}
