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
  Share2,
  Bookmark,
  Check,
  Filter,
  CheckCircle2,
  Layers,
  Calendar,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { QRScannerModal } from '../../components/visitor/QRScannerModal';
import { QRPrintCardModal } from '../../components/admin/QRPrintCardModal';
import { Museum, Artifact } from '../../types';
import { api } from '../../services/api';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [featuredArtifacts, setFeaturedArtifacts] = useState<Artifact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedMuseumIds, setSavedMuseumIds] = useState<string[]>([]);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Selected exhibit for quick QR preview modal
  const [selectedArtifactForQR, setSelectedArtifactForQR] = useState<Artifact | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [museumsRes, artifactsRes] = await Promise.all([
          api.get('/museums'),
          api.get('/artifacts?limit=8'),
        ]);

        if (museumsRes.success && museumsRes.data) {
          setMuseums(museumsRes.data);
        }
        if (artifactsRes.success && artifactsRes.data) {
          setFeaturedArtifacts(artifactsRes.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedMuseumIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShare = (museum: Museum, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/museum/${museum.slug || museum._id}`;
    navigator.clipboard.writeText(url);
    setShareToast(`Link copied: ${museum.name}`);
    setTimeout(() => setShareToast(null), 3000);
  };

  // Categories helper mapping
  const getCategoryLabel = (slug: string): string => {
    if (slug.includes('rail')) return 'Transport & Heritage';
    if (slug.includes('aerospace') || slug.includes('science')) return 'Space & Science';
    if (slug.includes('royal') || slug.includes('deccan')) return 'Royal Regalia & Arts';
    if (slug.includes('chennai') || slug.includes('egmore')) return 'South Indian Bronzes';
    if (slug.includes('delhi') || slug.includes('national-museum')) return 'Art & Archaeology';
    return 'Ancient Technology & Heritage';
  };

  // Filter museums by Category & City
  const filteredMuseums = museums.filter((museum) => {
    // City filter
    if (selectedCity !== 'ALL' && museum.address?.city !== selectedCity) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      const category = getCategoryLabel(museum.slug).toLowerCase();
      if (!category.includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }

    // Keyword search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = museum.name.toLowerCase();
      const desc = museum.description?.toLowerCase() || '';
      const city = museum.address?.city?.toLowerCase() || '';
      return name.includes(q) || desc.includes(q) || city.includes(q);
    }

    return true;
  });

  const uniqueCities = Array.from(
    new Set(museums.map((m) => m.address?.city).filter(Boolean))
  ) as string[];

  return (
    <div className="min-h-screen flex flex-col bg-museum-bg text-museum-text selection:bg-museum-light selection:text-museum-primary">
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-12">
        {/* Toast alert */}
        {shareToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-museum-dark text-white px-5 py-3 rounded-2xl shadow-elevated text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{shareToast}</span>
          </div>
        )}

        {/* 1. Hero Showcase Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-elevated border border-museum-border">
          {/* Background image with deep blue vignette */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1800&q=80"
              alt="Museum Heritage"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-linear-to-r from-museum-dark via-museum-dark/90 to-museum-primary/80" />
          </div>

          <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 max-w-3xl space-y-5 text-white">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 text-museum-light text-xs font-semibold backdrop-blur-xs border border-white/15">
              <Landmark className="w-3.5 h-3.5" />
              <span>Digital Museum QR Guide Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
              Discover India's Cultural & Scientific Heritage
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Explore thousands of artifacts, royal regalia, ancient manuscripts, and aerospace innovations across premier museums. Scan physical QR placards or experience voice-guided audio tours online.
            </p>

            {/* Hero CTA buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#museum-directory"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-white text-museum-primary font-bold text-sm sm:text-base hover:bg-museum-light shadow-lg active:scale-95 transition-all"
              >
                <Compass className="w-5 h-5 text-museum-primary" />
                <span>Explore Museums</span>
              </a>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center justify-center space-x-2 px-5 py-3.5 rounded-2xl bg-museum-light/20 hover:bg-museum-light/30 text-white font-bold text-sm sm:text-base border border-white/25 backdrop-blur-xs active:scale-95 transition-all"
              >
                <QrCode className="w-5 h-5 text-museum-light" />
                <span>Scan Artifact QR</span>
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
        </section>

        {/* 2. Interactive Search & Location Filters */}
        <section id="museum-directory" className="space-y-6 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-museum-primary block">
                Museum Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-museum-text">
                Featured Museums in India
              </h2>
              <p className="text-xs sm:text-sm text-museum-muted mt-1">
                Must-visit cultural, archaeological, and scientific institutions
              </p>
            </div>

            {/* City filter dropdown */}
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-museum-primary shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white border border-museum-border text-xs font-semibold text-museum-text focus:outline-hidden focus:border-museum-primary shadow-xs"
              >
                <option value="ALL">All Cities & Regions</option>
                {uniqueCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search bar & Category filter pills */}
          <div className="space-y-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative shadow-card rounded-2xl bg-white border border-museum-border overflow-hidden p-1.5 flex items-center">
              <Search className="w-5 h-5 text-museum-muted ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search museums, cities, or exhibits (e.g. 'National Museum', 'Water Clock', 'Rail Museum')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-museum-text placeholder:text-museum-muted focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-museum-primary text-white text-xs font-bold hover:bg-museum-hover transition-colors shrink-0"
              >
                Search
              </button>
            </form>

            {/* Category Pills Bar */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin pt-1">
              {[
                { id: 'ALL', label: 'All Museums' },
                { id: 'Ancient', label: 'Ancient Technology' },
                { id: 'Art', label: 'Art & Archaeology' },
                { id: 'Transport', label: 'Rail & Transport' },
                { id: 'Bronze', label: 'South Indian Bronzes' },
                { id: 'Space', label: 'Aerospace & Science' },
                { id: 'Royal', label: 'Royal Arms & Regalia' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-museum-primary text-white shadow-xs'
                      : 'bg-white border border-museum-border text-museum-muted hover:text-museum-text hover:bg-museum-light/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Museum Cards Grid (Inspired by museumsinindia.in) */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : filteredMuseums.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-museum-border">
              <Landmark className="w-12 h-12 text-museum-muted mx-auto mb-3" />
              <h3 className="font-bold text-museum-text text-base">No museums match your criteria</h3>
              <p className="text-xs text-museum-muted mt-1">
                Try resetting your city or category filters to explore all institutions.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedCity('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-museum-light text-museum-primary font-bold text-xs hover:bg-museum-primary hover:text-white transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMuseums.map((museum) => {
                const isBookmarked = savedMuseumIds.includes(museum._id);
                const categoryBadge = getCategoryLabel(museum.slug);

                return (
                  <Link
                    key={museum._id}
                    to={`/museum/${museum.slug || museum._id}`}
                    className="group rounded-3xl bg-white border border-museum-border shadow-card hover:shadow-elevated transition-all overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top Image Banner */}
                    <div className="relative h-52 bg-slate-900 overflow-hidden">
                      <img
                        src={
                          museum.coverImage ||
                          'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={museum.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Category Tag on Top Left */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-museum-primary/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs">
                        {categoryBadge}
                      </span>

                      {/* Bookmark & Share Buttons on Top Right */}
                      <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                        <button
                          onClick={(e) => toggleBookmark(museum._id, e)}
                          className={`p-2 rounded-xl backdrop-blur-xs transition-all ${
                            isBookmarked
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-black/50 hover:bg-black/75 text-white'
                          }`}
                          title="Save Museum"
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <button
                          onClick={(e) => handleShare(museum, e)}
                          className="p-2 rounded-xl bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs transition-all"
                          title="Share Link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Location Badge on Bottom of Image */}
                      {museum.address?.city && (
                        <div className="absolute bottom-3 left-4 right-4 text-white flex items-center space-x-1.5 text-xs drop-shadow-md">
                          <MapPin className="w-3.5 h-3.5 text-museum-light shrink-0" />
                          <span className="truncate">
                            {museum.address.city}, {museum.address.state}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-museum-text group-hover:text-museum-primary transition-colors line-clamp-2 leading-snug">
                          {museum.name}
                        </h3>

                        <p className="text-xs text-museum-muted line-clamp-2 mt-2 leading-relaxed font-normal">
                          {museum.description}
                        </p>
                      </div>

                      {/* Bottom Details */}
                      <div className="pt-3 border-t border-museum-border/60 space-y-2">
                        {museum.openingHours && (
                          <div className="flex items-center space-x-1.5 text-[11px] text-museum-muted">
                            <Clock className="w-3 h-3 text-museum-primary shrink-0" />
                            <span className="truncate">{museum.openingHours}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs font-bold text-museum-primary pt-1">
                          <span>Explore Museum & Galleries</span>
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. Popular Exhibits with Audio Narration */}
        {featuredArtifacts.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-museum-primary block">
                  Audio Tour Highlights
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-museum-text">
                  Popular Exhibits with Voice Guides
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredArtifacts.slice(0, 4).map((art) => (
                <Link
                  key={art._id}
                  to={`/a/${art.shortCode}`}
                  className="p-4 rounded-3xl bg-white border border-museum-border shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900">
                    <img
                      src={art.images?.[0]?.url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80'}
                      alt={art.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {art.audioNarration?.url && (
                      <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-museum-light text-[10px] font-bold flex items-center space-x-1">
                        <Headphones className="w-3 h-3" />
                        <span>Audio Guide</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-museum-primary uppercase tracking-wider block">
                      {art.datePeriod || 'Historical Exhibit'}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-museum-text group-hover:text-museum-primary transition-colors line-clamp-1">
                      {art.name}
                    </h4>
                    <p className="text-[11px] text-museum-muted line-clamp-2">
                      {art.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-museum-border/40 flex items-center justify-between text-xs font-semibold text-museum-primary">
                    <span>Listen Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 5. Mobile App Banner */}
        <section className="rounded-3xl bg-linear-to-r from-museum-dark via-museum-primary to-museum-hover text-white p-6 sm:p-10 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-museum-light flex items-center justify-center shrink-0">
              <Smartphone className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-museum-light uppercase tracking-wider block">
                Official Visitor Companion App
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Download the Digital Museum Guide for Android
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                Scan physical QR plaques beside glass cases, listen to curated audio guides, and explore high-res artifacts offline.
              </p>
            </div>
          </div>

          <a
            href="/downloads/gmu-museum-guide.apk"
            download="gmu-museum-guide.apk"
            className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2.5 px-6 py-4 rounded-2xl bg-white text-museum-primary font-bold hover:bg-museum-light shadow-lg active:scale-95 transition-all text-sm"
          >
            <Download className="w-5 h-5 text-museum-primary" />
            <span>Download APK (15 MB)</span>
          </a>
        </section>
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
