import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/authContext';
import { Bell, Globe, User as UserIcon, Shield, Sparkles, CheckCircle2, ChevronDown, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { NotificationItem } from '../../types';
import { VillageLogo } from '../common/VillageLogo';

export const Header: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const { user, language, setLanguage, demoLogin, logout, t } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/notifications')
        .then(res => setNotifications(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <VillageLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                Praja<span className="text-[#166534]">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-[#166534] text-[11px] font-medium px-2 py-0.5 rounded-full border border-emerald-200/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Chandanagar GP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {t("Guntur District, Andhra Pradesh", "గుంటూరు జిల్లా, ఆంధ్రప్రదేశ్")} • {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language selector toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded font-medium transition-all ${
              language === 'en'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('te')}
            className={`px-2 py-1 rounded font-medium transition-all ${
              language === 'te'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            తెలుగు
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
                <span className="font-semibold text-xs text-slate-800">
                  {t("Notifications", "నోటిఫికేషన్లు")} ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-[#166534] hover:underline font-medium">
                    {t("Mark all read", "అన్నీ చదివినట్లు గుర్తించు")}
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-400 text-center">{t("No notifications yet", "నోటిఫికేషన్లు లేవు")}</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-emerald-50/40' : ''}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{language === 'te' && n.title_te ? n.title_te : n.title}</span>
                        {!n.is_read && <span className="h-2 w-2 rounded-full bg-emerald-600"></span>}
                      </div>
                      <p className="text-slate-600 mt-1">{language === 'te' && n.message_te ? n.message_te : n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Demo Account Quick Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-xs text-slate-700"
          >
            <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-white text-xs ${user?.role === 'admin' ? 'bg-amber-600' : 'bg-[#166534]'}`}>
              {user ? user.full_name[0] : 'G'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-semibold block leading-tight text-slate-900 truncate max-w-[120px]">
                {user ? user.full_name.split(' ')[0] : 'Guest'}
              </span>
              <span className="text-[10px] text-slate-500 capitalize block">
                {user ? user.role : 'Click to Login'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900">{user?.full_name || 'Guest User'}</p>
                <p className="text-slate-500 text-[11px]">{user?.email || 'Not logged in'}</p>
              </div>

              <div className="py-2 space-y-1">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("Switch Account", "ఖాతా మార్పు")}
                </p>
                <button
                  onClick={() => { demoLogin('citizen'); setShowUserMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-between ${user?.role === 'citizen' ? 'bg-emerald-50 text-[#166534] font-semibold' : 'text-slate-700'}`}
                >
                  <span className="flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5" /> Citizen Portal (K. Sambaiah)
                  </span>
                  {user?.role === 'citizen' && <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />}
                </button>
                <button
                  onClick={() => { demoLogin('admin'); setShowUserMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-between ${user?.role === 'admin' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-700'}`}
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Panchayat Secretary (Admin)
                  </span>
                  {user?.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />}
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1.5">
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-3 py-1.5 text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  {t("My Profile & Preferences", "నా ప్రొఫైల్ & వివరాలు")}
                </Link>
                {user ? (
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> {t("Sign Out", "లాగ్ అవుట్")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-3 py-1.5 text-[#166534] font-semibold hover:bg-emerald-50 rounded-lg"
                  >
                    {t("Sign In / Register", "లాగిన్ అవ్వండి")}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
