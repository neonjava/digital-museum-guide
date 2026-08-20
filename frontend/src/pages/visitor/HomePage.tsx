import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  Landmark,
  Compass,
  Headphones,
  MapPin,
  Clock,
  ChevronRight,
  Smartphone,
  Download,
  Share2,
  Bookmark,
  Check,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { QRScannerModal } from '../../components/visitor/QRScannerModal';
import { Museum, Artifact } from '../../types';
import { api } from '../../services/api';
import { isNativeApp } from '../../utils/platform';

// High quality initial museum data
const INITIAL_MUSEUMS: any[] = [
  {
    _id: 'm1',
    name: 'GM University Heritage Museum',
    slug: 'gmu-heritage-museum',
    description:
      'A premier university museum preserving historical technological marvels, ancient hydrodynamics, rare palm-leaf manuscripts, and classical Deccan arts.',
    logo: 'https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1600&q=80',
    address: {
      street: 'University Main Boulevard',
      city: 'Davangere',
      state: 'Karnataka',
      country: 'India',
      postalCode: '577006',
    },
    openingHours: 'Tue - Sun: 9:30 AM - 5:30 PM',
    isActive: true,
  },
  {
    _id: 'm2',
    name: 'National Museum, New Delhi',
    slug: 'national-museum-new-delhi',
    description:
      'One of the largest museums in India, holding over 200,000 works of art spanning prehistoric Harappan civilization through the modern era.',
    logo: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1600&q=80',
    address: {
      street: 'Janpath, Rajpath Area',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110011',
    },
    openingHours: 'Tue - Sun: 10:00 AM - 6:00 PM',
    isActive: true,
  },
  {
    _id: 'm3',
    name: 'National Rail Museum, New Delhi',
    slug: 'national-rail-museum',
    description:
      'Showcasing India’s rich 170-year railway heritage with 100+ life-sized exhibits, royal vintage saloons, and the 1855 Fairy Queen steam engine.',
    logo: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80',
    address: {
      street: 'Chanakyapuri, Shanti Path',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110021',
    },
    openingHours: 'Tue - Sun: 10:00 AM - 5:00 PM',
    isActive: true,
  },
  {
    _id: 'm4',
    name: 'Government Museum, Chennai (Egmore)',
    slug: 'government-museum-chennai',
    description:
      'Established in 1851, the second oldest museum in India, globally renowned for its collection of South Indian Bronzes and Amaravati sculptures.',
    logo: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1600&q=80',
    address: {
      street: 'Pantheon Road, Egmore',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      postalCode: '600008',
    },
    openingHours: 'Sat - Thu: 9:30 AM - 5:00 PM',
    isActive: true,
  },
  {
    _id: 'm5',
    name: 'National Science & Aerospace Museum',
    slug: 'national-science-aerospace',
    description:
      'Showcasing India’s pioneering aerospace achievements, rocket prototypes, robotic innovations, and quantum physics explorations.',
    logo: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=1600&q=80',
    address: {
      street: 'HAL Airport Road, Science City',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560017',
    },
    openingHours: 'Wed - Mon: 10:00 AM - 6:00 PM',
    isActive: true,
  },
  {
    _id: 'm6',
    name: 'Deccan Royal Arts & Cultural Heritage Museum',
    slug: 'deccan-royal-arts',
    description:
      'Preserving the grandeur of Vijayanagara, Bahmani, and Mysore royal arts, gilded weaponry, gold leaf miniature paintings, and silk textiles.',
    logo: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    address: {
      street: 'Palace Grounds, Heritage Complex',
      city: 'Mysuru',
      state: 'Karnataka',
      country: 'India',
      postalCode: '570001',
    },
    openingHours: 'Everyday: 9:00 AM - 5:30 PM',
    isActive: true,
  },
];

