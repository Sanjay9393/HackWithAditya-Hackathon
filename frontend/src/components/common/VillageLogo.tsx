import React from 'react';

interface VillageLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  showText?: boolean;
}

export const VillageLogo: React.FC<VillageLogoProps> = ({
  size = 'md',
  className = '',
  showText = false
}) => {
  // Resolve numeric size
  let dimension = 40;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'sm': dimension = 28; break;
      case 'md': dimension = 38; break;
      case 'lg': dimension = 52; break;
      case 'xl': dimension = 80; break;
      case '2xl': dimension = 120; break;
      default: dimension = 40;
    }
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* SVG Village Emblem */}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md select-none transition-transform hover:scale-105 duration-300"
      >
        <defs>
          {/* Outer Ring Gradient */}
          <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Sky Gradient (Sunrise over rural fields) */}
          <linearGradient id="skyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          {/* Sun Glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Field Hill 1 */}
          <linearGradient id="fieldHill1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          {/* Field Hill 2 */}
          <linearGradient id="fieldHill2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>

          {/* Tree Canopy */}
          <linearGradient id="treeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#052E16" />
          </linearGradient>
        </defs>

        {/* Outer Circular Shield Border */}
        <circle cx="60" cy="60" r="58" fill="url(#goldRing)" />
        <circle cx="60" cy="60" r="53" fill="#064E3B" />
        <circle cx="60" cy="60" r="50" fill="url(#skyGrad)" />

        {/* Rising Golden Sun */}
        <circle cx="60" cy="46" r="22" fill="url(#sunGlow)" />
        <circle cx="60" cy="46" r="14" fill="#F59E0B" />
        <circle cx="60" cy="46" r="10" fill="#FEF3C7" />

        {/* Sunbeams */}
        <path d="M60 22 L60 28" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M42 27 L46 32" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M78 27 L74 32" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M34 40 L40 43" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M86 40 L80 43" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />

        {/* Rolling Village Farmland Hills */}
        <path
          d="M14 85 Q 40 68, 75 78 Q 95 83, 106 86 L 106 102 Q 60 115, 14 102 Z"
          fill="url(#fieldHill1)"
        />
        <path
          d="M10 92 Q 45 78, 80 88 Q 100 93, 110 96 L 110 106 Q 60 117, 10 106 Z"
          fill="url(#fieldHill2)"
        />

        {/* Terraced Furrow Lines (Agricultural Rows) */}
        <path d="M30 84 Q 50 78, 70 82" stroke="#86EFAC" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.7" />
        <path d="M25 91 Q 50 85, 80 90" stroke="#86EFAC" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.7" />
        <path d="M20 98 Q 55 93, 90 98" stroke="#4ADE80" strokeWidth="1.2" strokeOpacity="0.8" />

        {/* Traditional Village Panchayat Bhavan / Rural House Silhouette */}
        <path
          d="M74 72 L 86 64 L 98 72 L 95 85 L 77 85 Z"
          fill="#FEF3C7"
          stroke="#B45309"
          strokeWidth="1.2"
        />
        {/* Roof */}
        <path d="M72 72 L 86 62 L 100 72 Z" fill="#DC2626" />
        {/* Door & Window */}
        <rect x="83" y="76" width="6" height="9" fill="#78350F" rx="1" />
        <rect x="77" y="74" width="4" height="4" fill="#60A5FA" />

        {/* Majestic Village Banyan / Peepal Tree (రచ్చబండ / గ్రామ వృక్షం) */}
        {/* Trunk & Roots */}
        <path
          d="M45 84 C 45 74, 48 70, 48 64 C 48 62, 45 58, 45 58 C 45 58, 51 60, 52 64 C 53 72, 57 76, 59 84"
          fill="#78350F"
          stroke="#451A03"
          strokeWidth="1"
        />
        <path d="M47 70 C 42 66, 38 64, 34 65" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <path d="M52 68 C 56 65, 60 63, 64 64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

        {/* Tree Canopy (Lush Green Foliage) */}
        <circle cx="48" cy="46" r="14" fill="url(#treeGrad)" />
        <circle cx="36" cy="52" r="11" fill="url(#treeGrad)" />
        <circle cx="60" cy="52" r="11" fill="url(#treeGrad)" />
        <circle cx="42" cy="40" r="10" fill="#22C55E" fillOpacity="0.5" />
        <circle cx="54" cy="42" r="9" fill="#86EFAC" fillOpacity="0.5" />

        {/* AI Digital Sparkles & Constellation Nodes (Technology for Villages) */}
        {/* Node 1 */}
        <circle cx="28" cy="34" r="2.5" fill="#FFFFFF" />
        <line x1="28" y1="34" x2="36" y2="44" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1 1" strokeOpacity="0.8" />
        {/* Node 2 (AI Star) */}
        <path
          d="M88 32 L89.5 35.5 L93 37 L89.5 38.5 L88 42 L86.5 38.5 L83 37 L86.5 35.5 Z"
          fill="#FDE047"
        />
        {/* Node 3 */}
        <circle cx="94" cy="48" r="2" fill="#67E8F9" />
        <line x1="88" y1="37" x2="94" y2="48" stroke="#67E8F9" strokeWidth="1" strokeOpacity="0.7" />

        {/* Golden Paddy Stalks (Wreaths of Grain on left and right borders) */}
        {/* Left Stalk */}
        <path d="M16 75 Q 18 60, 22 46" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <ellipse cx="18" cy="68" rx="2" ry="4" transform="rotate(-30 18 68)" fill="#FBBF24" />
        <ellipse cx="17" cy="58" rx="2" ry="4" transform="rotate(-20 17 58)" fill="#FBBF24" />
        <ellipse cx="19" cy="48" rx="2" ry="4" transform="rotate(-10 19 48)" fill="#FBBF24" />

        {/* Right Stalk */}
        <path d="M104 75 Q 102 60, 98 46" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <ellipse cx="102" cy="68" rx="2" ry="4" transform="rotate(30 102 68)" fill="#FBBF24" />
        <ellipse cx="103" cy="58" rx="2" ry="4" transform="rotate(20 103 58)" fill="#FBBF24" />
        <ellipse cx="101" cy="48" rx="2" ry="4" transform="rotate(10 101 48)" fill="#FBBF24" />
      </svg>

      {/* Optional Side Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">
              Praja<span className="text-[#166534]">AI</span>
            </span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
              గ్రామ AI
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 tracking-wide">
            Smart Village Platform
          </span>
        </div>
      )}
    </div>
  );
};
