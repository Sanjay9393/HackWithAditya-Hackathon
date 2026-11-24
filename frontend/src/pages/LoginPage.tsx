import React, { useState } from 'react';
import { useAuth } from '../store/authContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { VillageLogo } from '../components/common/VillageLogo';
import { User, Shield, Sparkles, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, t } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', {
        username_or_email: username,
        password: password,
      });
      login(res.data.access_token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials. Use 1-Click Demo Accounts below.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'citizen' | 'admin') => {
    await demoLogin(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-2">
          <VillageLogo size="xl" />
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
          Praja<span className="text-[#166534]">AI</span>
          <span className="ml-2 text-base font-semibold text-emerald-700 font-telugu">(ప్రజా AI)</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
          స్మార్ట్ విలేజ్ వేదిక • చందానగర్ గ్రామ పంచాయతీ
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* 1-Click Access Portals */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-amber-50/60 border border-emerald-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Instant Role Access</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Select a verified profile to access citizen or panchayat administrator workflows:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => handleDemo('citizen')}
              className="p-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50/70 transition-all text-left shadow-2xs group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#166534]">Citizen Mode</span>
                <User className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] font-semibold text-slate-900">K. Sambaiah</p>
              <p className="text-[10px] text-slate-500">Farmer, Ward 3</p>
            </button>

            <button
              onClick={() => handleDemo('admin')}
              className="p-3 rounded-xl border border-amber-300 bg-white hover:bg-amber-50/70 transition-all text-left shadow-2xs group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-800">Admin Mode</span>
                <Shield className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="text-[11px] font-semibold text-slate-900">B. Rajasekhar</p>
              <p className="text-[10px] text-slate-500">Panchayat Secretary</p>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <Card title={t("Standard Account Sign In", "ఖాతా లాగిన్")}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t("Username or Email", "యూజర్‌నేమ్ లేదా ఈమెయిల్")}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="citizen or admin"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#166534]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t("Password", "పాస్‌వర్డ్")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#166534]"
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full mt-2"
              size="md"
            >
              {t("Sign In to PrajaAI", "లాగిన్ అవ్వండి")}
            </Button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <Link to="/" className="text-xs font-semibold text-[#166534] hover:underline">
              {t("Continue as Guest Resident →", "అతిథిగా కొనసాగండి →")}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
