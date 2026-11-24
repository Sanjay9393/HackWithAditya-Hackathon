import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/authContext';
import { VillageLogo } from '../common/VillageLogo';
import {
  LayoutDashboard,
  Hammer,
  MapPin,
  Award,
  Sparkles,
  AlertCircle,
  Bell,
  Users,
  Sprout,
  Building2,
  Briefcase,
  Bot,
  FileText,
  PieChart,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, t } = useAuth();

  const navItems = [
    {
      to: '/',
      icon: LayoutDashboard,
      label_en: 'Dashboard',
      label_te: 'డ్యాష్‌బోర్డ్',
    },
    {
      to: '/projects',
      icon: Hammer,
      label_en: 'Village Works',
      label_te: 'అభివృద్ధి పనులు',
    },
    {
      to: '/map',
      icon: MapPin,
      label_en: 'Village Map',
      label_te: 'గ్రామ మ్యాప్',
    },
    {
      to: '/schemes',
      icon: Award,
      label_en: 'Government Schemes',
      label_te: 'ప్రభుత్వ పథకాలు',
    },
    {
      to: '/schemes/recommend',
      icon: Sparkles,
      label_en: 'Scheme Finder (AI)',
      label_te: 'అర్హత అంచనా',
      badge: 'Smart',
    },
    {
      to: '/budgets',
      icon: PieChart,
      label_en: 'Budget Transparency',
      label_te: 'గ్రామ బడ్జెట్',
    },
    {
      to: '/issues',
      icon: AlertCircle,
      label_en: 'Civic Issues',
      label_te: 'సమస్యల నివేదిక',
    },
    {
      to: '/announcements',
      icon: Bell,
      label_en: 'Announcements',
      label_te: 'ప్రకటనలు',
    },
    {
      to: '/gram-sabha',
      icon: Users,
      label_en: 'Gram Sabha',
      label_te: 'గ్రామ సభ',
    },
    {
      to: '/farmers',
      icon: Sprout,
      label_en: 'Farmer Center',
      label_te: 'రైతు సమాచారం',
    },
    {
      to: '/services',
      icon: Building2,
      label_en: 'Services Directory',
      label_te: 'సేవా కేంద్రాలు',
    },
    {
      to: '/employment',
      icon: Briefcase,
      label_en: 'Employment & MGNREGA',
      label_te: 'ఉపాధి & కూలీ',
    },
    {
      to: '/assistant',
      icon: Bot,
      label_en: 'AI Village Assistant',
      label_te: 'ఏఐ అసిస్టెంట్',
      badge: 'Voice',
    },
    {
      to: '/documents',
      icon: FileText,
      label_en: 'Doc Intelligence',
      label_te: 'పత్రాల గుర్తింపు',
    },
  ];

  const adminItem = {
    to: '/admin',
    icon: ShieldCheck,
    label_en: 'Admin Console',
    label_te: 'అడ్మిన్ డాష్‌బోర్డ్',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200/80 bg-white transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 md:hidden">
          <span className="font-bold text-slate-900">PrajaAI Menu</span>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Banner for Desktop */}
        <div className="hidden md:flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <VillageLogo size="md" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">
              Praja<span className="text-[#166534]">AI</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-medium">స్మార్ట్ విలేజ్ వేదిక</span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {t('Village Navigation', 'గ్రామ నావిగేషన్')}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-[#166534] font-semibold border-l-3 border-[#166534] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{t(item.label_en, item.label_te)}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100/80 text-[#166534]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Admin section */}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <p className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t('Administration', 'పరిపాలన')}
            </p>
            <NavLink
              to={adminItem.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 font-semibold border-l-3 border-amber-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <adminItem.icon className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t(adminItem.label_en, adminItem.label_te)}</span>
              </div>
              {user?.role === 'admin' ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                  Active
                </span>
              ) : (
                <span className="text-[9px] font-medium text-slate-400">Panchayat</span>
              )}
            </NavLink>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Chandanagar GP</span>
            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">v1.0</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {t('"Your village. Your future."', '"మీ గ్రామం. మీ భవిష్యత్తు."')}
          </p>
        </div>
      </aside>
    </>
  );
};
