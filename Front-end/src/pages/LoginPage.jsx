import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '@/store/authSlice';
import { Globe, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('appLanguage', lng);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
          className="flex items-center space-x-2 bg-dark-secondary px-3 py-1.5 rounded-lg text-dark-text hover:bg-gray-700 transition-colors"
        >
          <Globe size={18} />
          <span className="uppercase">{i18n.language}</span>
        </button>
      </div>

      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl text-white mb-2">
          {t('login_title')} - DEMO APP
        </h1>
        <p className="text-gray-400">
          {t('system_name')}
        </p>
      </div>

      {/* Login */}
      <div className="w-full max-w-md bg-dark-card p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h2 className="text-2xl text-white text-center mb-8">
          {t('login_title')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder={t('email')}
              className="w-full bg-dark-bg border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-dark-primary transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="password"
              placeholder={t('password')}
              className="w-full bg-dark-bg border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-dark-primary transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-dark-primary text-sm hover:underline">
              {t('forgot_password')}
            </a>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark-primary hover:bg-indigo-600 text-white py-3 rounded-xl transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? '...' : t('login_button')}
          </button>
        </form>

      </div>

      <footer className="mt-12 text-gray-600 text-sm">
        © 2026 DEMO APP. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