const INITIAL_ARTIFACTS: Partial<Artifact>[] = [
  {
    _id: 'a1',
    shortCode: 'art_8f29d2',
    name: 'Ancient Water Clock (Clepsydra / Ghati Yantra)',
    shortDescription: 'Precision hydrodynamic timekeeping device measuring 24-minute "Ghati" intervals.',
    datePeriod: 'c. 1020 CE (11th Century)',
    images: [{ url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', caption: 'Water clock mechanism', isCover: true }],
    audioNarration: { url: 'https://actions.google.com/sounds/v1/water/water_dripping_in_cave.ogg', title: 'Audio Guide', duration: 145 },
  },
  {
    _id: 'a2',
    shortCode: 'art_5d81c2',
    name: 'Chola Bronze Dancing Shiva (Nataraja)',
    shortDescription: 'Masterpiece lost-wax bronze casting representing the cosmic Anandatandava dance.',
    datePeriod: 'c. 1100 CE (12th Century)',
    images: [{ url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=600&q=80', caption: 'Nataraja bronze', isCover: true }],
    audioNarration: { url: 'https://actions.google.com/sounds/v1/foley/temple_bell.ogg', title: 'Audio Guide', duration: 160 },
  },
  {
    _id: 'a3',
    shortCode: 'art_3c7d19',
    name: 'The Fairy Queen Steam Locomotive (1855)',
    shortDescription: 'The oldest working steam locomotive in the world, certified by Guinness World Records.',
    datePeriod: '1855 CE (19th Century)',
    images: [{ url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80', caption: 'Fairy Queen engine', isCover: true }],
    audioNarration: { url: 'https://actions.google.com/sounds/v1/transportation/steam_train_horn.ogg', title: 'Audio Guide', duration: 130 },
  },
  {
    _id: 'a4',
    shortCode: 'art_9c3b1a',
    name: 'Rohini-75 Sounding Rocket Prototype',
    shortDescription: 'First indigenously fabricated single-stage sounding rocket launched from Thumba in 1967.',
    datePeriod: '1967 CE',
    images: [{ url: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=600&q=80', caption: 'RH-75 rocket', isCover: true }],
    audioNarration: { url: 'https://actions.google.com/sounds/v1/science/radar_screen.ogg', title: 'Audio Guide', duration: 150 },
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [museums, setMuseums] = useState<any[]>(INITIAL_MUSEUMS);
  const [featuredArtifacts, setFeaturedArtifacts] = useState<any[]>(INITIAL_ARTIFACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [savedMuseumIds, setSavedMuseumIds] = useState<string[]>([]);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const isNative = isNativeApp();

  useEffect(() => {
    const fetchLiveMuseums = async () => {
      try {
        const res = await api.get('/museums');
        if (res.success && res.data && res.data.length > 0) {
          setMuseums(res.data);
        }
      } catch (err) {
        console.warn('Using embedded museum directory data:', err);
      }
    };
    fetchLiveMuseums();
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

  const handleShare = (museum: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/museum/${museum.slug || museum._id}`;
    navigator.clipboard.writeText(url);
    setShareToast(`Copied: ${museum.name}`);
    setTimeout(() => setShareToast(null), 3000);
  };

  const getCategoryLabel = (slug: string = ''): string => {
    if (slug.includes('rail')) return 'Rail & Transport';
    if (slug.includes('aerospace') || slug.includes('science')) return 'Space & Science';
    if (slug.includes('royal') || slug.includes('deccan')) return 'Royal Regalia & Arts';
    if (slug.includes('chennai') || slug.includes('egmore')) return 'South Indian Bronzes';
    if (slug.includes('delhi') || slug.includes('national-museum')) return 'Art & Archaeology';
    return 'Ancient Technology & Heritage';
  };

  const filteredMuseums = museums.filter((museum) => {
    if (selectedCity !== 'ALL' && museum.address?.city !== selectedCity) {
      return false;
    }
    if (selectedCategory !== 'ALL') {
      const category = getCategoryLabel(museum.slug).toLowerCase();
      if (!category.includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }
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
    <div className="min-h-screen flex flex-col bg-[#FBFCFD] text-[#172033]">
      <Header />

      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-12">
        {/* Toast alert */}
        {shareToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#17365F] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{shareToast}</span>
          </div>
        )}

        {/* 1. Hero Showcase Banner */}
        <section
          style={{ backgroundColor: '#17365F' }}
          className="relative rounded-3xl overflow-hidden text-white shadow-xl border border-slate-700"
        >
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1800&q=80"
              alt="Museum background"
              className="w-full h-full object-cover opacity-25"
            />
            <div
              style={{
                background: 'linear-gradient(90deg, #17365F 0%, rgba(23, 54, 95, 0.95) 50%, rgba(33, 78, 134, 0.85) 100%)',
              }}
              className="absolute inset-0"
            />
          </div>

          <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 max-w-4xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold border border-white/20">
              <Landmark className="w-3.5 h-3.5 text-amber-300" />
              <span>{isNative ? 'Official Museum Mobile Companion' : 'National Digital Museum Guide'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
              Discover India's Cultural & Scientific Heritage
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal max-w-2xl">
              Explore thousands of artifacts, royal regalia, ancient manuscripts, and aerospace innovations across premier museums. Scan physical QR placards or experience voice-guided audio tours.
            </p>

            {/* Hero CTA buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#museum-directory"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-white text-[#214E86] font-bold text-sm sm:text-base hover:bg-slate-100 shadow-lg active:scale-95 transition-all"
              >
                <Compass className="w-5 h-5 text-[#214E86]" />
                <span>Explore Museums</span>
              </a>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base border border-white/40 active:scale-95 transition-all"
              >
                <QrCode className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>Scan Artifact QR</span>
              </button>

              {/* ONLY on Web, NEVER in native Android App */}
              {!isNative && (
                <a
                  href="/downloads/gmu-museum-guide.apk"
                  download="gmu-museum-guide.apk"
                  className="flex items-center justify-center space-x-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md active:scale-95 transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Android App</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* 2. Interactive Search & Directory */}
        <section id="museum-directory" className="space-y-6 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#214E86] block">
                Museum Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#172033]">
                Featured Museums in India
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Must-visit cultural, archaeological, and scientific institutions
              </p>
            </div>

            {/* City filter dropdown */}
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#214E86] shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-[#172033] focus:outline-none focus:border-[#214E86] shadow-sm"
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
            <form
              onSubmit={handleSearchSubmit}
              className="relative shadow-md rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden p-1.5 flex items-center"
            >
              <Search className="w-5 h-5 text-[#64748B] ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search museums, cities, or exhibits (e.g. 'National Museum', 'Water Clock', 'Rail Museum')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-[#172033] placeholder:text-[#64748B] focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#214E86] text-white text-xs font-bold hover:bg-[#17365F] transition-colors shrink-0"
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
                      ? 'bg-[#214E86] text-white shadow-sm'
                      : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#172033] hover:bg-[#EAF2FA]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Museum Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMuseums.map((museum) => {
              const isBookmarked = savedMuseumIds.includes(museum._id);
              const categoryBadge = getCategoryLabel(museum.slug);

              return (
                <Link
                  key={museum._id}
                  to={`/museum/${museum.slug || museum._id}`}
                  className="group rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Image Banner */}
                  <div className="relative h-56 bg-slate-900 overflow-hidden">
                    <img
                      src={
                        museum.coverImage ||
                        'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={museum.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                      }}
                      className="absolute inset-0"
                    />

                    {/* Category Tag on Top Left */}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#214E86]/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      {categoryBadge}
                    </span>

                    {/* Bookmark & Share Buttons on Top Right */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                      <button
                        onClick={(e) => toggleBookmark(museum._id, e)}
                        className={`p-2 rounded-xl transition-all ${
                          isBookmarked
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-black/60 hover:bg-black/80 text-white'
                        }`}
                        title="Save Museum"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={(e) => handleShare(museum, e)}
                        className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white transition-all"
                        title="Share Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Location Badge on Bottom of Image */}
                    {museum.address?.city && (
                      <div className="absolute bottom-3 left-4 right-4 text-white flex items-center space-x-1.5 text-xs drop-shadow-md font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span className="truncate">
                          {museum.address.city}, {museum.address.state}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#172033] group-hover:text-[#214E86] transition-colors line-clamp-2 leading-snug">
                        {museum.name}
                      </h3>

                      <p className="text-xs text-[#64748B] line-clamp-2 mt-2 leading-relaxed font-normal">
                        {museum.description}
                      </p>
                    </div>

                    {/* Bottom Details */}
                    <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
                      {museum.openingHours && (
                        <div className="flex items-center space-x-1.5 text-[11px] text-[#64748B]">
                          <Clock className="w-3 h-3 text-[#214E86] shrink-0" />
                          <span className="truncate">{museum.openingHours}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-bold text-[#214E86] pt-1">
                        <span>Explore Museum & Galleries</span>
                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. Popular Exhibits with Audio Narration */}
        <section className="space-y-6 pt-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#214E86] block">
              Audio Tour Highlights
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#172033]">
              Popular Exhibits with Voice Guides
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtifacts.map((art) => (
              <Link
                key={art._id}
                to={`/a/${art.shortCode}`}
                className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={art.images?.[0]?.url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80'}
                    alt={art.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {art.audioNarration?.url && (
                    <span className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold flex items-center space-x-1">
                      <Headphones className="w-3 h-3 text-amber-300" />
                      <span>Audio Guide</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#214E86] uppercase tracking-wider block">
                    {art.datePeriod || 'Historical Exhibit'}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#172033] group-hover:text-[#214E86] transition-colors line-clamp-1">
                    {art.name}
                  </h4>
                  <p className="text-[11px] text-[#64748B] line-clamp-2">
                    {art.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#214E86]">
                  <span>Listen Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Mobile Companion App Section (Only on Web, never inside the app) */}
        {!isNative && (
          <section
            style={{
              backgroundColor: '#17365F',
              background: 'linear-gradient(135deg, #17365F 0%, #214E86 100%)',
            }}
            className="rounded-3xl text-white p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700"
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 text-amber-300 flex items-center justify-center shrink-0">
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Official Visitor Companion App
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Download the Digital Museum Guide for Android
                </h3>
                <p className="text-xs sm:text-sm text-slate-100 max-w-xl leading-relaxed font-normal">
                  Scan physical QR plaques beside glass cases, listen to curated audio guides, and explore high-res artifacts offline.
                </p>
              </div>
            </div>

            <a
              href="/downloads/gmu-museum-guide.apk"
              download="gmu-museum-guide.apk"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2.5 px-6 py-4 rounded-2xl bg-white text-[#214E86] font-bold hover:bg-slate-100 shadow-lg active:scale-95 transition-all text-sm"
            >
              <Download className="w-5 h-5 text-[#214E86]" />
              <span>Download APK (15 MB)</span>
            </a>
          </section>
        )}

        {/* Native Android App Visitor Companion Banner (Shown only inside the Android App) */}
        {isNative && (
          <section
            style={{
              backgroundColor: '#17365F',
              background: 'linear-gradient(135deg, #17365F 0%, #214E86 100%)',
            }}
            className="rounded-3xl text-white p-6 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700"
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 text-amber-300 flex items-center justify-center shrink-0">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Interactive Museum Visitor Scanner
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Scan Physical Exhibit Placards
                </h3>
                <p className="text-xs sm:text-sm text-slate-100 max-w-xl leading-relaxed font-normal">
                  Aim your camera at any exhibit QR code to immediately unlock its audio narration, videos, and historical stories.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2.5 px-6 py-4 rounded-2xl bg-white text-[#214E86] font-bold hover:bg-slate-100 shadow-lg active:scale-95 transition-all text-sm"
            >
              <QrCode className="w-5 h-5 text-[#214E86]" />
              <span>Launch Camera Scanner</span>
            </button>
          </section>
        )}
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
