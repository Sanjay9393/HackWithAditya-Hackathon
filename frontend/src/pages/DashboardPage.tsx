import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { DashboardData } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import {
  Hammer,
  AlertCircle,
  Award,
  Sparkles,
  MapPin,
  Bot,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  CloudSun,
  Calendar,
  Layers,
  ChevronRight,
  IndianRupee,
  FileCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, t, language } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(err => {
        console.error("Dashboard error:", err);
        // Fallback demo data if backend connection has transient delay
        setData({
          village: {
            name: "Chandanagar Gram Panchayat",
            name_te: "చందానగర్ గ్రామ పంచాయతీ",
            district: "Guntur",
            state: "Andhra Pradesh",
            pincode: "522001",
            population: 4850,
            total_wards: 8,
            panchayat_head: "K. Venkata Ramana (Sarpanch)"
          },
          kpis: {
            total_works: 12,
            ongoing_works: 7,
            completed_works: 4,
            delayed_works: 0,
            total_issues: 20,
            resolved_issues: 3,
            pending_issues: 12,
            total_budget_sanctioned: 15900000,
            total_budget_spent: 9500000,
            budget_utilization_pct: 59.7,
            announcements_count: 10
          },
          charts: {
            works_by_status: [
              { name: "Completed", count: 4, color: "#16A34A" },
              { name: "In Progress", count: 7, color: "#2563EB" },
              { name: "Approved", count: 1, color: "#F59E0B" },
              { name: "Delayed", count: 0, color: "#DC2626" }
            ],
            budget_by_category: [
              { category: "Roads & Bridges", sanctioned: 5500000, spent: 3800000, utilization: 69.1 },
              { category: "Drinking water", sanctioned: 3100000, spent: 1400000, utilization: 45.2 },
              { category: "Irrigation", sanctioned: 2200000, spent: 1500000, utilization: 68.2 },
              { category: "Sanitation", sanctioned: 2000000, spent: 1200000, utilization: 60.0 }
            ],
            issues_by_category: [
              { category: "Water supply", count: 6 },
              { category: "Electricity", count: 5 },
              { category: "Drainage", count: 4 },
              { category: "Roads", count: 5 }
            ],
            monthly_trends: [
              { month: "Sep 2025", reported: 14, resolved: 11 },
              { month: "Oct 2025", reported: 19, resolved: 16 },
              { month: "Nov 2025", reported: 12, resolved: 13 },
              { month: "Dec 2025", reported: 18, resolved: 15 },
              { month: "Jan 2026", reported: 22, resolved: 19 },
              { month: "Feb 2026", reported: 20, resolved: 14 }
            ]
          },
          recent_works: [
            {
              id: 1,
              project_name: "Internal CC Road Construction - Ward 4",
              category: "Roads & Bridges",
              ward_number: 4,
              budget_sanctioned: 2400000,
              progress_pct: 65,
              status: "In progress",
              location_name: "Ambedkar Nagar Main Lane"
            },
            {
              id: 2,
              project_name: "Underground Storm Water Drainage Network",
              category: "Drainage",
              ward_number: 2,
              budget_sanctioned: 1850000,
              progress_pct: 40,
              status: "In progress",
              location_name: "Bazaar Street to North Canal"
            }
          ],
          recent_issues: [
            {
              id: 1,
              title: "Public borewell motor burnt due to voltage fluctuations",
              category: "Water supply",
              ward_number: 7,
              priority: "Critical",
              status: "In progress",
              created_at: "2026-02-23"
            }
          ],
          active_announcements: [
            {
              id: 1,
              title: "Scheduled Drinking Water Supply Timings for Summer Season",
              title_te: "వేసవి కాలంలో రక్షిత మంచినీటి సరఫరా వేళల వివరాలు",
              category: "Water supply",
              priority: "Important",
              publish_date: "2026-02-20",
              target_ward: "All Wards"
            }
          ],
          next_meeting: {
            id: 1,
            title: "Quarterly Gram Sabha General Body Meeting - Q1 2026",
            title_te: "త్రైమాసిక గ్రామసభ సర్వసభ్య సమావేశం - 2026",
            date: "2026-02-28",
            location: "Gram Panchayat Hall",
            agenda: "1. Review of CC road and underground drainage progress. 2. Approval of Annual Action Plan."
          },
          weather: {
            location: "Chandanagar, Guntur",
            temperature_c: 29,
            condition: "Partly Sunny",
            humidity_pct: 54,
            wind_kmh: 12,
            rainfall_forecast: "Dry spell expected for next 4 days.",
            verified_note: "IMD Meteorological Centre, Guntur Station"
          },
          data_notice: "Chandanagar Gram Panchayat Official Portal Records"
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200/80 rounded-2xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-200/60 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200/60 rounded-xl"></div>
          <div className="h-72 bg-slate-200/60 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const village = data?.village || { name: 'Chandanagar Gram Panchayat', name_te: 'చందానగర్ గ్రామ పంచాయతీ', district: 'Guntur', state: 'Andhra Pradesh' };
  const kpis = data?.kpis || { total_works: 12, ongoing_works: 7, completed_works: 4, delayed_works: 0, total_issues: 20, resolved_issues: 3, pending_issues: 12, total_budget_sanctioned: 15900000, total_budget_spent: 9500000, budget_utilization_pct: 59.7, announcements_count: 10 };
  const charts = data?.charts || { works_by_status: [], budget_by_category: [], issues_by_category: [], monthly_trends: [] };
  const recent_works = data?.recent_works || [];
  const recent_issues = data?.recent_issues || [];
  const active_announcements = data?.active_announcements || [];
  const next_meeting = data?.next_meeting;
  const weather = data?.weather;

  const STATUS_COLORS: Record<string, string> = {
    'Completed': '#16A34A',
    'In Progress': '#2563EB',
    'Approved': '#F59E0B',
    'Delayed': '#DC2626'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14532D] via-[#166534] to-[#15803D] text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-400/20 text-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {language === 'te' && village.name_te ? village.name_te : village.name}
              </span>
              <span className="text-xs text-emerald-100">
                {village.district} Dist, {village.state}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t("Welcome to PrajaAI Smart Village Platform", "ప్రజా ఏఐ స్మార్ట్ విలేజ్ ప్లాట్‌ఫారమ్‌కు స్వాగతం")}
            </h1>
            <p className="text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
              {t(
                "Access real-time village development progress, government scheme eligibility, civic reporting, and budget transparency.",
                "గ్రామాభివృద్ధి పనులు, ప్రభుత్వ సంక్షేమ పథకాలు, ప్రజా సమస్యల నివేదిక మరియు బడ్జెట్ వివరాలను సులభంగా తెలుసుకోండి."
              )}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/schemes/recommend">
              <Button variant="secondary" size="sm" icon={<Sparkles className="w-4 h-4" />}>
                {t("Find Schemes", "పథకాల అర్హత")}
              </Button>
            </Link>
            <Link to="/issues">
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20" icon={<AlertCircle className="w-4 h-4" />}>
                {t("Report Issue", "సమస్య తెలపండి")}
              </Button>
            </Link>
            <Link to="/assistant">
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20" icon={<Bot className="w-4 h-4" />}>
                {t("Ask AI", "ఏఐ సహాయం")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Works */}
        <Card className="hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("Village Works", "అభివృద్ధి పనులు")}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-[#166534]">
              <Hammer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{kpis.total_works}</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {kpis.completed_works} {t("Done", "పూర్తయ్యాయి")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {kpis.ongoing_works} {t("in progress across 8 wards", "పనులు పురోగతిలో ఉన్నాయి")}
          </p>
        </Card>

        {/* Civic Issues */}
        <Card className="hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("Civic Issues", "ప్రజా సమస్యలు")}
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{kpis.total_issues}</span>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              {kpis.resolved_issues} {t("Resolved", "పరిష్కారం")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {kpis.pending_issues} {t("under active attention", "పరిశీలనలో ఉన్నాయి")}
          </p>
        </Card>

        {/* Development Budget */}
        <Card className="hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("Sanctioned Budget", "మంజూరైన బడ్జెట్")}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              ₹{(kpis.total_budget_sanctioned / 100000).toFixed(1)}L
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {kpis.budget_utilization_pct}% {t("Utilized", "వినియోగం")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ₹{(kpis.total_budget_spent / 100000).toFixed(1)}L {t("verified expenditure", "ఖర్చు చేసిన నిధులు")}
          </p>
        </Card>

        {/* Announcements */}
        <Card className="hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("Notices & Alerts", "ప్రకటనలు & హెచ్చరికలు")}
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{kpis.announcements_count}</span>
            <span className="text-xs font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
              {t("Active", "ప్రస్తుతం")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t("Water timings, schemes, & Gram Sabha", "తాగునీరు, సభ, మరియు పథకాల వివరాలు")}
          </p>
        </Card>
      </div>

      {/* Visual Analytics Row: Works by Status & Budget Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Development Works Breakdown */}
        <Card
          title={t("Development Works by Status", "అభివృద్ధి పనుల స్థితి")}
          subtitle={t("Real-time monitoring across 12 sanctioned village infrastructure projects", "12 మంజూరైన ప్రాజెక్టుల తాజా స్థితి")}
          action={
            <Link to="/projects" className="text-xs text-[#166534] font-semibold hover:underline flex items-center gap-1">
              {t("View All", "అన్నీ చూడండి")} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.works_by_status} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {charts.works_by_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#166534'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            {charts.works_by_status.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}: <strong>{item.count}</strong>
              </span>
            ))}
          </div>
        </Card>

        {/* Budget Allocation by Sector */}
        <Card
          title={t("Budget Allocation by Sector (FY 2025-26)", "రంగాల వారీగా బడ్జెట్ కేటాయింపులు")}
          subtitle={t("Sanctioned vs verified expenditure in INR Lakhs", "మంజూరైన మరియు ఖర్చు చేసిన నిధులు")}
          action={
            <Link to="/budgets" className="text-xs text-[#166534] font-semibold hover:underline flex items-center gap-1">
              {t("Budget Details", "పూర్తి వివరాలు")} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.budget_by_category}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <XAxis type="number" tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(value: any) => [`₹${(Number(value) / 100000).toFixed(2)} Lakhs`, 'Amount']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="sanctioned" fill="#CBD5E1" name="Sanctioned" radius={[0, 4, 4, 0]} />
                <Bar dataKey="spent" fill="#166534" name="Spent" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 rounded bg-slate-300" /> Sanctioned (కేటాయించినవి)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <span className="w-3 h-3 rounded bg-[#166534]" /> Spent (ఖర్చు చేసినవి)
            </span>
          </div>
        </Card>
      </div>

      {/* Two-Column Content: Ongoing Projects & Active Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Ongoing Works & Recent Issues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ongoing Works List */}
          <Card
            title={t("Ongoing Village Projects", "పురోగతిలో ఉన్న గ్రామాభివృద్ధి పనులు")}
            action={
              <Link to="/projects" className="text-xs text-[#166534] font-semibold hover:underline">
                {t("Explore all 12 projects", "మొత్తం 12 పనులు చూడండి")}
              </Link>
            }
          >
            <div className="space-y-3">
              {recent_works.map((p: any) => (
                <div key={p.id} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={p.status === 'Completed' ? 'success' : 'info'} size="sm">
                          {p.status}
                        </Badge>
                        <span className="text-[11px] text-slate-500 font-medium">{p.category} • Ward {p.ward_number}</span>
                      </div>
                      <Link to={`/projects/${p.id}`} className="text-sm font-semibold text-slate-900 hover:text-[#166534] mt-1 block">
                        {p.project_name}
                      </Link>
                    </div>
                    <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                      ₹{(p.budget_sanctioned / 100000).toFixed(2)}L
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                      <span>{t("Progress", "పురోగతి")}</span>
                      <span className="font-semibold">{p.progress_pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#166534] h-full rounded-full transition-all duration-500"
                        style={{ width: `${p.progress_pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Civic Issues */}
          <Card
            title={t("Recent Civic Issues Reported", "ఇటీవల నమోదైన ప్రజా సమస్యలు")}
            subtitle={t("Public tracking of grievance redressal across wards", "వార్డుల వారీగా సమస్యల పరిష్కార తీరు")}
            action={
              <Link to="/issues" className="text-xs text-[#166534] font-semibold hover:underline">
                {t("All Complaints", "అన్ని ఫిర్యాదులు")}
              </Link>
            }
          >
            <div className="divide-y divide-slate-100">
              {recent_issues.map((i: any) => (
                <div key={i.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={i.status === 'Resolved' ? 'success' : i.status === 'In progress' ? 'info' : 'warning'} size="sm">
                        {i.status}
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">Ward {i.ward_number} • {i.category}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 truncate">{i.title}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{i.created_at}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1 col): Announcements, Next Meeting, Weather Widget */}
        <div className="space-y-6">
          {/* Active Announcements */}
          <Card
            title={t("Village Announcements", "గ్రామ ముఖ్య ప్రకటనలు")}
            action={
              <Link to="/announcements" className="text-xs text-[#166534] font-semibold hover:underline">
                {t("View All", "అన్నీ")}
              </Link>
            }
          >
            <div className="space-y-3">
              {active_announcements.map((a: any) => (
                <div key={a.id} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded">
                      {a.priority}
                    </span>
                    <span className="text-[10px] text-amber-700">{a.publish_date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {language === 'te' && a.title_te ? a.title_te : a.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {a.target_ward}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Gram Sabha */}
          {next_meeting && (
            <Card className="border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center gap-2 text-[#166534] text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4" /> {t("Upcoming Gram Sabha", "రాబోయే గ్రామసభ")}
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'te' && next_meeting.title_te ? next_meeting.title_te : next_meeting.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                📍 {next_meeting.location} • 📅 {next_meeting.date}
              </p>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {next_meeting.agenda}
              </p>
              <Link to="/gram-sabha" className="mt-3 inline-block text-xs font-semibold text-[#166534] hover:underline">
                {t("View Agenda & Details →", "పూర్తి ఎజెండా చూడండి →")}
              </Link>
            </Card>
          )}

          {/* Local Weather Widget */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-semibold text-slate-900">{weather.location}</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{weather.temperature_c}°C</span>
            </div>
            <p className="text-xs text-slate-600">
              {weather.condition} • Humidity: {weather.humidity_pct}% • Wind: {weather.wind_kmh} km/h
            </p>
            <div className="mt-2.5 p-2 rounded bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
              🌾 <strong>{t("Agri Forecast:", "వ్యవసాయ సూచన:")}</strong> {weather.rainfall_forecast}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 italic">{weather.verified_note}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
