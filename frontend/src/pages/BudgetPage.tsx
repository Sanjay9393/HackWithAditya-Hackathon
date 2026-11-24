import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  IndianRupee,
  PieChart as PieIcon,
  TrendingUp,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const BudgetPage: React.FC = () => {
  const { t, language } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFY, setSelectedFY] = useState('2025-2026');

  useEffect(() => {
    setLoading(true);
    api.get('/budgets/analytics', { params: { financial_year: selectedFY } })
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedFY]);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>)}
        </div>
        <div className="h-72 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  const PIE_COLORS = ['#166534', '#2563EB', '#D97706', '#7C3AED', '#059669', '#DC2626', '#475569'];

  return (
    <div className="space-y-6">
      {/* Page Title & FY Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Village Budget Transparency", "గ్రామ బడ్జెట్ పారదర్శకత")}
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              {t("Audited Model", "ఆడిట్ చేయబడిన వివరాలు")}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              "Public record of central grants, state allocations, and Gram Panchayat expenditure.",
              "కేంద్ర నిధులు, రాష్ట్ర గ్రాంట్లు మరియు గ్రామ పంచాయతీ ఖర్చుల అధికారిక గణాంకాలు."
            )}
          </p>
        </div>

        {/* Financial Year selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <select
            value={selectedFY}
            onChange={(e) => setSelectedFY(e.target.value)}
            className="py-1.5 px-3 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-[#166534]"
          >
            <option value="2025-2026">Financial Year 2025-26</option>
            <option value="2024-2025">Financial Year 2024-25</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t("Total Sanctioned", "మొత్తం మంజూరైన బడ్జెట్")}
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ₹{(data.total_sanctioned / 100000).toFixed(2)}L
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            15th FC Grants + OSR + State funds
          </p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t("Verified Expenditure", "ఖర్చు చేసిన నిధులు")}
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            ₹{(data.total_spent / 100000).toFixed(2)}L
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Voucher-verified field disbursements
          </p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t("Remaining Allocation", "మిగిలిన నిధులు")}
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-800">
            ₹{(data.remaining_balance / 100000).toFixed(2)}L
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Committed to active phase milestones
          </p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t("Budget Utilization", "నిధుల వినియోగ శాతం")}
          </span>
          <div className="mt-2 text-2xl font-bold text-[#166534]">
            {data.utilization_pct}%
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            On track as per quarterly target
          </p>
        </Card>
      </div>

      {/* AI Budget Intelligence Panel */}
      <Card
        className="bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/30 border-emerald-200"
        title={
          <div className="flex items-center gap-2 text-sm font-bold text-[#166534]">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            {t("AI Village Budget Insights", "ఏఐ బడ్జెట్ విశ్లేషణ మరియు వాస్తవాలు")}
          </div>
        }
        subtitle={t("Objective data-driven insights grounded in certified panchayat resolutions", "ధృవీకరించబడిన నిధుల ఆధారంగా రూపొందించిన విశ్లేషణ")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
          {data.ai_insights.map((insight: string, idx: number) => (
            <div key={idx} className="p-3 rounded-lg bg-white border border-emerald-100 flex items-start gap-2.5 shadow-2xs">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{t("Data Source:", "సమాచార మూలం:")} {data.source_document}</span>
          <span className="font-semibold text-emerald-800">{data.verification_status}</span>
        </div>
      </Card>

      {/* Recharts Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Allocation Breakdown */}
        <Card title={t("Budget Sanctioned vs Spent by Sector", "రంగాల వారీగా బడ్జెట్ & ఖర్చుల గ్రాఫ్")}>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categories} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="category" angle={-15} textAnchor="end" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${(Number(val) / 100000).toFixed(2)} Lakhs`, 'Amount']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="sanctioned" fill="#CBD5E1" name="Sanctioned (మంజూరు)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" fill="#166534" name="Spent (ఖర్చు)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sector Proportion Pie */}
        <Card title={t("Sector Expenditure Distribution", "ఖర్చుల నిష్పత్తి శాతం")}>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categories}
                  dataKey="spent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {data.categories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹${(Number(val) / 100000).toFixed(2)} Lakhs`, 'Spent']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Projects Budget Table */}
      <Card
        title={t("Project-Level Financial Register", "ప్రాజెక్టుల వారీగా ఖర్చుల రిజిస్టర్")}
        subtitle={t("Itemized audit table for all village works", "గ్రామ అభివృద్ధి పనుల వివరాల పట్టిక")}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t("Project Name", "పని పేరు")}</th>
                <th className="px-4 py-3">{t("Department", "శాఖ")}</th>
                <th className="px-4 py-3">{t("Sanctioned", "మంజూరైనది")}</th>
                <th className="px-4 py-3">{t("Spent", "ఖర్చు")}</th>
                <th className="px-4 py-3">{t("Balance", "మిగిలినది")}</th>
                <th className="px-4 py-3">{t("Status", "స్థితి")}</th>
                <th className="px-4 py-3">{t("Contractor", "కాంట్రాక్టర్")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.projects.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                    {p.project_name}
                  </td>
                  <td className="px-4 py-3">{p.department}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    ₹{(p.sanctioned).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">
                    ₹{(p.spent).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    ₹{(p.remaining).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === 'Completed' ? 'success' : 'info'} size="sm">
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 truncate max-w-[140px] text-slate-500">
                    {p.contractor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
