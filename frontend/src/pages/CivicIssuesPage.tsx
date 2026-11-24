import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { CivicIssue } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const CivicIssuesPage: React.FC = () => {
  const { user, t, language } = useAuth();
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [myIssuesOnly, setMyIssuesOnly] = useState(false);

  // New Issue Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [similarReports, setSimilarReports] = useState<any[]>([]);

  // Selected Issue for Detail Modal
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Water supply');
  const [locationName, setLocationName] = useState('');
  const [wardNumber, setWardNumber] = useState(1);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState(user?.full_name || '');
  const [reporterPhone, setReporterPhone] = useState(user?.phone || '');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80');

  const CATEGORIES = [
    'All',
    'Road damage',
    'Water supply',
    'Drainage',
    'Garbage',
    'Streetlights',
    'Electricity',
    'Public property',
    'School',
    'Health facilities',
    'Other'
  ];

  const STATUSES = ['All', 'Submitted', 'Acknowledged', 'Assigned', 'In progress', 'Resolved', 'Closed'];

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedWard !== 'All') params.ward = Number(selectedWard);
      if (myIssuesOnly && user) params.my_issues = true;

      const res = await api.get('/issues', { params });
      let filtered = res.data;
      if (search) {
        filtered = filtered.filter((i: CivicIssue) =>
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          i.description.toLowerCase().includes(search.toLowerCase()) ||
          i.location_name.toLowerCase().includes(search.toLowerCase())
        );
      }
      setIssues(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [selectedCategory, selectedStatus, selectedWard, myIssuesOnly, search]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        location_name: locationName,
        ward_number: wardNumber,
        priority,
        is_anonymous: isAnonymous,
        reporter_name: isAnonymous ? 'Anonymous' : reporterName,
        reporter_phone: reporterPhone,
        photo_url: photoUrl
      };

      const res = await api.post('/issues', payload);
      
      // If duplicates detected, show warning banner
      if (res.data.potential_duplicates && res.data.potential_duplicates.length > 0) {
        setDuplicateWarning(res.data.duplicate_warning);
        setSimilarReports(res.data.potential_duplicates);
      } else {
        setShowReportModal(false);
        resetForm();
      }

      fetchIssues();
    } catch (err: any) {
      alert("Error reporting issue: " + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocationName('');
    setDuplicateWarning(null);
    setSimilarReports([]);
  };

  const handleAdminStatusChange = async (issueId: number, newStatus: string) => {
    try {
      await api.put(`/issues/${issueId}`, { status: newStatus });
      fetchIssues();
      if (selectedIssue && selectedIssue.id === issueId) {
        const updated = await api.get(`/issues/${issueId}`);
        setSelectedIssue(updated.data);
      }
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return <Badge variant="success">{status}</Badge>;
      case 'In progress':
      case 'Assigned':
        return <Badge variant="info">{status}</Badge>;
      case 'Acknowledged':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical': return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">Critical</span>;
      case 'High': return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">High</span>;
      default: return <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">{priority}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Civic Issue Reporting & Public Redressal", "ప్రజా సమస్యల నివేదిక & పరిష్కార పర్యవేక్షణ")}
            </h1>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
              {issues.length} {t("Reports", "ఫిర్యాదులు")}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              "Report drinking water leaks, streetlights, road damage, and sanitation problems with AI duplicate detection.",
              "మంచినీటి లీకేజీలు, వీధి దీపాలు, రోడ్డు గుంతలు, మురుగు కాలువల సమస్యలను నేరుగా పంచాయతీకి నివేదించండి."
            )}
          </p>
        </div>

        <Button
          onClick={() => { resetForm(); setShowReportModal(true); }}
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          {t("Report a Village Issue", "సమస్యను నివేదించండి")}
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card padding={false} className="p-4 bg-white space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t("Search complaint or location...", "సమస్య లేదా ప్రాంతం వెతకండి...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-[#166534]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === 'All' ? t("All Categories", "అన్ని విభాగాలు") : c}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-[#166534]"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s === 'All' ? t("All Statuses", "అన్ని స్థితులు") : s}</option>
              ))}
            </select>
          </div>

          {/* Ward & My Issues */}
          <div className="flex items-center gap-2">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-1/2 py-2 px-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-[#166534]"
            >
              <option value="All">{t("All Wards", "అన్ని వార్డులు")}</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(w => (
                <option key={w} value={w}>Ward {w}</option>
              ))}
            </select>

            {user && (
              <button
                onClick={() => setMyIssuesOnly(!myIssuesOnly)}
                className={`w-1/2 py-2 px-2 text-xs rounded-lg border font-medium transition-colors ${
                  myIssuesOnly ? 'bg-emerald-50 text-[#166534] border-emerald-300 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t("My Reports", "నా ఫిర్యాదులు")}
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Issues Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-slate-200/60 rounded-xl"></div>)}
        </div>
      ) : issues.length === 0 ? (
        <Card className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">{t("No complaints match your criteria", "ఫిర్యాదులు లేవు")}</h3>
          <p className="text-xs text-slate-500 mt-1">{t("Clear filters or report a new issue above.", "ఫిల్టర్లు తొలగించి చూడండి.")}</p>
        </Card>
      ) : (
        <Card padding={false} className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">{t("Issue Title & Details", "సమస్య శీర్షిక & వివరాలు")}</th>
                <th className="px-4 py-3">{t("Category", "విభాగం")}</th>
                <th className="px-4 py-3">{t("Ward", "వార్డు")}</th>
                <th className="px-4 py-3">{t("Priority", "ప్రాధాన్యత")}</th>
                <th className="px-4 py-3">{t("Status", "స్థితి")}</th>
                <th className="px-4 py-3">{t("Assigned To", "శాఖ")}</th>
                <th className="px-4 py-3 text-right">{t("Action", "చర్య")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">#{i.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-sm">
                    <button
                      onClick={() => setSelectedIssue(i)}
                      className="text-left hover:text-[#166534] font-semibold leading-snug block"
                    >
                      {i.title}
                    </button>
                    <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                      📍 {i.location_name} • Reported on {i.created_at.split('T')[0]}
                    </p>
                  </td>
                  <td className="px-4 py-3">{i.category}</td>
                  <td className="px-4 py-3 font-medium">Ward {i.ward_number}</td>
                  <td className="px-4 py-3">{getPriorityBadge(i.priority)}</td>
                  <td className="px-4 py-3">{getStatusBadge(i.status)}</td>
                  <td className="px-4 py-3 text-slate-700 truncate max-w-[140px]">
                    {i.assigned_department || 'Panchayat Desk'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIssue(i)}
                      className="text-xs"
                    >
                      {t("Track", "పరిశీలించు")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* MODULE 14 & 15: Report Issue Modal with AI Duplicate Detection */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={t("Report a Civic Issue to Gram Panchayat", "గ్రామ పంచాయతీకి సమస్యను నివేదించండి")}
        maxWidth="lg"
      >
        {/* Duplicate Detection Warning Banner */}
        {duplicateWarning && (
          <div className="mb-4 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t("AI Duplicate Detection Notice", "ఏఐ సారూప్య సమస్య గుర్తింపు")}</span>
            </div>
            <p className="text-amber-800">{duplicateWarning}</p>
            <div className="space-y-1.5 pt-1">
              {similarReports.map(sim => (
                <div key={sim.id} className="p-2 bg-white rounded-lg border border-amber-200 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-800">#{sim.id}: {sim.title}</span>
                    <span className="text-slate-400 ml-2">({sim.status})</span>
                  </div>
                  <span className="font-bold text-amber-700">{sim.similarity_pct}% match</span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowReportModal(false)}>
                {t("Close (Already Reported)", "ముగించు (ఇదివరకే నమోదైంది)")}
              </Button>
              <Button size="sm" onClick={() => { setShowReportModal(false); resetForm(); }}>
                {t("Submit Anyway", "అయినా సమర్పించండి")}
              </Button>
            </div>
          </div>
        )}

        {!duplicateWarning && (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t("Issue Summary / Title", "సమస్య శీర్షిక")} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Major drinking water pipeline leak at Rythu Colony Cross"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#166534]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t("Category", "సమస్య విభాగం")}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t("Ward Number", "వార్డు")}</label>
                <select
                  value={wardNumber}
                  onChange={(e) => setWardNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(w => (
                    <option key={w} value={w}>Ward {w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Location Landmark", "ప్రాంతం / ల్యాండ్‌మార్క్")} *</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Near Shivalayam Tank Bund road, Ward 1"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Detailed Description", "పూర్తి వివరాలు")} *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the severity, how long it has been occurring, and any hazard to public health..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#166534] focus:ring-[#166534]"
                />
                <span>{t("Report Anonymously", "గుర్తు తెలియకుండా నివేదించండి")}</span>
              </label>

              {!isAnonymous && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-medium text-slate-600 mb-0.5">{t("Your Name", "మీ పేరు")}</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-0.5">{t("Phone Number", "ఫోన్ నంబర్")}</label>
                    <input
                      type="text"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowReportModal(false)}>
                {t("Cancel", "రద్దు")}
              </Button>
              <Button type="submit" size="sm" isLoading={submitting}>
                {t("Submit Complaint", "ఫిర్యాదు నమోదు చేయండి")}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Issue Detail & Timeline Modal */}
      {selectedIssue && (
        <Modal
          isOpen={!!selectedIssue}
          onClose={() => setSelectedIssue(null)}
          title={`Complaint #${selectedIssue.id}: ${selectedIssue.title}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Top status & department */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("Current Status", "ప్రస్తుత స్థితి")}</span>
                <div className="mt-0.5">{getStatusBadge(selectedIssue.status)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("Priority", "ప్రాధాన్యత")}</span>
                <div className="mt-0.5">{getPriorityBadge(selectedIssue.priority)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("Ward & Dept", "వార్డు & శాఖ")}</span>
                <span className="font-semibold text-slate-800">
                  Ward {selectedIssue.ward_number} • {selectedIssue.assigned_department || 'Panchayat'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">{t("Description:", "సమస్య వివరాలు:")}</span>
              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
                {selectedIssue.description}
              </p>
            </div>

            {/* Photo Attachment if available */}
            {selectedIssue.photo_url && (
              <div>
                <span className="font-bold text-slate-900 block mb-1">{t("Uploaded Evidence Photo:", "ఫోటో ఆధారాలు:")}</span>
                <img
                  src={selectedIssue.photo_url}
                  alt="Issue site"
                  className="w-full h-48 object-cover rounded-xl border border-slate-200"
                />
              </div>
            )}

            {/* Resolution notes if resolved */}
            {selectedIssue.resolution_notes && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="font-bold text-emerald-900 block mb-0.5">
                  ✓ {t("Official Resolution Summary:", "పరిష్కార వివరాలు:")}
                </span>
                <p className="text-emerald-800">{selectedIssue.resolution_notes}</p>
                {selectedIssue.resolution_date && (
                  <span className="text-[10px] text-emerald-600 block mt-1">
                    Resolved Date: {selectedIssue.resolution_date}
                  </span>
                )}
              </div>
            )}

            {/* Administrative Status Changer (Admin only) */}
            {user?.role === 'admin' && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <span className="font-bold text-amber-900 block">
                  🛠️ {t("Admin Action: Change Complaint Status", "అడ్మిన్ చర్య: స్థితిని మార్చండి")}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Acknowledged', 'Assigned', 'In progress', 'Resolved', 'Closed'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleAdminStatusChange(selectedIssue.id, st)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        selectedIssue.status === st ? 'bg-amber-800 text-white' : 'bg-white text-slate-700 border border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline updates */}
            <div>
              <span className="font-bold text-slate-900 block mb-2">{t("Redressal Timeline:", "పరిష్కార క్రమం:")}</span>
              <div className="space-y-3">
                {(selectedIssue.updates || []).map((upd, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#166534] mt-1" />
                      {idx < (selectedIssue.updates?.length || 0) - 1 && <div className="w-0.5 h-full bg-slate-200 my-1" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{upd.status}</span>
                        <span className="text-[10px] text-slate-400">By {upd.updated_by}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{upd.update_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
