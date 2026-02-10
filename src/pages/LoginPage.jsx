import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { colors as b, fonts } from '../styles/theme';
import { PageShell, Btn } from '../components/ui/SharedUI';
import BrandPatterns from '../components/ui/BrandPatterns';
import UKLCLogo from '../components/ui/UKLCLogo';

export default function LoginPage({ dark, toggleTheme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name, course_code: courseCode } },
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = (value, onChange, placeholder, type = 'text') => ({
    value, onChange: (e) => onChange(e.target.value), placeholder, type,
    style: {
      width: '100%', padding: '14px 16px', borderRadius: 12,
      border: `2px solid ${dark ? 'rgba(255,255,255,0.1)' : b.greyBlue}`,
      background: dark ? 'rgba(255,255,255,0.04)' : b.white,
      color: dark ? b.greyBlue : b.blue, fontSize: 14,
      fontFamily: fonts.body, outline: 'none', transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    onFocus: (e) => { e.target.style.borderColor = b.pink; },
    onBlur: (e) => { e.target.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : b.greyBlue; },
  });

  return (
    <PageShell dark={dark}>
      <button onClick={toggleTheme} style={{
        position: 'absolute', top: 16, right: 16, zIndex: 10,
        width: 38, height: 38, borderRadius: 10,
        background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(28,48,72,0.06)',
        border: 'none', cursor: 'pointer', fontSize: 15,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: dark ? b.greyBlue : b.blue,
      }}>{dark ? '☀' : '☾'}</button>

      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '24px 16px',
      }}>
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 10, animation: 'fadeDown 0.5s ease-out' }}>
            <UKLCLogo dark={dark} size="large" />
          </div>
          <p style={{
            textAlign: 'center', fontSize: 15, color: dark ? '#7B8FA3' : '#5A6B7D',
            marginBottom: 28, fontWeight: 500, fontFamily: fonts.body,
            animation: 'fadeDown 0.5s ease-out 0.1s both',
          }}>Continue your English journey</p>

          {/* Card */}
          <div style={{
            background: dark ? 'rgba(255,255,255,0.03)' : `${b.white}EE`,
            backdropFilter: 'blur(16px)', borderRadius: 22, padding: '26px 22px',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : b.greyBlue}`,
            boxShadow: dark ? '0 16px 48px rgba(0,0,0,0.4)' : '0 16px 48px rgba(28,48,72,0.06)',
            animation: 'fadeUp 0.5s ease-out 0.15s both',
          }}>
            {/* Toggle */}
            <div style={{
              display: 'flex', gap: 3, padding: 3, borderRadius: 12, marginBottom: 22,
              background: dark ? 'rgba(255,255,255,0.05)' : b.greyBlue,
            }}>
              {['Sign In', 'Register'].map((label, i) => {
                const active = i === 0 ? isLogin : !isLogin;
                return (
                  <button key={label} onClick={() => setIsLogin(i === 0)} style={{
                    flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                    background: active ? (dark ? b.blueLt : b.white) : 'transparent',
                    color: active ? (dark ? b.greyBlue : b.blue) : (dark ? '#5A6B7D' : '#8899AA'),
                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    fontFamily: fonts.heading,
                    boxShadow: active ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                  }}>{label}</button>
                );
              })}
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, marginBottom: 12,
                background: `${b.red}11`, border: `1px solid ${b.red}33`,
                fontSize: 13, color: b.red, fontFamily: fonts.body,
              }}>{error}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {!isLogin && (
                <>
                  <input {...inp(name, setName, 'Full name')} />
                  <input {...inp(courseCode, setCourseCode, 'Course code (e.g. UKLC2026SUMMER)')} />
                </>
              )}
              <input {...inp(email, setEmail, 'Email address', 'email')} />
              <input {...inp(password, setPassword, 'Password', 'password')} />

              <Btn onClick={handleSubmit} disabled={loading} style={{ width: '100%', marginTop: 4 }}>
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Btn>
            </div>

            {isLogin && (
              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <a href="#" style={{ fontSize: 12, color: dark ? '#5A6B7D' : '#8899AA', textDecoration: 'none', fontFamily: fonts.body }}>
                  Forgot password?
                </a>
              </div>
            )}

            {!isLogin && (
              <div style={{
                marginTop: 14, padding: '12px 14px', borderRadius: 12,
                background: dark ? `${b.yellow}11` : `${b.yellow}33`,
                border: `1px solid ${dark ? `${b.yellow}22` : `${b.yellow}66`}`,
              }}>
                <div style={{ fontSize: 12, color: dark ? b.yellow : b.blue, fontWeight: 600, fontFamily: fonts.body }}>
                  Free with your UKLC course code
                </div>
              </div>
            )}
          </div>

          <p style={{
            textAlign: 'center', fontSize: 12, color: dark ? '#4A5A6B' : '#8899AA',
            marginTop: 22, fontFamily: fonts.body,
          }}>
            Need help? <a href="mailto:charlie@uklc.com" style={{ color: b.red, textDecoration: 'none', fontWeight: 600 }}>charlie@uklc.com</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </PageShell>
  );
}
