import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Scheme, DocumentChecklistItem } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  ArrowLeft,
  Award,
  ExternalLink,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  Building,
  Users,
  AlertCircle,
  HelpCircle,
  CheckSquare,
  Square
} from 'lucide-react';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, t, language } = useAuth();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [checklist, setChecklist] = useState<DocumentChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/schemes/${id}`),
      user ? api.get(`/schemes/${id}/checklist`) : Promise.resolve({ data: [] })
    ]).then(([sRes, cRes]) => {
      setScheme(sRes.data);
      setChecklist(cRes.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id, user]);

  const updateChecklistStatus = async (item: DocumentChecklistItem, newStatus: any) => {
    try {
      const res = await api.put(`/schemes/checklist/${item.id}`, { status: newStatus });
      setChecklist(checklist.map(c => c.id === item.id ? res.data : c));
    } catch (err: any) {
      console.error("Error updating checklist:", err);
    }
  };

  if (loading || !scheme) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded"></div>
        <div className="h-48 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  // Calculate readiness percentage
  const readyItems = checklist.filter(c => c.status === 'Collected' || c.status === 'Uploaded').length;
  const readinessPct = checklist.length > 0 ? Math.round((readyItems / checklist.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link to="/schemes" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-3">
          <ArrowLeft className="w-4 h-4" /> {t("Back to All Schemes", "పథకాల జాబితాకు తిరిగి వెళ్ళు")}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scheme.government_level === 'Central' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                {scheme.government_level}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {scheme.category}
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                {scheme.verification_status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'te' && scheme.name_te ? scheme.name_te : scheme.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {scheme.department} • {t("Applicability:", "వర్తింపు:")} {scheme.state_applicability}
            </p>
          </div>

          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button size="sm" icon={<ExternalLink className="w-4 h-4" />}>
              {t("Official Application Portal", "అధికారిక వెబ్‌సైట్")}
            </Button>
          </a>
        </div>
      </div>

      {/* Description */}
      <Card title={t("Scheme Overview & Description", "పథకం వివరణ మరియు ఉద్దేశం")}>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {language === 'te' && scheme.description_te ? scheme.description_te : scheme.description}
        </p>
      </Card>

      {/* Two Column Breakdown: Benefits & Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Benefits */}
        <Card title={t("Financial & Social Benefits", "లభించే ప్రయోజనాలు మరియు సహాయం")}>
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
            {language === 'te' && scheme.benefits_te ? scheme.benefits_te : scheme.benefits_text}
          </div>
          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t("Target Beneficiaries:", "లబ్ధిదారులు:")}</span>
              <span className="font-semibold text-slate-800 text-right">{scheme.target_beneficiaries}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t("Application Deadline:", "గడువు తేదీ:")}</span>
              <span className="font-semibold text-slate-800">{scheme.application_deadline}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">{t("Last Verification Date:", "పరిశీలించిన తేదీ:")}</span>
              <span className="font-medium text-slate-700">{scheme.last_verified_date}</span>
            </div>
          </div>
        </Card>

        {/* Eligibility Criteria */}
        <Card title={t("Eligibility Criteria", "అర్హత నిబంధనలు")}>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed">
            {language === 'te' && scheme.eligibility_criteria_te ? scheme.eligibility_criteria_te : scheme.eligibility_criteria_text}
          </div>
          <div className="mt-4">
            <Link to="/schemes/recommend">
              <Button variant="secondary" size="sm" className="w-full text-xs" icon={<HelpCircle className="w-4 h-4" />}>
                {t("Verify If You Qualify with AI Rule Engine →", "మీ అర్హతను రూల్ ఇంజిన్ ద్వారా పరీక్షించండి →")}
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Application Steps */}
      <Card title={t("Application Process & Steps", "దరఖాస్తు విధానం మరియు దశలు")}>
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {language === 'te' && scheme.application_steps_te ? scheme.application_steps_te : scheme.application_steps_text}
        </div>
      </Card>

      {/* MODULE 12: Interactive Document Readiness Checklist */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#166534]" />
              <span>{t("Document Readiness Checklist", "అవసరమైన పత్రాల చెక్‌లిస్ట్")}</span>
            </div>
            <span className="text-xs font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {readinessPct}% {t("Ready", "సిద్ధం")}
            </span>
          </div>
        }
        subtitle={t("Track and verify mandatory documents required to submit this application", "దరఖాస్తు చేయడానికి అవసరమైన పత్రాలను సిద్ధం చేసుకోండి")}
      >
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
          <div
            className="bg-[#166534] h-full rounded-full transition-all duration-300"
            style={{ width: `${readinessPct}%` }}
          />
        </div>

        {user ? (
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.document_name}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {item.document_type}
                    </span>
                  </div>
                  {item.notes && <p className="text-slate-500 text-[11px] mt-0.5">{item.notes}</p>}
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateChecklistStatus(item, 'Not collected')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${item.status === 'Not collected'
                        ? 'bg-slate-200 text-slate-800 font-bold'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    {t("Not collected", "లేదు")}
                  </button>
                  <button
                    onClick={() => updateChecklistStatus(item, 'Collected')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${item.status === 'Collected'
                        ? 'bg-emerald-100 text-[#166534] font-bold border border-emerald-300'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    ✓ {t("Collected", "ఉంది")}
                  </button>
                  <button
                    onClick={() => updateChecklistStatus(item, 'Uploaded')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${item.status === 'Uploaded'
                        ? 'bg-blue-100 text-blue-800 font-bold border border-blue-300'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    📁 {t("Uploaded", "అప్‌లోడ్")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <p className="text-slate-600 mb-2">
              {t("Sign in to save and track your personal document readiness checklist.", "మీ పత్రాల స్థితిని భద్రపరచడానికి లాగిన్ చేయండి.")}
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {(scheme.required_documents || []).map((doc, idx) => (
                <span key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium">
                  📄 {doc}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
