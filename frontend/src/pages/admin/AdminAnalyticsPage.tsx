import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  QrCode,
  Eye,
  Headphones,
  TrendingUp,
  Landmark,
  Smartphone,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Museum, AnalyticsSummary } from '../../types';
import { api } from '../../services/api';

export const AdminAnalyticsPage: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [selectedMuseumId, setSelectedMuseumId] = useState<string>('');
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const res = await api.get('/museums');
        if (res.success && res.data && res.data.length > 0) {
          setMuseums(res.data);
          setSelectedMuseumId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching museums:', err);
      }
    };
    fetchMuseums();
  }, []);

  const fetchAnalytics = async (museumId: string) => {
    if (!museumId) return;
    try {
      setLoading(true);
      const res = await api.get(`/analytics/museum/${museumId}`);
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMuseumId) {
      fetchAnalytics(selectedMuseumId);
    }
  }, [selectedMuseumId]);

  return (
    <AdminLayout
      title="Visitor & Scan Analytics"
      subtitle="Track physical exhibit QR engagement, audio listens, and visitor traffic"
      actions={
        <button
          onClick={() => fetchAnalytics(selectedMuseumId)}
          className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-white border border-museum-border text-xs font-semibold text-museum-text hover:bg-museum-light transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* Museum Selector Filter */}
        <div className="bg-white p-4 rounded-2xl border border-museum-border shadow-card flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-museum-primary" />
            <span className="text-xs font-bold text-museum-text uppercase tracking-wider">
              Museum:
            </span>
          </div>

          <select
            value={selectedMuseumId}
            onChange={(e) => setSelectedMuseumId(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 rounded-xl border border-museum-border bg-museum-bg text-xs font-semibold text-museum-text focus:outline-hidden focus:border-museum-primary"
          >
            {museums.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-museum-muted">
                Physical QR Scans
              </span>
              <QrCode className="w-5 h-5 text-museum-primary" />
            </div>
            <div className="text-3xl font-serif font-bold text-museum-text">
              {analytics?.summary?.totalQRScans || 0}
            </div>
            <p className="text-xs text-emerald-600 font-semibold">
              In-person gallery visitor scans
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-museum-muted">
                Total Exhibit Views
              </span>
              <Eye className="w-5 h-5 text-museum-primary" />
            </div>
            <div className="text-3xl font-serif font-bold text-museum-text">
              {analytics?.summary?.totalViews || 0}
            </div>
            <p className="text-xs text-museum-muted">
              Cumulative visitor impressions
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-museum-muted">
                Audio Stream Plays
              </span>
              <Headphones className="w-5 h-5 text-museum-primary" />
            </div>
            <div className="text-3xl font-serif font-bold text-museum-text">
              {analytics?.summary?.totalAudioPlays || 0}
            </div>
            <p className="text-xs text-museum-muted">
              Voice narration sessions
            </p>
          </div>
        </div>

        {/* Traffic Sources & Top Artifacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Scanned Exhibits */}
          <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-4">
            <h3 className="font-serif font-bold text-base text-museum-primary flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Most Scanned Exhibits</span>
            </h3>

            <div className="space-y-3">
              {analytics?.topScannedArtifacts?.map((art, idx) => (
                <div
                  key={art._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-museum-bg border border-museum-border/60"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-museum-light text-museum-primary font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-museum-text block line-clamp-1">
                        {art.name}
                      </span>
                      <span className="text-[11px] text-museum-muted block">
                        {art.locationInsideMuseum || 'Main Exhibition'}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-museum-primary bg-white px-2.5 py-1 rounded-lg border border-museum-border/60">
                    {art.scanCount || 0} scans
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Source Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-4">
            <h3 className="font-serif font-bold text-base text-museum-primary flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Traffic Origin Breakdown</span>
            </h3>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-museum-primary">Physical QR Scans</span>
                  <span>{analytics?.sources?.QR || 0} events</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-museum-primary rounded-full w-[65%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Web Browser Direct</span>
                  <span>{analytics?.sources?.WEB || 0} events</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full w-[25%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Android Deep Links / App</span>
                  <span>{analytics?.sources?.APP || 0} events</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
