import React, { useState } from 'react';
import { useAuth } from '../store/authContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { User, Shield, CheckCircle2, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, t, demoLogin } = useAuth();
  const [formData, setFormData] = useState({
    age: user?.profile?.age || 42,
    occupation: user?.profile?.occupation || 'farmer',
    is_farmer: user?.profile?.is_farmer ?? true,
    is_student: user?.profile?.is_student ?? false,
    annual_income: user?.profile?.annual_income || 120000,
    family_size: user?.profile?.family_size || 4,
    gender: user?.profile?.gender || 'Male',
    housing_status: user?.profile?.housing_status || 'semi-pucca',
    land_holding_acres: user?.profile?.land_holding_acres || 3.5,
    ward: user?.profile?.ward || 'Ward 3'
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t("Citizen Profile & Assessment Attributes", "పౌరుని ప్రొఫైల్ & వివరాలు")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t(
            "These attributes power your personalized scheme eligibility assessments across central and state welfare programs.",
            "ఈ వివరాల ఆధారంగా మీకు వర్తించే ప్రభుత్వ పథకాలను ఏఐ రూల్ ఇంజిన్ గుర్తిస్తుంది."
          )}
        </p>
      </div>

      {/* User Identity Card */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {user?.full_name ? user.full_name[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{user?.full_name || 'Guest Citizen'}</h2>
              <Badge variant={user?.role === 'admin' ? 'warning' : 'success'} size="sm">
                {user?.role || 'Guest'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'citizen@prajaai.org'}</p>
            <p className="text-xs text-slate-400 mt-0.5">Village: Chandanagar GP • Guntur District</p>
          </div>
        </div>
      </Card>

      {/* Editable Profile Attributes */}
      <Card title={t("Household & Economic Attributes", "కుటుంబ & ఆర్థిక వివరాలు")}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Age", "వయస్సు")}</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Gender", "లింగం")}</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Primary Occupation", "వృత్తి")}</label>
            <select
              value={formData.occupation}
              onChange={(e) => {
                const occ = e.target.value;
                setFormData({
                  ...formData,
                  occupation: occ,
                  is_farmer: occ === 'farmer',
                  is_student: occ === 'student'
                });
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
            >
              <option value="farmer">Farmer / Cultivator</option>
              <option value="student">Student</option>
              <option value="wage_worker">Daily Wage / MGNREGA</option>
              <option value="self_employed">Small Trader / Artisan</option>
              <option value="homemaker">Homemaker</option>
              <option value="retired">Senior Citizen</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Annual Income (₹)", "వార్షిక ఆదాయం")}</label>
              <input
                type="number"
                value={formData.annual_income}
                onChange={(e) => setFormData({ ...formData, annual_income: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Land Holding (Acres)", "భూమి (ఎకరాలు)")}</label>
              <input
                type="number"
                step="0.5"
                value={formData.land_holding_acres}
                onChange={(e) => setFormData({ ...formData, land_holding_acres: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            {saved && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {t("Profile Saved!", "భద్రపరచబడింది!")}
              </span>
            )}
            <Button type="submit" size="sm" icon={<Save className="w-3.5 h-3.5" />}>
              {t("Save Profile", "భద్రపరచు")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
