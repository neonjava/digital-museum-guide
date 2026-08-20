import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  Landmark,
  Compass,
  Headphones,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  ChevronRight,
  Smartphone,
  Download,
  ShieldCheck,
  Film,
  CheckCircle2,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { QRScannerModal } from '../../components/visitor/QRScannerModal';
import { Museum } from '../../types';
import { api } from '../../services/api';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const res = await api.get('/museums');
        if (res.success && res.data) {
          setMuseums(res.data);
        }
      } catch (err) {
        console.error('Error fetching museums:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMuseums();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-museum-bg">
      <Header />

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-10">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-museum-dark via-museum-primary to-museum-hover text-white p-6 sm:p-12 shadow-elevated">
          <div className="absolute -right-12 -bottom-12 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-museum-light text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GM University Heritage Museum Guide</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
              Interactive Digital Museum Experience
            </h1>

            <p className="text-sm sm:text-lg text-museum-light/90 leading-relaxed font-normal">
              Explore galleries, listen to voice narrations, watch video demonstrations, and scan physical exhibit QR codes using your browser or the Android app.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/museum/gmu-heritage-museum"
                className="flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-white text-museum-primary font-bold text-sm sm:text-base hover:bg-museum-light shadow-lg active:scale-95 transition-all"
              >
                <Compass className="w-5 h-5 text-museum-primary" />
                <span>Explore Museum</span>
              </Link>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center justify-center space-x-2 px-5 py-3.5 rounded-2xl bg-museum-light/20 hover:bg-museum-light/30 text-white font-bold text-sm sm:text-base border border-white/30 backdrop-blur-xs active:scale-95 transition-all"
              >
                <QrCode className="w-5 h-5" />
                <span>Scan Exhibit QR</span>
              </button>

              <a
                href="/downloads/gmu-museum-guide.apk"
                download="gmu-museum-guide.apk"
                className="flex items-center justify-center space-x-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md active:scale-95 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Download Android App</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="max-w-2xl mx-auto -mt-6 relative z-20">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center shadow-elevated rounded-2xl bg-white border border-museum-border overflow-hidden p-1.5"
          >
            <Search className="w-5 h-5 text-museum-muted ml-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search artifacts (e.g. 'water clock', 'manuscript', 'astrolabe')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-3 text-sm sm:text-base text-museum-text placeholder:text-museum-muted focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-museum-primary text-white text-sm font-semibold hover:bg-museum-hover transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Dedicated Android App Download Banner */}
        <div className="rounded-3xl bg-linear-to-r from-emerald-950 via-slate-900 to-museum-dark text-white p-6 sm:p-8 border border-emerald-800/40 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Official Visitor Mobile App (Android APK)
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Download GMU Museum Guide App
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Get native camera QR scanning, seamless deep linking when scanning physical placards, and instant high-quality audio narrations right on your Android phone.
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-xs text-emerald-200">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ultra-fast QR Scanner</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive Audio Tour</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No Account Required</span>
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <a
              href="/downloads/gmu-museum-guide.apk"
              download="gmu-museum-guide.apk"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 shadow-lg active:scale-95 transition-all text-sm sm:text-base"
            >
              <Download className="w-5 h-5" />
              <span>Download APK (15 MB)</span>
            </a>
          </div>
        </div>

        {/* Featured Galleries & Wings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-museum-text">
                Explore Museum Galleries
              </h2>
              <p className="text-xs sm:text-sm text-museum-muted mt-1">
                Curated collections at GM University Heritage Museum
              </p>
            </div>
            <Link
              to="/museum/gmu-heritage-museum"
              className="text-xs font-semibold text-museum-primary hover:underline flex items-center space-x-1"
            >
              <span>View All Wings</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : museums.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-museum-border">
              <Landmark className="w-12 h-12 text-museum-muted mx-auto mb-3" />
              <h3 className="font-bold text-museum-text">No museums registered yet</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {museums.map((museum) => (
                <Link
                  key={museum._id}
                  to={`/museum/${museum.slug || museum._id}`}
                  className="group block rounded-3xl overflow-hidden bg-white border border-museum-border shadow-card hover:shadow-elevated transition-all"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-800">
                    <img
                      src={
                        museum.coverImage ||
                        'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={museum.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-serif font-bold text-xl sm:text-2xl group-hover:text-museum-light transition-colors line-clamp-1">
                        {museum.name}
                      </h3>
                      {museum.address?.city && (
                        <p className="flex items-center space-x-1 text-xs text-white/80 mt-1">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>
                            {museum.address.city}, {museum.address.state}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs sm:text-sm text-museum-muted line-clamp-2 leading-relaxed">
                      {museum.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-museum-border/60 text-xs font-semibold text-museum-primary">
                      <span>Browse Museum Galleries & Audio Guides</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Staff / Curator Portal Card */}
        <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-museum-light text-museum-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-museum-text">
                Museum Staff & Curator Management Portal
              </h4>
              <p className="text-xs text-museum-muted">
                Add new artifacts, upload audio narrations, configure galleries, and print QR codes
              </p>
            </div>
          </div>

          <Link
            to="/admin/login"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-museum-dark hover:bg-museum-primary text-white text-xs font-bold transition-colors text-center shrink-0"
          >
            Access Admin Dashboard →
          </Link>
        </div>
      </main>

      <Footer />

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
