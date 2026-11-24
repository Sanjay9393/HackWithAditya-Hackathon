import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { GovernmentService } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Building2,
  Search,
  Phone,
  Mail,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { t, language } = useAuth();
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CATEGORIES = [
    'All',
    'Panchayat',
    'Health',
    'Agriculture',
    'Banking',
    'Ration',
    'Education',
    'Social welfare',
    'Emergency'
  ];

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (search) params.search = search;
    api.get('/services', { params })
      .then(res => setServices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, search]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("Government Services & Public Offices Directory", "గ్రామ ప్రభుత్వ కార్యాలయాలు & సేవా కేంద్రాలు")}
          </h1>
          <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
            {services.length} {t("Verified Centres", "కేంద్రాలు")}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t(
            "Contact details, operating hours, and citizen services available across village administrative offices.",
            "గ్రామ సచివాలయం, ప్రాథమిక ఆరోగ్య కేంద్రం, రైతు భరోసా కేంద్రం మరియు ఇతర సేవా కేంద్రాల వివరాలు."
          )}
        </p>
      </div>

      {/* Filter and Search */}
      <Card padding={false} className="p-3 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t("Search by facility name, service, or location...", "కార్యాలయం పేరు లేదా సేవ ద్వారా వెతకండి...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat ? 'bg-[#166534] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? t("All", "అన్నీ") : cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-56 bg-slate-200/60 rounded-xl"></div>)}
        </div>
      ) : services.length === 0 ? (
        <Card className="text-center py-12">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">{t("No services found", "సేవా కేంద్రాలు లేవు")}</h3>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(s => (
            <Card key={s.id} className="flex flex-col justify-between hover:border-emerald-300 transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {s.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {s.verification_status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {language === 'te' && s.name_te ? s.name_te : s.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {s.address}
                </p>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                  <p className="text-slate-800">
                    <strong>{t("Services Offered:", "అందించే సేవలు:")}</strong> {s.services_offered}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {t("Timings:", "వేళలు:")}
                  </span>
                  <span className="font-medium text-slate-800">{s.opening_hours}</span>
                </div>
                {s.contact_phone && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Phone className="w-3.5 h-3.5" /> {t("Contact:", "ఫోన్:")}
                    </span>
                    <a href={`tel:${s.contact_phone}`} className="font-semibold text-[#166534] hover:underline">
                      {s.contact_phone}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
