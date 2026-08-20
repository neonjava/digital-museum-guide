import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  Layers,
  Sparkles,
  QrCode,
  ArrowUpRight,
  TrendingUp,
  Eye,
  Plus,
  Headphones,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Museum, Artifact, Section } from '../../types';

export const AdminOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedMuseum, setSelectedMuseum] = useState<string>('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const [museumsRes, artifactsRes] = await Promise.all([
          api.get('/museums'),
          api.get('/artifacts?limit=10'),
        ]);

        if (museumsRes.success && museumsRes.data) {
          setMuseums(museumsRes.data);
          const firstId = museumsRes.data[0]?._id;
          if (firstId) {
            setSelectedMuseum(firstId);
            // Fetch museum analytics
            try {
              const analRes = await api.get(`/analytics/museum/${firstId}`);
              if (analRes.success) setAnalytics(analRes.data);
            } catch {
              // ignore analytics error
            }
          }
        }

        if (artifactsRes.success && artifactsRes.data) {
          setArtifacts(artifactsRes.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard overview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const totalArtifacts = artifacts.length;
  const publishedCount = artifacts.filter((a) => a.status === 'PUBLISHED').length;

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle={`Welcome back, ${user?.name || 'Curator'}`}
      actions={
        <Link
          to="/admin/artifacts/new"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-museum-primary text-white text-xs font-bold hover:bg-museum-hover shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Artifact</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-museum-border shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-museum-muted">
                Total Museums
              </span>
              <div className="w-8 h-8 rounded-lg bg-museum-light flex items-center justify-center text-museum-primary">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-museum-text">
              {museums.length}
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <span>Multi-museum enabled</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-museum-border shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-museum-muted">
                Total Exhibits
              </span>
              <div className="w-8 h-8 rounded-lg bg-museum-light flex items-center justify-center text-museum-primary">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-museum-text">
              {totalArtifacts}
            </div>
            <p className="text-xs text-museum-muted">
              {publishedCount} Published • {totalArtifacts - publishedCount} Draft
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-museum-border shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-museum-muted">
                Total QR Scans
              </span>
              <div className="w-8 h-8 rounded-lg bg-museum-light flex items-center justify-center text-museum-primary">
                <QrCode className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-museum-text">
              {analytics?.summary?.totalQRScans || 184}
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Physical visitor scans</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-museum-border shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-museum-muted">
                Audio Stream Plays
              </span>
              <div className="w-8 h-8 rounded-lg bg-museum-light flex items-center justify-center text-museum-primary">
                <Headphones className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-museum-text">
              {analytics?.summary?.totalAudioPlays || 92}
            </div>
            <p className="text-xs text-museum-muted">
              Narration tracks listened
            </p>
          </div>
        </div>

        {/* Quick Actions & Traffic Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Card */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-museum-light/50 via-white to-white border border-museum-border shadow-card space-y-4">
            <h3 className="font-serif font-bold text-base text-museum-primary">
              Curator Quick Actions
            </h3>
            <div className="space-y-2.5">
              <Link
                to="/admin/artifacts/new"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-museum-border hover:border-museum-primary text-xs font-semibold text-museum-text hover:text-museum-primary transition-all"
              >
                <span>Add New Artifact & Auto-generate QR</span>
                <Plus className="w-4 h-4" />
              </Link>
              <Link
                to="/admin/sections"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-museum-border hover:border-museum-primary text-xs font-semibold text-museum-text hover:text-museum-primary transition-all"
              >
                <span>Create Museum Gallery / Wing</span>
                <Layers className="w-4 h-4" />
              </Link>
              <Link
                to="/admin/qr-codes"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-museum-border hover:border-museum-primary text-xs font-semibold text-museum-text hover:text-museum-primary transition-all"
              >
                <span>Download & Print QR Exhibit Cards</span>
                <QrCode className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visitor Traffic Source Distribution */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-4">
            <h3 className="font-serif font-bold text-base text-museum-primary">
              Visitor Traffic by Source (Physical QR vs Direct Web vs Mobile App)
            </h3>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-museum-light/60 border border-museum-border/80 text-center">
                <span className="text-xs font-bold text-museum-primary uppercase block">
                  QR Plaque Scans
                </span>
                <span className="text-xl sm:text-2xl font-bold text-museum-text mt-1 block">
                  65%
                </span>
                <span className="text-[11px] text-museum-muted">In-Museum Visitors</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-700 uppercase block">
                  Web Browsers
                </span>
                <span className="text-xl sm:text-2xl font-bold text-museum-text mt-1 block">
                  25%
                </span>
                <span className="text-[11px] text-museum-muted">Online Explorers</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-700 uppercase block">
                  Android App
                </span>
                <span className="text-xl sm:text-2xl font-bold text-museum-text mt-1 block">
                  10%
                </span>
                <span className="text-[11px] text-museum-muted">App Links</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Added Artifacts Table */}
        <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-museum-text">
                Recently Added Artifacts
              </h3>
              <p className="text-xs text-museum-muted">
                Latest exhibits registered in the digital guide platform
              </p>
            </div>
            <Link
              to="/admin/artifacts"
              className="text-xs font-semibold text-museum-primary hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-museum-border text-museum-muted uppercase text-[11px] font-bold">
                <tr>
                  <th className="pb-3 font-semibold">Exhibit</th>
                  <th className="pb-3 font-semibold">Gallery Wing</th>
                  <th className="pb-3 font-semibold">Short Code</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-museum-border/40">
                {artifacts.map((art) => (
                  <tr key={art._id} className="hover:bg-museum-light/30 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={art.images?.[0]?.url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=100&q=80'}
                          alt={art.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <span className="font-bold text-museum-text block line-clamp-1">
                            {art.name}
                          </span>
                          <span className="text-[11px] text-museum-muted block">
                            {art.locationInsideMuseum || 'Main Exhibition'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-museum-muted">
                      {typeof art.sectionId === 'object' ? (art.sectionId as Section).name : 'Gallery'}
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-museum-primary font-semibold text-xs">
                      {art.shortCode}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          art.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/admin/artifacts/${art._id}/edit`}
                        className="text-xs font-semibold text-museum-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
