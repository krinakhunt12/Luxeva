import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setToken } from '../../../utils/apiClient';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    if (token) {
      try { setToken(token, true); } catch (e) {}
      try { localStorage.setItem('luxeva_user', JSON.stringify({})); } catch (e) {}
      window.dispatchEvent(new Event('luxeva:user-changed'));
    }
    navigate('/');
  }, [search, navigate]);

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        <div className="bg-white border p-10 rounded shadow-sm">Signing you in…</div>
      </div>
    </div>
  );
}
