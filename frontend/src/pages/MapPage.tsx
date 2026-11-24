import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Hammer,
  AlertCircle,
  Building2,
  List as ListIcon,
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const { t, language } = useAuth();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [projects, setProjects] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Layer toggles
  const [showProjects, setShowProjects] = useState(true);
  const [showIssues, setShowIssues] = useState(true);
  const [showServices, setShowServices] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Load data
  useEffect(() => {
    Promise.all([
      api.get('/projects'),
      api.get('/issues'),
      api.get('/services')
    ]).then(([pRes, iRes, sRes]) => {
      setProjects(pRes.data);
      setIssues(iRes.data);
      setServices(sRes.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Chandanagar Gram Panchayat
      const map = L.map(mapContainerRef.current).setView([16.3075, 80.4365], 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [viewMode]);

  // Update Markers when layers or data change
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Projects (Green Marker)
    if (showProjects) {
      projects.forEach(p => {
        if (!p.latitude || !p.longitude) return;
        const icon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: #166534; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); color: white; font-size: 14px;">🏗️</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([p.latitude, p.longitude], { icon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; max-width: 200px;">
            <div style="color: #166534; font-weight: bold; font-size: 13px;">${p.project_name}</div>
            <div style="color: #64748B; margin-top: 4px;">Ward ${p.ward_number} • ${p.category}</div>
            <div style="margin-top: 4px; font-weight: bold;">Budget: ₹${(p.budget_sanctioned / 100000).toFixed(2)}L</div>
            <div style="margin-top: 4px;">Progress: ${p.progress_pct}% (${p.status})</div>
          </div>
        `);
        marker.on('click', () => setSelectedItem({ type: 'project', data: p }));
        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 2. Civic Issues (Red/Amber Marker)
    if (showIssues) {
      issues.forEach(i => {
        if (!i.latitude || !i.longitude) return;
        const isResolved = i.status === 'Resolved';
        const color = isResolved ? '#10B981' : '#DC2626';
        const icon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); color: white; font-size: 12px;">⚠️</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([i.latitude, i.longitude], { icon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; max-width: 200px;">
            <div style="color: ${color}; font-weight: bold; font-size: 13px;">${i.title}</div>
            <div style="color: #64748B; margin-top: 4px;">Ward ${i.ward_number} • ${i.category}</div>
            <div style="margin-top: 4px;">Priority: <strong>${i.priority}</strong></div>
            <div style="margin-top: 4px;">Status: <strong>${i.status}</strong></div>
          </div>
        `);
        marker.on('click', () => setSelectedItem({ type: 'issue', data: i }));
        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 3. Public Facilities / Services (Blue Marker)
    if (showServices) {
      services.forEach(s => {
        if (!s.latitude || !s.longitude) return;
        const icon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: #2563EB; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); color: white; font-size: 12px;">🏛️</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([s.latitude, s.longitude], { icon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; max-width: 200px;">
            <div style="color: #2563EB; font-weight: bold; font-size: 13px;">${s.name}</div>
            <div style="color: #64748B; margin-top: 4px;">${s.category}</div>
            <div style="margin-top: 4px;">${s.address}</div>
            <div style="margin-top: 4px; color: #166534;">${s.opening_hours}</div>
          </div>
        `);
        marker.on('click', () => setSelectedItem({ type: 'service', data: s }));
        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [projects, issues, services, showProjects, showIssues, showServices]);

  return (
    <div className="space-y-4">
      {/* Page Title & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("Interactive Village Map", "ఇంటరాక్టివ్ గ్రామ పటం (మ్యాప్)")}
            </h1>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
              Chandanagar GP Coordinates
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t(
              "Visualize ongoing civil works, civic complaints, and public facilities with GIS layers.",
              "అభివృద్ధి పనులు, ప్రజల సమస్యలు, పాఠశాలలు మరియు ప్రభుత్వ కేంద్రాల భౌగోళిక సమాచారం."
            )}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'map' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
            icon={<MapPin className="w-4 h-4" />}
          >
            {t("GIS Map View", "మ్యాప్ వ్యూ")}
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            icon={<ListIcon className="w-4 h-4" />}
          >
            {t("List View", "జాబితా")}
          </Button>
        </div>
      </div>

      {/* Layer Toggles & Legend Bar */}
      <Card padding={false} className="p-3 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-semibold">
            <Layers className="w-4 h-4 text-[#166534]" />
            <span>{t("Toggle Map Layers:", "మ్యాప్ లేయర్లు:")}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* Projects Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showProjects}
                onChange={(e) => setShowProjects(e.target.checked)}
                className="rounded text-[#166534] focus:ring-[#166534]"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-[#166534]" />
              <span>{t("Civil Works", "అభివృద్ధి పనులు")} ({projects.length})</span>
            </label>

            {/* Issues Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showIssues}
                onChange={(e) => setShowIssues(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-600"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span>{t("Civic Issues", "ప్రజా సమస్యలు")} ({issues.length})</span>
            </label>

            {/* Public Facilities Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showServices}
                onChange={(e) => setShowServices(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-600"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>{t("Public Offices", "ప్రభుత్వ కేంద్రాలు")} ({services.length})</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Map View Container */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Leaflet Map Box */}
          <div className="lg:col-span-3 h-[520px] rounded-xl border border-slate-200 overflow-hidden shadow-sm relative">
            <div ref={mapContainerRef} className="w-full h-full" />
            <div className="absolute bottom-2 left-2 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] text-slate-600 border border-slate-200 shadow-xs">
              📍 Chandanagar Gram Panchayat (Center: 16.3075° N, 80.4365° E)
            </div>
          </div>

          {/* Marker Detail Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <Card title={t("Selected Location", "ఎంచుకున్న ప్రాంత వివరాలు")}>
              {selectedItem ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {selectedItem.type.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {selectedItem.data.project_name || selectedItem.data.title || selectedItem.data.name}
                    </h3>
                  </div>

                  {selectedItem.type === 'project' && (
                    <div className="space-y-2 text-slate-600">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-semibold text-slate-800">{selectedItem.data.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ward:</span>
                        <span className="font-semibold text-slate-800">Ward {selectedItem.data.ward_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-bold text-slate-900">₹{(selectedItem.data.budget_sanctioned / 100000).toFixed(2)}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant="success" size="sm">{selectedItem.data.status} ({selectedItem.data.progress_pct}%)</Badge>
                      </div>
                      <Link to={`/projects/${selectedItem.data.id}`}>
                        <Button size="sm" variant="outline" className="w-full mt-3">
                          {t("View Full Project →", "పూర్తి వివరాలు →")}
                        </Button>
                      </Link>
                    </div>
                  )}

                  {selectedItem.type === 'issue' && (
                    <div className="space-y-2 text-slate-600">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-semibold text-slate-800">{selectedItem.data.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <Badge variant="danger" size="sm">{selectedItem.data.priority}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant="warning" size="sm">{selectedItem.data.status}</Badge>
                      </div>
                      <p className="text-slate-500 pt-1">{selectedItem.data.description}</p>
                    </div>
                  )}

                  {selectedItem.type === 'service' && (
                    <div className="space-y-2 text-slate-600">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-semibold text-slate-800">{selectedItem.data.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hours:</span>
                        <span className="font-semibold text-slate-800">{selectedItem.data.opening_hours}</span>
                      </div>
                      <p className="text-slate-500 pt-1">{selectedItem.data.address}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>{t("Click on any marker on the map to inspect live project, complaint, or facility details.", "వివరాలు చూడటానికి మ్యాప్‌లోని గుర్తుపై క్లిక్ చేయండి.")}</p>
                </div>
              )}
            </Card>

            {/* Quick Stat Pill */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70 text-xs text-emerald-900">
              <span className="font-bold block mb-1">🗺️ {t("Geo-Tagged Coverage", "భౌగోళిక రికార్డు")}</span>
              <p className="text-slate-600 text-[11px]">
                100% of major village public projects and reported water/drainage issues are geo-tagged to local wards.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* List View Fallback */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Projects List */}
          <Card title={`${t("Village Works", "అభివృద్ధి పనులు")} (${projects.length})`}>
            <div className="space-y-2 max-h-96 overflow-y-auto text-xs">
              {projects.map(p => (
                <div key={p.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="font-semibold text-slate-900">{p.project_name}</div>
                  <div className="flex items-center justify-between text-slate-500 mt-1">
                    <span>Ward {p.ward_number}</span>
                    <span className="font-bold text-[#166534]">{p.progress_pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Issues List */}
          <Card title={`${t("Civic Issues", "ప్రజా సమస్యలు")} (${issues.length})`}>
            <div className="space-y-2 max-h-96 overflow-y-auto text-xs">
              {issues.map(i => (
                <div key={i.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="font-semibold text-slate-900 truncate">{i.title}</div>
                  <div className="flex items-center justify-between text-slate-500 mt-1">
                    <span>Ward {i.ward_number}</span>
                    <Badge variant="warning" size="sm">{i.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Services List */}
          <Card title={`${t("Government Facilities", "ప్రభుత్వ కేంద్రాలు")} (${services.length})`}>
            <div className="space-y-2 max-h-96 overflow-y-auto text-xs">
              {services.map(s => (
                <div key={s.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="font-semibold text-slate-900">{s.name}</div>
                  <div className="text-slate-500 mt-0.5">{s.address}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
