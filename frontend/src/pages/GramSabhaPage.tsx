import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Meeting } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Users,
  Calendar,
  MapPin,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';

export const GramSabhaPage: React.FC = () => {
  const { t, language } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    api.get('/meetings')
      .then(res => {
        setMeetings(res.data);
        if (res.data.length > 0) setSelectedMeeting(res.data[0]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("Gram Sabha Intelligence & Meeting Minutes", "గ్రామసభ వివరాలు & తీర్మానాలు")}
          </h1>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
            {meetings.length} {t("Meetings Documented", "సమావేశాల రికార్డు")}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t(
            "Access official meeting notices, citizen resolutions, AI plain-language summaries, and departmental action items.",
            "గ్రామసభ ఎజెండా, ఆమోదించిన తీర్మానాలు, శాఖల వారీగా అమలు చేయాల్సిన బాధ్యతల వివరాలు."
          )}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="h-96 bg-slate-200/60 rounded-xl"></div>
          <div className="md:col-span-2 h-96 bg-slate-200/60 rounded-xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Meeting selector list */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
              {t("Gram Sabha Sessions", "సమావేశాల జాబితా")}
            </span>
            {meetings.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMeeting(m)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                  selectedMeeting?.id === m.id
                    ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant={m.status === 'Completed' ? 'success' : 'warning'} size="sm">
                    {m.status}
                  </Badge>
                  <span className="text-slate-400 text-[11px] font-mono">{m.meeting_date}</span>
                </div>
                <h4 className="font-bold text-slate-900 leading-snug line-clamp-2 mt-1">
                  {language === 'te' && m.title_te ? m.title_te : m.title}
                </h4>
                <p className="text-slate-500 text-[11px] mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {m.location}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Selected Meeting Deep Dive */}
          <div className="md:col-span-2 space-y-4">
            {selectedMeeting ? (
              <>
                <Card>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={selectedMeeting.status === 'Completed' ? 'success' : 'warning'} size="md">
                          {selectedMeeting.status}
                        </Badge>
                        <span className="text-xs font-medium text-slate-500">
                          📍 {selectedMeeting.location}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {language === 'te' && selectedMeeting.title_te ? selectedMeeting.title_te : selectedMeeting.title}
                      </h2>
                    </div>

                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                      📅 {selectedMeeting.meeting_date}
                    </span>
                  </div>

                  {/* AI Plain-Language Summary Box */}
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#166534]">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>{t("AI Plain-Language Summary", "ఏఐ గ్రామసభ సారాంశం (సులభ శైలిలో)")}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      {language === 'te' && selectedMeeting.summary_te ? selectedMeeting.summary_te : selectedMeeting.summary_en || selectedMeeting.agenda}
                    </p>
                  </div>

                  {/* Meeting Agenda */}
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-900 block mb-1">
                      {t("Approved Agenda Items:", "సమావేశ ఎజెండా అంశాలు:")}
                    </span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-line">
                      {language === 'te' && selectedMeeting.agenda_te ? selectedMeeting.agenda_te : selectedMeeting.agenda}
                    </p>
                  </div>
                </Card>

                {/* Key Resolutions / Decisions Passed */}
                <Card title={t("Key Resolutions Passed", "ఆమోదించిన ముఖ్య తీర్మానాలు")}>
                  {selectedMeeting.decisions.length > 0 ? (
                    <div className="space-y-2 text-xs">
                      {selectedMeeting.decisions.map((d, i) => (
                        <div key={i} className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                          <span className="text-slate-800 font-medium leading-relaxed">
                            {d.decision_text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">{t("No resolutions recorded yet", "తీర్మానాలు లేవు")}</p>
                  )}
                </Card>

                {/* Action Items with Deadlines */}
                <Card title={t("Departmental Action Items & Accountability", "శాఖల బాధ్యతలు & గడువులు")}>
                  {selectedMeeting.action_items.length > 0 ? (
                    <div className="space-y-2.5 text-xs">
                      {selectedMeeting.action_items.map((act, i) => (
                        <div key={i} className="p-3 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
                          <div>
                            <span className="font-semibold text-slate-900 block">{act.action_text}</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Dept: {act.responsible_department}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                              Deadline: {act.deadline || 'Pending'}
                            </span>
                            <Badge variant={act.status === 'Completed' ? 'success' : 'warning'} size="sm">
                              {act.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">{t("No action items assigned", "బాధ్యతలు కేటాయించబడలేదు")}</p>
                  )}
                </Card>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
