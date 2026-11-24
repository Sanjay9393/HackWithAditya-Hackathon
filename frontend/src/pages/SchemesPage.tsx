import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Scheme } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import {
  Award,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  FileText,
  Scale,
  X
} from 'lucide-react';

export const SchemesPage: React.FC = () => {
  const { t, language } = useAuth();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [compareList, setCompareList] = useState<Scheme[]>([]);

  const CATEGORIES = [
    'All',
    'Agriculture',
    'Education',
    'Healthcare',
    'Women',
    'Senior citizens',
    'Housing',
    'Employment',
    'Financial assistance',
    'Entrepreneurship',
  ];

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel !== 'All') params.level = selectedLevel;

      const res = await api.get('/schemes', { params });
      setSchemes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [search, selectedCategory, selectedLevel]);

  const toggleCompare = (scheme: Scheme) => {
    if (compareList.some(s => s.id === scheme.id)) {
      setCompareList(compareList.filter(s => s.id !== scheme.id));
    } else {
      if (compareList.length >= 4) {
        alert("You can compare up to 4 schemes at a time.");
        return;
      }
      setCompareList([...compareList, scheme]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Government Scheme Discovery Engine", "ప్రభుత్వ సంక్షేమ పథకాల సమాచార నిధి")}
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              {schemes.length} {t("Verified Schemes", "ధృవీకరించబడిన పథకాలు")}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              "Central & Andhra Pradesh state government schemes with verified eligibility criteria, documents, and application steps.",
              "కేంద్ర మరియు ఆంధ్రప్రదేశ్ రాష్ట్ర సంక్షేమ పథకాల అర్హతలు, అవసరమైన పత్రాలు మరియు దరఖాస్తు విధానం."
            )}
          </p>
        </div>

        {/* Action Button to Personalized Finder */}
        <Link to="/schemes/recommend">
          <Button variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />}>
            {t("Check My Eligibility (AI)", "నా అర్హత అంచనా వేయండి")}
          </Button>
        </Link>
      </div>

      {/* Search & Category Filter Bar */}
      <Card padding={false} className="p-4 bg-white space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t("Search by scheme name, department, or beneficiaries in English or Telugu...", "పథకం పేరు, శాఖ లేదా లబ్ధిదారుల వివరాలతో వెతకండి...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] bg-white text-slate-700"
            >
              <option value="All">{t("All Levels (Central & State)", "అన్ని పథకాలు (కేంద్ర & రాష్ట్ర)")}</option>
              <option value="Central">Central Govt Schemes (కేంద్ర ప్రభుత్వ పథకాలు)</option>
              <option value="State">AP State Govt Schemes (ఆంధ్రప్రదేశ్ రాష్ట్ర పథకాలు)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#166534] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? t("All Categories", "అన్ని విభాగాలు") : cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200/60 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <Card className="text-center py-12">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">{t("No matching government schemes found", "పథకాలు కనుగొనబడలేదు")}</h3>
          <p className="text-xs text-slate-500 mt-1">{t("Try adjusting your keyword search or category filter.", "మరొక పదంతో లేదా విభాగంతో వెతకండి.")}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => {
            const isCompared = compareList.some(s => s.id === scheme.id);
            return (
              <Card
                key={scheme.id}
                className="flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all duration-200"
              >
                <div>
                  {/* Category and Level Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scheme.government_level === 'Central' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {scheme.government_level}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {scheme.category}
                    </span>
                  </div>

                  <Link
                    to={`/schemes/${scheme.id}`}
                    className="text-base font-bold text-slate-900 hover:text-[#166534] transition-colors leading-snug line-clamp-2"
                  >
                    {language === 'te' && scheme.name_te ? scheme.name_te : scheme.name}
                  </Link>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {language === 'te' && scheme.description_te ? scheme.description_te : scheme.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100/60 text-xs text-slate-700 space-y-1">
                    <p className="text-[11px] font-semibold text-emerald-900 line-clamp-1">
                      🎯 {t("Target:", "లబ్ధిదారులు:")} {scheme.target_beneficiaries}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-1">
                      🎁 {t("Benefit:", "ప్రయోజనం:")} {scheme.benefits_text}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleCompare(scheme)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                      isCompared
                        ? 'bg-emerald-100 text-[#166534] border-emerald-300 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    {isCompared ? t("Added", "చేర్చబడింది") : t("Compare", "పోల్చండి")}
                  </button>

                  <Link to={`/schemes/${scheme.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      {t("View Details →", "పూర్తి వివరాలు →")}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Floating Scheme Comparison Drawer */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl p-3 sm:px-6 shadow-2xl flex items-center gap-4 max-w-xl w-[92%] border border-slate-700">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold block text-emerald-400">
              {compareList.length} / 4 {t("Schemes Selected for Comparison", "పథకాలు ఎంపిక చేయబడ్డాయి")}
            </span>
            <div className="flex items-center gap-1.5 mt-1 overflow-x-auto scrollbar-none">
              {compareList.map(s => (
                <span key={s.id} className="inline-flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-200 truncate max-w-[120px]">
                  {s.name.split(' ')[0]}
                  <button onClick={() => toggleCompare(s)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Link to={`/schemes/compare?ids=${compareList.map(s => s.id).join(',')}`}>
            <Button variant="secondary" size="sm" icon={<Scale className="w-3.5 h-3.5" />}>
              {t("Compare Now", "పోల్చి చూడండి")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
