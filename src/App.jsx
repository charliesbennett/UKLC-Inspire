import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import useTheme from './hooks/useTheme';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TopicView from './pages/TopicView';
import ActivityPlayer from './pages/ActivityPlayer';

function App() {
  const [user, setUser] = useState(null);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return <LoginPage dark={dark} toggleTheme={toggle} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={
          <Dashboard user={user} dark={dark} toggleTheme={toggle} />
        } />
        <Route path="/topic/:topicId" element={
          <TopicView dark={dark} toggleTheme={toggle} />
        } />
        <Route path="/activity/:activityId" element={
  <ActivityPlayer user={user} dark={dark} toggleTheme={toggle} />
} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
