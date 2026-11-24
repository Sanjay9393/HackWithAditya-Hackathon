import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { DevelopmentProject } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Calendar,
  IndianRupee,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  ExternalLink,
  Hammer
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { user, t, language } = useAuth();
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'updated_at' | 'budget' | 'progress' | 'date'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Admin New Project Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    category: 'Roads',
    location_name: '',
    ward_number: 1,
    department: 'Panchayat Raj & Rural Development',
    budget_sanctioned: 500000,
    status: 'In progress',
    progress_pct: 10,
    description: '',
    contractor_name: '',
    source_document: 'Gram Panchayat Sanction'
  });

  const CATEGORIES = [
    'All',
    'Roads',
    'Drainage',
    'Drinking water',
    'Streetlights',
    'Sanitation',
    'Schools',
    'Health',
    'Buildings',
    'Agriculture',
    'Irrigation',
  ];

  const STATUSES = ['All', 'In progress', 'Completed', 'Approved', 'Delayed', 'Proposed'];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params: any = {
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedWard !== 'All') params.ward = Number(selectedWard);

      const res = await api.get('/projects', { params });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, selectedCategory, selectedStatus, selectedWard, sortBy, sortOrder]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      setShowAddModal(false);
      fetchProjects();
    } catch (err: any) {
      alert("Error creating project: " + (err.response?.data?.detail || err.message));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">{status}</Badge>;
      case 'In progress': return <Badge variant="info">{status}</Badge>;
      case 'Delayed': return <Badge variant="danger">{status}</Badge>;
      case 'Approved': return <Badge variant="warning">{status}</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Village Development Tracker", "గ్రామాభివృద్ధి పనుల పర్యవేక్షణ")}
            </h1>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
              {projects.length} {t("Works", "పనులు")}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              "Transparent tracking of sanctioned village civil works, budgets, contractors, and photo updates.",
              "మంజూరైన గ్రామాభివృద్ధి పనులు, ఖర్చులు, కాంట్రాక్టర్ల సమాచారం మరియు ఫోటోలతో ప్రత్యక్ష పర్యవేక్షణ."
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          {user?.role === 'admin' && (
            <Button
              onClick={() => setShowAddModal(true)}
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              {t("New Project", "నూతన పని నమోదు")}
            </Button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card padding={false} className="p-4 bg-white space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t("Search by project, department, ward...", "పని పేరు, శాఖ ద్వారా వెతకండి...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] bg-white text-slate-700"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? t("All Categories", "అన్ని విభాగాలు") : c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] bg-white text-slate-700"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? t("All Statuses", "అన్ని స్థితులు") : s}
                </option>
              ))}
            </select>
          </div>

          {/* Ward & Sort */}
          <div className="flex gap-2">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-1/2 py-2 px-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] bg-white text-slate-700"
            >
              <option value="All">{t("All Wards", "అన్ని వార్డులు")}</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                <option key={w} value={w}>Ward {w}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-1/2 py-2 px-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] bg-white text-slate-700"
            >
              <option value="updated_at">{t("Recently Updated", "తాజా అప్‌డేట్")}</option>
              <option value="budget">{t("Budget (High to Low)", "బడ్జెట్")}</option>
              <option value="progress">{t("Progress %", "పురోగతి శాతం")}</option>
              <option value="date">{t("Start Date", "ప్రారంభ తేదీ")}</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none text-xs">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#166534] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? t("All", "అన్నీ") : cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Projects List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-slate-200/60 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-12">
          <Hammer className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">{t("No development works found", "పనులు కనుగొనబడలేదు")}</h3>
          <p className="text-xs text-slate-500 mt-1">{t("Try clearing your search query or filters.", "ఫిల్టర్లు తొలగించి చూడండి.")}</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <Card
              key={proj.id}
              className="flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all duration-200"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  {getStatusBadge(proj.status)}
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Ward {proj.ward_number}
                  </span>
                </div>

                <Link
                  to={`/projects/${proj.id}`}
                  className="text-base font-bold text-slate-900 hover:text-[#166534] transition-colors leading-snug line-clamp-2"
                >
                  {language === 'te' && proj.project_name_te ? proj.project_name_te : proj.project_name}
                </Link>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {proj.description}
                </p>

                {/* Metadata */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t("Category:", "విభాగం:")}</span>
                    <span className="font-medium text-slate-800">{proj.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t("Location:", "ప్రాంతం:")}</span>
                    <span className="font-medium text-slate-800 truncate max-w-[160px]">{proj.location_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t("Budget:", "మంజూరైన నిధులు:")}</span>
                    <span className="font-bold text-slate-900">₹{(proj.budget_sanctioned / 100000).toFixed(2)} Lakhs</span>
                  </div>
                  {proj.contractor_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t("Contractor:", "కాంట్రాక్టర్:")}</span>
                      <span className="text-slate-700 truncate max-w-[160px]">{proj.contractor_name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress and Action Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">{t("Completion Progress", "పురోగతి")}</span>
                  <span className="font-bold text-[#166534]">{proj.progress_pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-[#166534] h-full rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress_pct}%` }}
                  />
                </div>
                <Link to={`/projects/${proj.id}`} className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    {t("View Details & Photos →", "పూర్తి వివరాలు & ఫోటోలు →")}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card padding={false} className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t("Project Name", "పని పేరు")}</th>
                <th className="px-4 py-3">{t("Category", "విభాగం")}</th>
                <th className="px-4 py-3">{t("Ward", "వార్డు")}</th>
                <th className="px-4 py-3">{t("Status", "స్థితి")}</th>
                <th className="px-4 py-3">{t("Budget", "బడ్జెట్")}</th>
                <th className="px-4 py-3">{t("Progress", "పురోగతి")}</th>
                <th className="px-4 py-3 text-right">{t("Action", "చర్య")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs">
                    <Link to={`/projects/${proj.id}`} className="hover:text-[#166534]">
                      {proj.project_name}
                    </Link>
                    <p className="text-[11px] text-slate-400 font-normal truncate">{proj.location_name}</p>
                  </td>
                  <td className="px-4 py-3">{proj.category}</td>
                  <td className="px-4 py-3 font-medium">Ward {proj.ward_number}</td>
                  <td className="px-4 py-3">{getStatusBadge(proj.status)}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    ₹{(proj.budget_sanctioned / 100000).toFixed(2)}L
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#166534] h-full" style={{ width: `${proj.progress_pct}%` }} />
                      </div>
                      <span className="font-semibold text-[11px]">{proj.progress_pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/projects/${proj.id}`}>
                      <Button variant="ghost" size="sm">
                        {t("View", "వివరాలు")}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Admin New Project Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={t("Register New Village Development Project", "నూతన గ్రామాభివృద్ధి పని నమోదు")}
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Project Name", "పని పేరు")}</label>
            <input
              type="text"
              required
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#166534] text-xs"
              placeholder="e.g. Laying of CC Road from Ward 3 to Market"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Category", "విభాగం")}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Ward Number", "వార్డు సంఖ్య")}</label>
              <select
                value={formData.ward_number}
                onChange={(e) => setFormData({ ...formData, ward_number: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(w => (
                  <option key={w} value={w}>Ward {w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Sanctioned Budget (₹)", "బడ్జెట్ (రూ.)")}</label>
              <input
                type="number"
                required
                value={formData.budget_sanctioned}
                onChange={(e) => setFormData({ ...formData, budget_sanctioned: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Current Status", "ప్రస్తుత స్థితి")}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                {STATUSES.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Location Name", "ప్రాంతం")}</label>
            <input
              type="text"
              required
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              placeholder="e.g. Near Shivalayam, Ward 1"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Contractor / Agency", "కాంట్రాక్టర్")}</label>
            <input
              type="text"
              value={formData.contractor_name}
              onChange={(e) => setFormData({ ...formData, contractor_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              placeholder="Contractor or Committee Name"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Description & Scope", "వివరణ")}</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              placeholder="Details on scope of work, technical specifications..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              {t("Cancel", "రద్దు")}
            </Button>
            <Button type="submit" size="sm">
              {t("Save Project", "ప్రాజెక్ట్ భద్రపరచు")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
