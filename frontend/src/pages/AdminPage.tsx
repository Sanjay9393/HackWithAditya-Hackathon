import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Hammer,
  AlertCircle,
  Bell,
  Award,
  Calendar,
  Building2,
  FileText,
  Activity,
  ArrowRight,
  Plus,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, t, demoLogin } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/activity')
      ]).then(([dRes, aRes]) => {
        setData(dRes.data);
        setActivity(aRes.data);
      }).catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // If not admin, offer 1-click switch to Demo Admin
  if (user?.role !== 'admin') {
    return (
      <Card className="text-center py-16 max-w-lg mx-auto">
        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          {t("Panchayat Administration Access Required", "పంచాయతీ అడ్మిన్ లాగిన్ అవసరం")}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          This portal is reserved for Panchayat Secretaries, Ward Officers, and Village Data Managers to manage projects, verify complaints, and publish notices.
        </p>
        <Button
          onClick={() => demoLogin('admin')}
          variant="primary"
          icon={<ShieldCheck className="w-4 h-4" />}
        >
          {t("Sign in as Panchayat Secretary", "పంచాయతీ కార్యదర్శిగా లాగిన్ అవ్వండి")}
        </Button>
      </Card>
    );
  }

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading administration console...</div>;
  }

  const { metrics, recent_issues, recent_projects, admin_user } = data;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-600 text-white rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Gram Panchayat Administrative Console", "గ్రామ పంచాయతీ పరిపాలనా విభాగం")}
            </h1>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              Official Admin View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <strong>{admin_user.name}</strong> ({admin_user.role}). Full CRUD privileges across village works, complaints, announcements, and schemes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/projects">
            <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Work
            </Button>
          </Link>
          <Link to="/announcements">
            <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Notice
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t("Total Registered Users", "మొత్తం యూజర్లు")}
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.total_users}</div>
          <p className="text-[11px] text-slate-400 mt-1">Citizens & Panchayat Staff</p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t("Pending Complaints", "పరిశీలనలో ఉన్న సమస్యలు")}
          </span>
          <div className="mt-2 text-2xl font-bold text-amber-700">{metrics.pending_issues}</div>
          <p className="text-[11px] text-slate-400 mt-1">Require officer dispatch</p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t("Active Works Monitored", "పర్యవేక్షణలో ఉన్న పనులు")}
          </span>
          <div className="mt-2 text-2xl font-bold text-[#166534]">{metrics.total_projects}</div>
          <p className="text-[11px] text-slate-400 mt-1">Civil infrastructure works</p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t("Resolved Complaints", "పరిష్కరించిన సమస్యలు")}
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{metrics.resolved_issues}</div>
          <p className="text-[11px] text-slate-400 mt-1">Resolution audit logged</p>
        </Card>
      </div>

      {/* Management Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Civic Complaints to Dispatch */}
        <Card
          title={t("Complaints Requiring Action", "తక్షణ చర్య అవసరమైన ఫిర్యాదులు")}
          action={<Link to="/issues" className="text-xs text-[#166534] hover:underline">Manage All →</Link>}
        >
          <div className="divide-y divide-slate-100 text-xs">
            {recent_issues.map((i: any) => (
              <div key={i.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 block truncate">#{i.id}: {i.title}</span>
                  <span className="text-slate-400 text-[11px]">Ward {i.ward} • {i.category} • Reported by {i.reporter}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant={i.status === 'Resolved' ? 'success' : 'warning'} size="sm">
                    {i.status}
                  </Badge>
                  <Link to="/issues">
                    <Button size="sm" variant="outline" className="px-2 py-0.5 text-[11px]">
                      Update
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Log */}
        <Card title={t("Administrative Audit Trail", "అధికారిక లాగ్ చరిత్ర")}>
          <div className="space-y-3 text-xs">
            {activity.map((act) => (
              <div key={act.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-900 block">{act.action}</span>
                  <span className="text-slate-500 text-[11px]">{act.target}</span>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span>{act.timestamp}</span>
                  <span className="text-emerald-700 block font-medium">✓ {act.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
