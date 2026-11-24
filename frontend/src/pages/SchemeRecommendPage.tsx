import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { SchemeRecommendation, UserProfile } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  User,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Sliders,
  FileText,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const SchemeRecommendPage: React.FC = () => {
  const { user, t, language } = useAuth();

  // Profile form state initialized from user profile or demo farmer default
  const [profile, setProfile] = useState<UserProfile>({
    age: 42,
    state: "Andhra Pradesh",
    district: "Guntur",
    village: "Chandanagar",
    occupation: "farmer",
    is_farmer: true,
    is_student: false,
    annual_income: 120000,
    family_size: 4,
    gender: "Male",
    disability_status: false,
    housing_status: "semi-pucca",
    land_holding_acres: 3.5
  });

  const [recommendations, setRecommendations] = useState<SchemeRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluated, setEvaluated] = useState(false);

  // Sync with current user profile if available
  useEffect(() => {
    if (user?.profile) {
      setProfile({
        age: user.profile.age ?? 42,
        state: user.profile.state ?? "Andhra Pradesh",
        district: user.profile.district ?? "Guntur",
        village: user.profile.village ?? "Chandanagar",
        occupation: user.profile.occupation ?? "farmer",
        is_farmer: user.profile.is_farmer ?? true,
        is_student: user.profile.is_student ?? false,
        annual_income: user.profile.annual_income ?? 120000,
        family_size: user.profile.family_size ?? 4,
        gender: user.profile.gender ?? "Male",
        disability_status: user.profile.disability_status ?? false,
        housing_status: user.profile.housing_status ?? "semi-pucca",
        land_holding_acres: user.profile.land_holding_acres ?? 3.5
      });
    }
  }, [user]);

  const runRecommendation = async () => {
    setLoading(true);
    try {
      const res = await api.post('/schemes/recommend', profile);
      setRecommendations(res.data);
      setEvaluated(true);
    } catch (err: any) {
      console.error(err);
      alert("Error evaluating eligibility: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on mount
  useEffect(() => {
    runRecommendation();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status.includes("Potential match")) {
      return <Badge variant="success">✓ {t("Potential Match", "అర్హత అవకాశం ఉంది")}</Badge>;
    }
    if (status.includes("Needs more information")) {
      return <Badge variant="warning">ℹ {t("Needs More Info", "మరిన్ని వివరాలు కావాలి")}</Badge>;
    }
    return <Badge variant="danger">✕ {t("Likely Ineligible", "సరిపోకపోవచ్చు")}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-xl text-[#166534]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Personalized Scheme Eligibility Assessment", "వ్యక్తిగత ప్రభుత్వ పథకాల అర్హత పరిశీలన")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t(
                "Structured rule evaluator compares your household profile against official government eligibility criteria with full transparency.",
                "మీ కుటుంబ వివరాలను ప్రభుత్వ అధికారిక నిబంధనలతో పోల్చి, సరిపోయే పథకాలను పారదర్శకంగా గుర్తిస్తుంది."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Profile Form + Ranked Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Citizen Profile Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card
            title={t("Citizen Assessment Profile", "పౌరుని వివరాల పత్రం")}
            subtitle={t("Modify profile attributes to re-run assessment rules in real time", "వివరాలు మార్చి ఫలితాలను వెంటనే చూడండి")}
          >
            <div className="space-y-3.5 text-xs">
              {/* Occupation */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t("Primary Occupation", "వృత్తి")}</label>
                <select
                  value={profile.occupation}
                  onChange={(e) => {
                    const occ = e.target.value;
                    setProfile({
                      ...profile,
                      occupation: occ,
                      is_farmer: occ === 'farmer',
                      is_student: occ === 'student'
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-[#166534]"
                >
                  <option value="farmer">Farmer / Cultivator (రైతు)</option>
                  <option value="student">Student (విద్యార్థి)</option>
                  <option value="wage_worker">Daily Wage / MGNREGA Laborer (కూలీ)</option>
                  <option value="self_employed">Small Trader / Artisan (చేతివృత్తులు)</option>
                  <option value="homemaker">Homemaker (గృహిణి)</option>
                  <option value="retired">Senior Citizen / Retired (వృద్ధులు)</option>
                </select>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t("Age (Years)", "వయస్సు")}</label>
                  <input
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t("Gender", "లింగం")}</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="Male">Male (పురుషుడు)</option>
                    <option value="Female">Female (స్త్రీ)</option>
                    <option value="Other">Other (ఇతర)</option>
                  </select>
                </div>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t("Annual Family Income (₹)", "కుటుంబ వార్షిక ఆదాయం (రూ.)")}
                </label>
                <input
                  type="number"
                  step="10000"
                  value={profile.annual_income || ''}
                  onChange={(e) => setProfile({ ...profile, annual_income: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {profile.annual_income && profile.annual_income <= 250000 ? "Qualifies for BPL / Rice Card limits" : "Standard ceiling"}
                </span>
              </div>

              {/* Farmer: Land Holding */}
              {profile.is_farmer && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t("Agricultural Land Holding (Acres)", "వ్యవసాయ భూమి (ఎకరాలు)")}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={profile.land_holding_acres || ''}
                    onChange={(e) => setProfile({ ...profile, land_holding_acres: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                  <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
                    {profile.land_holding_acres && profile.land_holding_acres <= 5.0 ? "Small & Marginal Farmer category" : "Large Farmer"}
                  </span>
                </div>
              )}

              {/* Housing Condition */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t("Current Housing Type", "ఇంటి రకం")}</label>
                <select
                  value={profile.housing_status}
                  onChange={(e) => setProfile({ ...profile, housing_status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  <option value="kutcha">Kutcha (మట్టి/పూరి ఇల్లు - Eligible for Housing Scheme)</option>
                  <option value="semi-pucca">Semi-Pucca (పాక్షిక పక్కా ఇల్లు)</option>
                  <option value="pucca">Pucca (పక్కా ఇల్లు)</option>
                  <option value="homeless">Houseless / Tenant (ఇల్లు లేనివారు)</option>
                </select>
              </div>

              {/* Disability toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700">{t("Person with Disability?", "దివ్యాంగులా?")}</span>
                <input
                  type="checkbox"
                  checked={profile.disability_status}
                  onChange={(e) => setProfile({ ...profile, disability_status: e.target.checked })}
                  className="rounded text-[#166534] focus:ring-[#166534]"
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={runRecommendation}
                  isLoading={loading}
                  size="sm"
                  className="w-full"
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  {t("Re-Evaluate Eligibility", "అర్హతను పునఃపరిశీలించండి")}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (2 cols): Ranked Scheme Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              {recommendations.length} {t("Evaluated Government Schemes", "పరిశీలించిన పథకాలు")}
            </span>
            <span className="text-[11px] text-slate-400 italic">
              {t("Ranked by eligibility rule match score", "అర్హత శాతం ఆధారంగా వరుస క్రమం")}
            </span>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-44 bg-slate-200/60 rounded-xl"></div>)}
            </div>
          ) : recommendations.length === 0 ? (
            <Card className="text-center py-10">
              <p className="text-xs text-slate-500">No recommendation results available.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, index) => {
                const s = rec.scheme;
                const isTopMatch = rec.match_score >= 75;
                return (
                  <Card
                    key={s.id}
                    className={`transition-all duration-200 ${
                      isTopMatch ? 'border-emerald-300 shadow-xs' : 'border-slate-200/80 opacity-90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          {getStatusBadge(rec.match_status)}
                          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                            {rec.match_score}% {t("Rule Match", "మ్యాచ్")}
                          </span>
                          <span className="text-xs text-slate-500">{s.category}</span>
                        </div>

                        <Link
                          to={`/schemes/${s.id}`}
                          className="text-base font-bold text-slate-900 hover:text-[#166534] transition-colors leading-tight block"
                        >
                          {language === 'te' && s.name_te ? s.name_te : s.name}
                        </Link>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{s.department}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded block">
                          🎁 {s.benefits_text.split('.')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Rule Breakdown Box */}
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                      <p className="text-slate-700 font-medium">
                        💡 <strong>{t("Rule Explanation:", "నియమ విశ్లేషణ:")}</strong> {language === 'te' && rec.explanation_te ? rec.explanation_te : rec.explanation}
                      </p>

                      {/* Criteria matched */}
                      {rec.matched_criteria.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-emerald-800">{t("Satisfied Criteria:", "సరిపోయిన నిబంధనలు:")}</span>
                          {rec.matched_criteria.map((m, idx) => (
                            <span key={idx} className="bg-emerald-100/70 text-[#166534] text-[10px] px-2 py-0.5 rounded-full font-medium">
                              ✓ {m}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Unmet criteria */}
                      {rec.unmet_criteria.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-red-700">{t("Unsatisfied Criteria:", "సరిపోనివి:")}</span>
                          {rec.unmet_criteria.map((u, idx) => (
                            <span key={idx} className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                              ✕ {u}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Mandatory documents required */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t("Required Documents:", "పత్రాలు:")}</span>
                        <span className="font-semibold text-slate-800 truncate max-w-xs">
                          {rec.required_documents.slice(0, 3).join(', ')}
                        </span>
                      </div>

                      <Link to={`/schemes/${s.id}`} className="shrink-0">
                        <Button variant="secondary" size="sm" className="text-xs" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                          {t("Checklist & Apply", "చెక్‌లిస్ట్ & దరఖాస్తు")}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
