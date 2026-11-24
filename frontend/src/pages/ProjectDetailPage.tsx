import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { DevelopmentProject } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  ArrowLeft,
  Calendar,
  Building,
  User,
  IndianRupee,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Send,
  Edit3
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, t, language } = useAuth();
  const [project, setProject] = useState<DevelopmentProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState<string[]>([
    "Great initiative! The CC road has reduced waterlogging significantly during morning school hours.",
    "Please ensure the open drainage sides are properly cleared of construction rubble before monsoon."
  ]);

  // Admin Progress Update state
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('In progress');
  const [updateTitle, setUpdateTitle] = useState('Inspection & Milestone Review');
  const [updateNotes, setUpdateNotes] = useState('');

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setUpdateProgress(res.data.progress_pct);
      setUpdateStatus(res.data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/updates`, {
        title: updateTitle,
        notes: updateNotes,
        progress_pct: updateProgress,
        status: updateStatus,
        updated_by: user?.full_name || "Panchayat Official"
      });
      setShowUpdateModal(false);
      fetchProject();
    } catch (err: any) {
      alert("Error updating project: " + err.message);
    }
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setFeedbackList([feedback, ...feedbackList]);
    setFeedback('');
  };

  if (loading || !project) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded"></div>
        <div className="h-48 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div>
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-3">
          <ArrowLeft className="w-4 h-4" /> {t("Back to Village Works", "అభివృద్ధి పనుల జాబితాకు తిరిగి వెళ్ళు")}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={project.status === 'Completed' ? 'success' : 'info'} size="md">
                {project.status}
              </Badge>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Ward {project.ward_number} • {project.category}
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                {project.verification_status || "Verified Official Record"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'te' && project.project_name_te ? project.project_name_te : project.project_name}
            </h1>
          </div>

          {user?.role === 'admin' && (
            <Button
              onClick={() => setShowUpdateModal(true)}
              size="sm"
              icon={<Edit3 className="w-4 h-4" />}
            >
              {t("Log Work Progress", "పురోగతి నమోదు")}
            </Button>
          )}
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-slate-700">{t("Overall Completion Progress", "మొత్తం పని పురోగతి")}</span>
          <span className="text-lg font-bold text-[#166534]">{project.progress_pct}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-[#166534] h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progress_pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
          <span>{t("Start Date:", "ప్రారంభ తేదీ:")} {project.start_date || 'N/A'}</span>
          <span>{t("Target Date:", "ముగింపు లక్ష్యం:")} {project.expected_completion || 'N/A'}</span>
        </div>
      </Card>

      {/* Grid: Financial & Administrative Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Details */}
        <Card title={t("Financial & Budget Data", "ఆర్థిక & బడ్జెట్ వివరాలు")}>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">{t("Sanctioned Budget", "మంజూరైన నిధులు")}</span>
              <span className="text-base font-bold text-slate-900">
                ₹{(project.budget_sanctioned).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">{t("Verified Expenditure", "రికార్డు చేసిన ఖర్చు")}</span>
              <span className="text-base font-semibold text-emerald-700">
                ₹{(project.expenditure_actual).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">{t("Fund Utilization", "నిధుల వినియోగ శాతం")}</span>
              <span className="font-bold text-slate-800">
                {project.budget_sanctioned > 0
                  ? `${((project.expenditure_actual / project.budget_sanctioned) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500">{t("Sanctioning Order / G.O.", "మంజూరు జీ.ఓ వివరాలు")}</span>
              <span className="font-medium text-slate-800 text-right">{project.source_document || 'GP Plan #14'}</span>
            </div>
          </div>
        </Card>

        {/* Administrative & Technical Specs */}
        <Card title={t("Execution & Oversight", "నిర్వహణ & పర్యవేక్షణ")}>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">{t("Responsible Department", "బాధ్యత వహించే శాఖ")}</span>
              <span className="font-medium text-slate-900 text-right">{project.department}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">{t("Supervising Authority", "పర్యవేక్షణ అధికారి")}</span>
              <span className="font-medium text-slate-900 text-right">{project.responsible_authority || 'Panchayat Engineer'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">{t("Assigned Contractor", "కాంట్రాక్టర్ / ఏజెన్సీ")}</span>
              <span className="font-medium text-slate-900 text-right">{project.contractor_name || 'Direct GP Supervision'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500">{t("Geo Coordinates", "లొకేషన్ కోఆర్డినేట్స్")}</span>
              <span className="font-mono text-slate-700">
                {project.latitude?.toFixed(4)}, {project.longitude?.toFixed(4)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card title={t("Project Scope & Public Value", "పని వివరాలు మరియు ప్రయోజనం")}>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {project.description}
        </p>
      </Card>

      {/* Photo Comparison Gallery: Before, Progress, After */}
      <Card title={t("Visual Inspection Gallery", "పని ఫోటోల పరిశీలన")}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Before */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
            <div className="p-2 border-b border-slate-200 font-semibold text-xs text-slate-700 flex items-center justify-between">
              <span>{t("Before Work", "పనికి ముందు")}</span>
              <span className="text-[10px] text-slate-400">Baseline</span>
            </div>
            <div className="h-48 overflow-hidden bg-slate-100">
              {project.before_photo_url ? (
                <img src={project.before_photo_url} alt="Before" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                  {t("Baseline Photo Pending", "ఫోటో అందుబాటులో లేదు")}
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
            <div className="p-2 border-b border-slate-200 font-semibold text-xs text-slate-700 flex items-center justify-between">
              <span>{t("Current Progress", "ప్రస్తుత స్థితి")}</span>
              <span className="text-[10px] text-emerald-700 font-bold">{project.progress_pct}%</span>
            </div>
            <div className="h-48 overflow-hidden bg-slate-100">
              {project.progress_photo_url ? (
                <img src={project.progress_photo_url} alt="In Progress" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                  {t("Site Inspection Photo Pending", "ఫోటో అందుబాటులో లేదు")}
                </div>
              )}
            </div>
          </div>

          {/* After */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
            <div className="p-2 border-b border-slate-200 font-semibold text-xs text-slate-700 flex items-center justify-between">
              <span>{t("Completed Stage", "పూర్తయిన దశ")}</span>
              <span className="text-[10px] text-slate-400">Handover</span>
            </div>
            <div className="h-48 overflow-hidden bg-slate-100">
              {project.after_photo_url ? (
                <img src={project.after_photo_url} alt="Completed" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                  {project.status === 'Completed' ? t("Final Handover Photo", "ఫోటో అందుబాటులో లేదు") : t("Pending Completion", "పని పూర్తయిన తర్వాత")}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Timeline */}
      <Card title={t("Milestone Log & Field Verification History", "పర్యవేక్షణ చరిత్ర & మైలురాళ్లు")}>
        <div className="space-y-4">
          {project.updates && project.updates.length > 0 ? (
            project.updates.map((upd, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#166534] mt-1" />
                  {idx < (project.updates?.length || 0) - 1 && <div className="w-0.5 h-full bg-slate-200 my-1" />}
                </div>
                <div className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{upd.title}</span>
                    <Badge variant="neutral" size="sm">{upd.status}</Badge>
                    <span className="text-[10px] text-slate-400">{upd.update_date}</span>
                  </div>
                  <p className="text-slate-600 mt-1">{upd.notes}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Verified by: {upd.updated_by}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">{t("No updates recorded yet", "నమోదైన అప్‌డేట్‌లు లేవు")}</p>
          )}
        </div>
      </Card>

      {/* Citizen Feedback Section */}
      <Card title={t("Citizen Feedback & Questions", "ప్రజా స్పందన & అభిప్రాయాలు")}>
        <form onSubmit={handleAddFeedback} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder={t("Share feedback or ask a question regarding this work...", "ఈ పనిపై మీ అభిప్రాయం లేదా ప్రశ్నను రాయండి...")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534]"
          />
          <Button type="submit" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
            {t("Submit", "పంపండి")}
          </Button>
        </form>

        <div className="space-y-2">
          {feedbackList.map((f, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
              <span className="font-semibold text-slate-900 block mb-0.5">
                {t("Resident of Ward ", "వార్డు నివాసి ")} {project.ward_number}:
              </span>
              {f}
            </div>
          ))}
        </div>
      </Card>

      {/* Admin Log Work Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title={t("Log Project Progress Milestone", "పని పురోగతి నమోదు")}
      >
        <form onSubmit={handlePostUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Update Title", "శీర్షిక")}</label>
            <input
              type="text"
              required
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Progress % (0 - 100)", "పురోగతి %")}</label>
              <input
                type="number"
                min="0"
                max="100"
                value={updateProgress}
                onChange={(e) => setUpdateProgress(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t("Status", "స్థితి")}</label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="In progress">In progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t("Inspection Notes", "పర్యవేక్షణ వివరాలు")}</label>
            <textarea
              rows={3}
              required
              value={updateNotes}
              onChange={(e) => setUpdateNotes(e.target.value)}
              placeholder="e.g. Sub-grade concrete curing completed. Tested with compressive cube testing machine..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowUpdateModal(false)}>
              {t("Cancel", "రద్దు")}
            </Button>
            <Button type="submit" size="sm">
              {t("Save Milestone", "నమోదు చేయి")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
