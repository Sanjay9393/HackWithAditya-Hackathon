import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Scale,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  X,
  FileText,
  Building
} from 'lucide-react';

export const SchemeComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t, language } = useAuth();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const idsParam = searchParams.get('ids') || '1,2,6';

  useEffect(() => {
    const ids = idsParam.split(',').map(Number).filter(n => !isNaN(n));
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api.post('/schemes/compare', ids)
      .then(res => setSchemes(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [idsParam]);

  const removeScheme = (id: number) => {
    setSchemes(schemes.filter(s => s.id !== id));
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500 animate-pulse">Loading scheme comparison matrix...</div>;
  }

  if (schemes.length === 0) {
    return (
      <Card className="text-center py-12">
        <Scale className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">{t("No schemes selected for comparison", "పోల్చడానికి పథకాలు ఎంపిక చేయబడలేదు")}</h3>
        <Link to="/schemes" className="mt-3 inline-block">
          <Button size="sm">{t("Browse Schemes", "పథకాలను చూడండి")}</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/schemes" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-3">
          <ArrowLeft className="w-4 h-4" /> {t("Back to Schemes", "పథకాల జాబితాకు తిరిగి వెళ్ళు")}
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("Side-by-Side Scheme Comparison", "పథకాల ముఖాముఖి పోలిక పట్టిక")}
          </h1>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
            {schemes.length} / 4 Schemes
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t("Evaluate benefits, eligibility prerequisites, and application steps across programs.", "వివిధ పథకాల ప్రయోజనాలు మరియు నిబంధనలను ఒకే చోట సరిపోల్చుకోండి.")}
        </p>
      </div>

      {/* Comparison Table */}
      <Card padding={false} className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
          <thead className="bg-slate-50 text-slate-900 font-bold">
            <tr>
              <th className="p-4 w-44 bg-slate-100/70 border-r border-slate-200 uppercase tracking-wider text-[11px] text-slate-500">
                {t("Feature", "లక్షణం")}
              </th>
              {schemes.map(s => (
                <th key={s.id} className="p-4 min-w-[240px] max-w-[280px] border-r border-slate-200 last:border-r-0 relative">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mb-1 inline-block">
                        {s.level} • {s.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {language === 'te' && s.name_te ? s.name_te : s.name}
                      </h4>
                    </div>
                    {schemes.length > 1 && (
                      <button
                        onClick={() => removeScheme(s.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Department */}
            <tr>
              <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                {t("Department", "ప్రభుత్వ శాఖ")}
              </td>
              {schemes.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0 text-slate-600">
                  {s.department}
                </td>
              ))}
            </tr>

            {/* Target Beneficiaries */}
            <tr>
              <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                {t("Target Beneficiaries", "లబ్ధిదారులు")}
              </td>
              {schemes.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0 font-medium text-slate-900">
                  {s.target_beneficiaries}
                </td>
              ))}
            </tr>

            {/* Benefits */}
            <tr>
              <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                {t("Key Benefits", "ప్రయోజనాలు")}
              </td>
              {schemes.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0 bg-emerald-50/30 text-emerald-950 font-medium">
                  🎁 {s.benefits}
                </td>
              ))}
            </tr>

            {/* Eligibility summary */}
            <tr>
              <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                {t("Eligibility Summary", "అర్హత నిబంధనలు")}
              </td>
              {schemes.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0 text-slate-600 leading-relaxed">
                  {s.eligibility_summary}
                </td>
              ))}
            </tr>

            {/* Required Documents */}
            <tr>
              <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                {t("Required Documents", "అవసరమైన పత్రాలు")}
              </td>
              {schemes.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0">
                  <ul className="space-y-1">
                    {(s.required_documents || []).map((doc: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Application Method */}
            <tr>
              <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                {t("How to Apply", "దరఖాస్తు విధానం")}
              </td>
              {schemes.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0 text-slate-600">
                  {s.application_method}
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                {t("Direct Actions", "చర్యలు")}
              </td>
              {schemes.map(s => (
                <td key={s.id} className="p-4 border-r border-slate-200 last:border-r-0 space-y-2">
                  <Link to={`/schemes/${s.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      {t("View Checklist", "చెక్‌లిస్ట్")}
                    </Button>
                  </Link>
                  <a
                    href={s.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button size="sm" className="w-full" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                      {t("Official Portal", "పోర్టల్")}
                    </Button>
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};
