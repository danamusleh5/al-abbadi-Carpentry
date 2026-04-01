import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import FullGallery from './pages/FullGallery';
import FullResults from './pages/FullResults';
import './App.css';
import { apiFetch } from './lib/api';

function AdminProtected() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'authed' | 'unauth'>('checking');

  useEffect(() => {
    apiFetch('/api/admin/verify', {
      method: 'GET'
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('invalid');
        return res.json();
      })
      .then(() => setStatus('authed'))
      .catch(() => {
        setStatus('unauth');
      });
  }, []);

  useEffect(() => {
    if (status === 'unauth') navigate('/admin/login', { replace: true });
  }, [status, navigate]);

  if (status === 'authed') return <Admin />;
  if (status === 'unauth') return <Navigate to="/admin/login" replace />;
  return <div style={{ paddingTop: 120, textAlign: 'center' }}>Loading...</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminProtected />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/gallery" element={<FullGallery />} />
        <Route path="/results" element={<FullResults />} />
      </Routes>
    </Router>
  );
}

export default App;
