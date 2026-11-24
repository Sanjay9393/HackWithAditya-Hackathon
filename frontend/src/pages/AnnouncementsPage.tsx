import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Announcement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  Bell,
  Search,
  Plus,
  AlertTriangle,
  Calendar,
  Layers,
  Clock,
  Pin
} from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { user, t, language } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Announcement Form
  const [title, setTitle] = useState('');
  const [titleTe, setTitleTe] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Urgent' | 'Emergency'>('Normal');
  const [targetWard, setTargetWard] = useState('All Wards');

  const CATEGORIES = [
    'All',
    'Water supply',
    'Electricity',
    'Health',
    'Education',
    'Gram Sabha',
    'Agriculture',
    'Government schemes',
    'Emergency',
    'General'
  ];

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search) params.search = search;
      const res = await api.get('/announcements', { params });
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedCategory, search]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/announcements', {
        title,
        title_te: titleTe,
        content,
        category,
        priority,
        target_ward: targetWard
      });
      setShowAddModal(false);
      setTitle('');
      setTitleTe('');
      setContent('');
      fetchAnnouncements();
    } catch (err: any) {
      alert("Error creating announcement: " + (err.response?.data?.detail || err.message));
    }
  };

  const getPriorityStyle = (prio: string) => {
    switch (prio) {
      case 'Urgent':
      case 'Emergency':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Important':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Village Announcements & Alerts", "గ్రామ ముఖ్య ప్రకటనలు & హెచ్చరికలు")}
            </h1>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
              {announcements.length} {t("Active Notices", "తాజా నోటీసులు")}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              "Official notices from Chandanagar Gram Panchayat regarding water timings, power outages, and medical camps.",
              "తాగునీటి సరఫరా వేళలు, విద్యుత్ అంతరాయాలు మరియు ఆరోగ్య శిబిరాల అధికారిక పంచాయతీ సమాచారం."
            )}
          </p>
        </div>

        {user?.role === 'admin' && (
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            icon={<Plus className="w-4 h-4" />}
          >
            {t("Publish Announcement", "ప్రకటన ప్రచురించు")}
          </Button>
        )}
      </div>

      {/* Filter Chips */}
      <Card padding={false} className="p-3 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t("Search notices by title or content...", "ప్రకటనల్లో వెతకండి...")}
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

      {/* Announcements Stream */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-200/60 rounded-xl"></div>)}
        </div>
      ) : announcements.length === 0 ? (
        <Card className="text-center py-12">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">{t("No announcements found", "ప్రకటనలు లేవు")}</h3>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <Card
              key={ann.id}
              className={`hover:border-slate-300 transition-colors ${
                ann.priority === 'Urgent' || ann.priority === 'Emergency' ? 'border-red-200 bg-red-50/10' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityStyle(ann.priority)}`}>
                      {ann.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      📍 {ann.target_ward}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {language === 'te' && ann.title_te ? ann.title_te : ann.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                    {ann.content}
                  </p>
                </div>

                <div className="text-right shrink-0 text-xs text-slate-400 sm:border-l sm:border-slate-100 sm:pl-4">
                  <div className="flex items-center gap-1 sm:justify-end text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ann.publish_date}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Source: {ann.source}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Admin New Announcement Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={t("Publish New Village Notice", "నూతన గ్రామ ప్రకటనను ప్రచురించు")}
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Title (English)", "శీర్షిక (ఇంగ్లీష్)")} *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              placeholder="e.g. Drinking Water Supply Interruption Notice"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Title (Telugu)", "శీర్షిక (తెలుగు)")}</label>
            <input
              type="text"
              value={titleTe}
              onChange={(e) => setTitleTe(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              placeholder="ఉదాహరణ: మంచినీటి సరఫరా అంతరాయ సమాచారం"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Category", "విభాగం")}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Priority", "ప్రాధాన్యత")}</label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Target Ward", "వర్తించే వార్డు")}</label>
            <input
              type="text"
              value={targetWard}
              onChange={(e) => setTargetWard(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              placeholder="e.g. All Wards or Ward 1, 2"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Notice Content", "పూర్తి సమాచారం")} *</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              placeholder="Provide exact dates, timings, and instructions for citizens..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              {t("Cancel", "రద్దు")}
            </Button>
            <Button type="submit" size="sm">
              {t("Publish", "ప్రచురించు")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
