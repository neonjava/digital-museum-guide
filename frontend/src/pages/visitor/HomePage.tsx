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
  BookOpen,
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
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-museum-dark via-museum-primary to-museum-hover text-white p-6 sm:p-12 shadow-elevated mb-10">
          <div className="absolute -right-12 -bottom-12 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-museum-light text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Audio & Visual Guide</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
              Bring Museum Exhibits to Life
            </h1>

            <p className="text-sm sm:text-lg text-museum-light/90 leading-relaxed font-normal">
              Scan physical exhibit QR codes to instantly listen to audio narrations, watch video documentaries, and explore high-resolution archives.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-white text-museum-primary font-bold text-base hover:bg-museum-light shadow-lg active:scale-95 transition-all"
              >
                <QrCode className="w-6 h-6 text-museum-primary" />
                <span>Scan Artifact QR Code</span>
              </button>

              <Link
                to="/museum/gmu-heritage-museum"
                className="flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-xs transition-colors"
              >
                <Compass className="w-5 h-5" />
                <span>Browse GMU Museum</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="max-w-2xl mx-auto -mt-6 mb-12 relative z-20">
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

        {/* 3 Step Visitor Guide */}
        <div className="mb-14">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-museum-text mb-6 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-museum-border shadow-card flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-museum-light flex items-center justify-center text-museum-primary font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-museum-text">Find the QR Plaque</h3>
              <p className="text-xs sm:text-sm text-museum-muted leading-relaxed">
                Look for the printed guide code beside any physical display model or glass showcase.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-museum-border shadow-card flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-museum-light flex items-center justify-center text-museum-primary font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-museum-text">Scan With Your Phone</h3>
              <p className="text-xs sm:text-sm text-museum-muted leading-relaxed">
                Tap the big Scan button above or use your phone camera. No account or download required.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-museum-border shadow-card flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-museum-light flex items-center justify-center text-museum-primary font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-museum-text">Listen & Experience</h3>
              <p className="text-xs sm:text-sm text-museum-muted leading-relaxed">
                Immerse yourself with curated audio narrations, high-res galleries, and historical insights.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Museums List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-museum-text">
                Explore Digital Museums
              </h2>
              <p className="text-xs sm:text-sm text-museum-muted mt-1">
                Select a museum to view its galleries and curated exhibits
              </p>
            </div>
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
              <p className="text-xs text-museum-muted mt-1">
                Run the backend seed script to populate sample museum exhibits.
              </p>
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
                      <span>View Museum Galleries</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
