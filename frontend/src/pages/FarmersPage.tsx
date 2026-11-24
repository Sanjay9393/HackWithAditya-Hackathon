import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { AgricultureAdvisory, MarketPrice } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import {
  Sprout,
  TrendingUp,
  CloudSun,
  AlertTriangle,
  Droplet,
  IndianRupee,
  Layers,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';

export const FarmersPage: React.FC = () => {
  const { t, language } = useAuth();
  const [advisories, setAdvisories] = useState<AgricultureAdvisory[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [weatherAdvisory, setWeatherAdvisory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/agriculture/advisories'),
      api.get('/agriculture/market'),
      api.get('/agriculture/weather-advisory')
    ]).then(([aRes, mRes, wRes]) => {
      setAdvisories(aRes.data);
      setMarketPrices(mRes.data);
      setWeatherAdvisory(wRes.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Farmer Intelligence & Advisory Center", "రైతు భరోసా & వ్యవసాయ సమాచార కేంద్రం")}
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              RBK Ward 3 Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              "Crop-specific scientific guidance, pest management alerts, and agricultural market yard commodity benchmarks.",
              "శాస్త్రీయ వ్యవసాయ సలహాలు, తెగుళ్ల నివారణ చర్యలు మరియు గుంటూరు వ్యవసాయ మార్కెట్ యార్డ్ ధరల సమాచారం."
            )}
          </p>
        </div>

        <Link to="/assistant">
          <Button variant="secondary" size="sm" icon={<Bot className="w-4 h-4" />}>
            {t("Ask Agri AI (Telugu/English)", "వ్యవసాయ ఏఐ సలహా")}
          </Button>
        </Link>
      </div>

      {/* Weather Advisory Card */}
      {weatherAdvisory && (
        <Card className="bg-gradient-to-r from-amber-50/60 via-white to-emerald-50/40 border-amber-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{weatherAdvisory.station}</h3>
                <span className="text-[11px] text-slate-500">Advisory Date: {weatherAdvisory.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <span>Max: {weatherAdvisory.temperature_max}</span>
              <span>Min: {weatherAdvisory.temperature_min}</span>
              <span>Humidity: {weatherAdvisory.relative_humidity}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-800 space-y-1">
            <p><strong>🌧️ {t("Rainfall Outlook:", "వర్ష సూచన:")}</strong> {weatherAdvisory.rainfall_forecast}</p>
            <p className="pt-1 text-[#166534] font-medium leading-relaxed">
              <strong>💡 {t("Operational Advice:", "రైతులకు సూచన:")}</strong> {weatherAdvisory.farm_operations_advice}
            </p>
          </div>
        </Card>
      )}

      {/* Market Prices Benchmarks */}
      <Card
        title={t("Agricultural Commodity Market Yard Prices", "వ్యవసాయ మార్కెట్ యార్డ్ ధరలు")}
        subtitle={t("Daily price arrivals benchmarked from Guntur & Tenali APMC Market Yards", "గుంటూరు & తెనాలి మార్కెట్ యార్డుల తాజా ధరలు")}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t("Commodity / Crop", "పంట పేరు")}</th>
                <th className="px-4 py-3">{t("Market Yard", "మార్కెట్ యార్డ్")}</th>
                <th className="px-4 py-3">{t("Min Price", "కనిష్ట ధర")}</th>
                <th className="px-4 py-3">{t("Modal / Average", "సగటు మోడల్ ధర")}</th>
                <th className="px-4 py-3">{t("Max Price", "గరిష్ట ధర")}</th>
                <th className="px-4 py-3">{t("Unit", "పరిమాణం")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marketPrices.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-bold text-slate-900">{p.crop_name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.market_name}</td>
                  <td className="px-4 py-3 text-slate-600">₹{p.min_price.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-bold text-emerald-800 bg-emerald-50/50">
                    ₹{p.modal_price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">₹{p.max_price.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-slate-500">{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 italic px-1">
          * Sourced from AP Agmarknet official daily market rates. For physical trade, confirm at the Guntur Market Yard counter.
        </p>
      </Card>

      {/* Crop Advisories Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">
          {t("Seasonal Crop Advisories & Pest Management", "పంటల వారీగా శాస్త్రీయ సూచనలు & సలహాలు")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advisories.map((adv) => (
            <Card key={adv.id} className="hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-bold text-slate-900">
                  {language === 'te' && adv.crop_name_te ? adv.crop_name_te : adv.crop_name}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {adv.season} • {adv.soil_type}
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-700 leading-relaxed space-y-2">
                <p>
                  <strong>🌾 {t("Advisory:", "సాగు సూచన:")}</strong>{' '}
                  {language === 'te' && adv.advisory_te ? adv.advisory_te : adv.advisory_text}
                </p>
                {adv.pest_alerts && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <strong>⚠️ {t("Pest Management:", "తెగుళ్ల నివారణ:")}</strong> {adv.pest_alerts}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
