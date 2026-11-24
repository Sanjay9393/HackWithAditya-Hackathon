import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { EmploymentRecord } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Briefcase,
  IndianRupee,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
  Users
} from 'lucide-react';

export const EmploymentPage: React.FC = () => {
  const { t, language } = useAuth();
  const [records, setRecords] = useState<EmploymentRecord[]>([]);
  const [mgnregaGuide, setMgnregaGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/employment'),
      api.get('/employment/mgnrega-guidance')
    ]).then(([eRes, mRes]) => {
      setRecords(eRes.data);
      setMgnregaGuide(mRes.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("Local Village Employment & MGNREGA Hub", "గ్రామీణ ఉపాధి & ఉపాధి హామీ (MGNREGA) కేంద్రం")}
          </h1>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
            Statutory 100 Days Guarantee
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t(
            "Access notified daily wage rates, job card guidance, work demand procedures, and active rural worksites.",
            "ఉపాధి హామీ రోజువారీ కూలీ రేట్లు, జాబ్ కార్డు పొందే విధానం మరియు ప్రస్తుతం జరుగుతున్న పనుల వివరాలు."
          )}
        </p>
      </div>

      {/* MGNREGA Statutory Guide Banner */}
      {mgnregaGuide && (
        <Card className="bg-gradient-to-r from-emerald-50/70 via-white to-blue-50/40 border-emerald-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#166534] block">
                {t("National Rural Employment Guarantee (AP)", "జాతీయ గ్రామీణ ఉపాధి హామీ పథకం")}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {t("Statutory Daily Wage:", "నోటిఫై చేసిన రోజువారీ కూలీ:")} {mgnregaGuide.daily_wage_rate}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-600 block">
                {t("Guaranteed Work:", "చట్టబద్ధమైన హామీ:")} {mgnregaGuide.guaranteed_days}
              </span>
            </div>
          </div>

          {/* 5 Steps to Apply */}
          <div className="mt-4">
            <h3 className="text-xs font-bold text-slate-900 mb-2">
              📋 {t("How to Get a Job Card and Demand Work:", "జాబ్ కార్డు పొందడం మరియు పని కోరే విధానం:")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-slate-700">
              {mgnregaGuide.steps_to_apply.map((st: string, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                  <span className="font-semibold text-emerald-800 block mb-0.5">{st.split(':')[0]}</span>
                  <span className="text-slate-600">{st.split(':')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Active Employment Opportunities */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">
          {t("Local Public Works & Village Opportunities", "గ్రామంలో అందుబాటులో ఉన్న పనులు & అవకాశాలు")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map((rec) => (
            <Card key={rec.id} className="hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-bold text-slate-900">
                  {language === 'te' && rec.title_te ? rec.title_te : rec.title}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {rec.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {rec.description}
              </p>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("Wage Rate:", "వేతనం:")}</span>
                  <span className="font-bold text-emerald-800">{rec.wage_rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("Eligibility:", "అర్హత:")}</span>
                  <span className="font-medium text-slate-800 text-right">{rec.eligibility}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                <strong>{t("How to Apply:", "దరఖాస్తు విధానం:")}</strong> {rec.application_procedure}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
