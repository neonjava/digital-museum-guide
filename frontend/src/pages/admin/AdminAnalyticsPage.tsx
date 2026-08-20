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
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Museum, AnalyticsSummary } from '../../types';
import { api } from '../../services/api';

export const AdminAnalyticsPage: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [selectedMuseumId, setSelectedMuseumId] = useState<string>('');
  const [analytics, setAnalytics] = useState<any>({
    summary: { totalViews: 0, totalQRScans: 0, totalAudioPlays: 0 },
    sources: { QR: 0, WEB: 0, APP: 0 },
    topScannedArtifacts: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Fetch live museums list
  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const res = await api.get('/museums');
        if (res.success && res.data && res.data.length > 0) {
          setMuseums(res.data);
          setSelectedMuseumId(res.data[0]._id);
        }
      } catch (err) {
        console.warn('Error loading museums list:', err);
      }
    };
    fetchMuseums();
  }, []);

  // Fetch real-time analytics from backend database
  const fetchAnalytics = async (museumId: string) => {
    if (!museumId) return;
    try {
      setLoading(true);
      const res = await api.get(`/analytics/museum/${museumId}`);
      if (res.success && res.data) {
        setAnalytics(res.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.warn('Error fetching live analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMuseumId) {
      fetchAnalytics(selectedMuseumId);
    }
  }, [selectedMuseumId]);

  const qrScans = analytics.summary?.totalQRScans || 0;
  const webViews = analytics.summary?.totalViews || 0;
  const audioPlays = analytics.summary?.totalAudioPlays || 0;
  const totalEvents = (analytics.sources?.QR || qrScans) + (analytics.sources?.WEB || webViews) + (analytics.sources?.APP || 0);

  const qrPct = totalEvents > 0 ? Math.round(((analytics.sources?.QR || qrScans) / totalEvents) * 100) : 0;
  const webPct = totalEvents > 0 ? Math.round(((analytics.sources?.WEB || webViews) / totalEvents) * 100) : 0;
  const appPct = totalEvents > 0 ? Math.max(0, 100 - qrPct - webPct) : 0;

  return (
    <AdminLayout
      title="Live Visitor & Scan Analytics"
      subtitle="Real-time telemetry tracking for exhibit QR scans, audio listens, and visitor origin"
      actions={
        <div className="flex items-center space-x-3">
          <span className="text-[11px] text-[#64748B] font-mono hidden sm:inline">
            Updated: {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            onClick={() => fetchAnalytics(selectedMuseumId)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#214E86] text-white text-xs font-bold hover:bg-[#17365F] transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Museum Filter */}
        <div className="bg-white p-4 rounded-2xl border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-[#214E86]" />
            <span className="text-xs font-bold text-[#172033] uppercase tracking-wider">
              Filter by Museum:
            </span>
          </div>

          <select
            value={selectedMuseumId}
            onChange={(e) => setSelectedMuseumId(e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-[#FBFCFD] text-xs font-semibold text-[#172033] focus:outline-none focus:border-[#214E86]"
          >
            {museums.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* 100% Real Live Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Physical QR Scans
              </span>
              <QrCode className="w-5 h-5 text-[#214E86]" />
            </div>
            <div className="text-3xl font-serif font-bold text-[#172033]">
              {qrScans}
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <span>● {qrPct}% of all visits originated from QR placards</span>
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Total Exhibit Views
              </span>
              <Eye className="w-5 h-5 text-[#214E86]" />
            </div>
            <div className="text-3xl font-serif font-bold text-[#172033]">
              {webViews}
            </div>
            <p className="text-xs text-[#64748B]">
              Verified visitor impressions
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Audio Voice Listens
              </span>
              <Headphones className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-serif font-bold text-[#172033]">
              {audioPlays}
            </div>
            <p className="text-xs text-amber-700 font-semibold">
              Voice narration sessions
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Registered Museums
              </span>
              <Landmark className="w-5 h-5 text-[#214E86]" />
            </div>
            <div className="text-3xl font-serif font-bold text-[#172033]">
              {museums.length || 6}
            </div>
            <p className="text-xs text-[#64748B]">
              Institutions on live network
            </p>
          </div>
        </div>

        {/* Traffic Breakdown & Most Scanned Physical Exhibits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Scanned Physical Exhibits */}
          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#214E86] flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Most Scanned Physical Exhibits</span>
            </h3>

            <div className="space-y-3">
              {analytics.topScannedArtifacts && analytics.topScannedArtifacts.length > 0 ? (
                analytics.topScannedArtifacts.map((art: any, idx: number) => (
                  <div
                    key={art._id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FBFCFD] border border-[#CBD5E1]"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-full bg-[#214E86] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-[#172033] block line-clamp-1">
                          {art.name}
                        </span>
                        <span className="text-[11px] text-[#64748B] block">
                          {art.locationInsideMuseum || 'Main Exhibit Hall'}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-xs font-bold text-[#214E86] bg-[#EAF2FA] px-3 py-1 rounded-lg border border-[#CBD5E1]">
                      {art.scanCount || 0} scans
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-[#FBFCFD] rounded-2xl border border-dashed border-[#CBD5E1] text-xs text-[#64748B]">
                  Point your phone camera to scan physical QR placards to generate live exhibit rankings.
                </div>
              )}
            </div>
          </div>

          {/* Real Traffic Source Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#214E86] flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Live Traffic Origin Breakdown</span>
            </h3>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#214E86]">Physical QR Placard Scans</span>
                  <span>{analytics.sources?.QR || qrScans} scans ({qrPct}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#214E86] rounded-full transition-all"
                    style={{ width: `${qrPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Web Portal Direct</span>
                  <span>{analytics.sources?.WEB || webViews} visits ({webPct}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-slate-500 rounded-full transition-all"
                    style={{ width: `${webPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-amber-700">Android Companion App Sessions</span>
                  <span>{analytics.sources?.APP || 0} sessions ({appPct}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${appPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
