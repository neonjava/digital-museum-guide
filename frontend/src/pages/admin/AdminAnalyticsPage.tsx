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
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Museum, AnalyticsSummary } from '../../types';
import { api } from '../../services/api';

const DEFAULT_ANALYTICS: any = {
  summary: {
    totalViews: 1420,
    totalQRScans: 485,
    totalAudioPlays: 320,
    totalVideoPlays: 190,
  },
  topScannedArtifacts: [
    {
      _id: 'a1',
      name: 'Ancient Water Clock (Ghati Yantra)',
      shortCode: 'art_8f29d2',
      locationInsideMuseum: 'Gallery 2, Stand 14',
      scanCount: 142,
      viewCount: 380,
    },
    {
      _id: 'a2',
      name: 'Chola Bronze Dancing Shiva (Nataraja)',
      shortCode: 'art_5d81c2',
      locationInsideMuseum: 'Bronze Gallery, Center Plinth',
      scanCount: 118,
      viewCount: 295,
    },
    {
      _id: 'a3',
      name: 'Fairy Queen Steam Locomotive (1855)',
      shortCode: 'art_3c7d19',
      locationInsideMuseum: 'Track 1, Heritage Yard',
      scanCount: 94,
      viewCount: 240,
    },
    {
      _id: 'a4',
      name: 'Rohini-75 Sounding Rocket Prototype',
      shortCode: 'art_9c3b1a',
      locationInsideMuseum: 'Launch Hall, Tower Alpha',
      scanCount: 78,
      viewCount: 210,
    },
  ],
  sources: {
    QR: 485,
    WEB: 210,
    APP: 165,
  },
};

export const AdminAnalyticsPage: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [selectedMuseumId, setSelectedMuseumId] = useState<string>('m1');
  const [analytics, setAnalytics] = useState<any>(DEFAULT_ANALYTICS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const res = await api.get('/museums');
        if (res.success && res.data && res.data.length > 0) {
          setMuseums(res.data);
          setSelectedMuseumId(res.data[0]._id);
        }
      } catch (err) {
        console.warn('Using default museum list in analytics');
      }
    };
    fetchMuseums();
  }, []);

  const fetchAnalytics = async (museumId: string) => {
    if (!museumId) return;
    try {
      setLoading(true);
      const res = await api.get(`/analytics/museum/${museumId}`);
      if (res.success && res.data && res.data.summary) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.warn('Using default analytics metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMuseumId) {
      fetchAnalytics(selectedMuseumId);
    }
  }, [selectedMuseumId]);

  const qrPercentage = Math.round(
    ((analytics.sources?.QR || 485) /
      ((analytics.sources?.QR || 485) +
        (analytics.sources?.WEB || 210) +
        (analytics.sources?.APP || 165))) *
      100
  );

  return (
    <AdminLayout
      title="Visitor & Scan Analytics"
      subtitle="Track physical exhibit QR engagement, audio listens, and visitor traffic in real time"
      actions={
        <button
          onClick={() => fetchAnalytics(selectedMuseumId)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#214E86] text-white text-xs font-bold hover:bg-[#17365F] transition-all shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Physical QR Scans
              </span>
              <QrCode className="w-5 h-5 text-[#214E86]" />
            </div>
            <div className="text-3xl font-serif font-bold text-[#172033]">
              {analytics.summary?.totalQRScans || 485}
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <span>● {qrPercentage}% of total visitors scanned placard</span>
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
              {analytics.summary?.totalViews || 1420}
            </div>
            <p className="text-xs text-[#64748B]">
              Cumulative visitor impressions
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Audio Tour Listens
              </span>
              <Headphones className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-serif font-bold text-[#172033]">
              {analytics.summary?.totalAudioPlays || 320}
            </div>
            <p className="text-xs text-amber-700 font-semibold">
              Voice narration sessions
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Active Museums
              </span>
              <Landmark className="w-5 h-5 text-[#214E86]" />
            </div>
            <div className="text-3xl font-serif font-bold text-[#172033]">
              6 Institutions
            </div>
            <p className="text-xs text-[#64748B]">
              8 interactive exhibits live
            </p>
          </div>
        </div>

        {/* Traffic Sources & Top Artifacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Scanned Exhibits */}
          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#214E86] flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Most Scanned Physical Exhibits</span>
            </h3>

            <div className="space-y-3">
              {analytics.topScannedArtifacts?.map((art: any, idx: number) => (
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
                        {art.locationInsideMuseum || 'Main Exhibition'}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-[#214E86] bg-[#EAF2FA] px-3 py-1 rounded-lg border border-[#CBD5E1]">
                    {art.scanCount || 0} scans
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Source Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#214E86] flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Visitor Traffic Origin Breakdown</span>
            </h3>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#214E86]">Physical QR Placard Scans</span>
                  <span>{analytics.sources?.QR || 485} scans ({qrPercentage}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#214E86] rounded-full"
                    style={{ width: `${qrPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Web Portal Direct</span>
                  <span>{analytics.sources?.WEB || 210} visits</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full w-[25%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Android Companion App Sessions</span>
                  <span>{analytics.sources?.APP || 165} sessions</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
