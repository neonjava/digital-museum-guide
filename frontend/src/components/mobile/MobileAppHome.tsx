import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  Landmark,
  Headphones,
  Compass,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Bookmark,
  Play,
  Volume2,
  Share2,
} from 'lucide-react';
import { QRScannerModal } from '../visitor/QRScannerModal';
import { api } from '../../services/api';

const FEATURED_AUDIO_EXHIBITS = [
  {
    shortCode: 'art_8f29d2',
    name: 'Ancient Water Clock (Ghati Yantra)',
    museum: 'GM University Heritage Museum',
    duration: '2:25 min',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    category: 'Ancient Tech',
  },
  {
    shortCode: 'art_5d81c2',
    name: 'Chola Bronze Dancing Shiva (Nataraja)',
    museum: 'Government Museum, Chennai',
    duration: '2:40 min',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=600&q=80',
    category: 'Bronzes',
  },
  {
    shortCode: 'art_3c7d19',
    name: 'Fairy Queen Steam Locomotive (1855)',
    museum: 'National Rail Museum, Delhi',
    duration: '2:10 min',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80',
    category: 'Rail Heritage',
  },
  {
    shortCode: 'art_9c3b1a',
    name: 'Rohini-75 Sounding Rocket Prototype',
    museum: 'Science & Aerospace Museum',
    duration: '2:30 min',
    image: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=600&q=80',
    category: 'Space & Rocketry',
  },
];

const SEEDED_MUSEUMS = [
  {
    id: 'm1',
    slug: 'gmu-heritage-museum',
    name: 'GM University Heritage Museum',
    city: 'Davangere, Karnataka',
    image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80',
    galleries: '4 Galleries • 8 Exhibits',
  },
  {
    id: 'm2',
    slug: 'national-museum-new-delhi',
    name: 'National Museum, New Delhi',
    city: 'Janpath, New Delhi',
    image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
    galleries: '2 Galleries • Harappan Relics',
  },
  {
    id: 'm3',
    slug: 'national-rail-museum',
    name: 'National Rail Museum',
    city: 'Chanakyapuri, New Delhi',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    galleries: 'Outdoor Yards • Royal Saloons',
  },
  {
    id: 'm4',
    slug: 'government-museum-chennai',
    name: 'Government Museum (Egmore)',
    city: 'Egmore, Chennai',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
    galleries: 'Chola Bronzes & Amaravati Art',
  },
];

export const MobileAppHome: React.FC = () => {
  const navigate = useNavigate();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] pb-24 text-[#172033]">
      {/* 1. Sleek Mobile App Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 pt-3 pb-3 border-b border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#214E86] text-white flex items-center justify-center shadow-md">
              <Landmark className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-[#214E86] tracking-widest block">
                Visitor Audio Companion
              </span>
              <h1 className="text-base font-bold text-[#172033] leading-tight">
                Digital Museum Guide
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => navigate('/search')}
              aria-label="Search"
              className="p-2.5 rounded-xl text-[#64748B] hover:text-[#214E86] hover:bg-[#EAF2FA] active:scale-95 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Central Glowing QR Scanner Hero Card */}
        <div
          style={{
            backgroundColor: '#17365F',
            background: 'linear-gradient(135deg, #17365F 0%, #214E86 100%)',
          }}
          className="rounded-3xl p-6 text-white shadow-xl border border-slate-700 relative overflow-hidden"
        >
          {/* Subtle background icon glow */}
          <QrCode className="w-48 h-48 absolute -right-10 -bottom-10 text-white/5 pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Smart Exhibit Camera</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-extrabold text-white leading-tight">
                Scan Artifact Placard
              </h2>
              <p className="text-xs text-slate-100 font-normal leading-relaxed">
                Point your phone camera at any physical QR code in the gallery to unlock the audio story, videos, and history.
              </p>
            </div>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full py-4 rounded-2xl bg-white text-[#214E86] font-bold text-sm shadow-xl flex items-center justify-center space-x-2.5 active:scale-98 transition-transform"
            >
              <QrCode className="w-5 h-5 text-[#214E86] animate-pulse" />
              <span>Launch Camera Scanner</span>
            </button>
          </div>
        </div>

        {/* Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exhibits, stories, or galleries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#172033] shadow-xs focus:outline-none focus:border-[#214E86]"
          />
        </form>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Exhibits' },
            { id: 'Tech', label: 'Ancient Tech' },
            { id: 'Bronze', label: 'Chola Bronzes' },
            { id: 'Rail', label: 'Rail Heritage' },
            { id: 'Space', label: 'Rocketry' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === cat.id
                  ? 'bg-[#214E86] text-white shadow-sm'
                  : 'bg-white border border-[#CBD5E1] text-[#64748B] active:bg-[#EAF2FA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Audio Tour Highlights Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Headphones className="w-4 h-4 text-[#214E86]" />
              <h3 className="font-serif font-bold text-base text-[#172033]">
                Popular Voice Stories
              </h3>
            </div>
            <Link to="/search?filter=audio" className="text-xs font-bold text-[#214E86]">
              See All
            </Link>
          </div>

          {/* Horizontal scroll cards */}
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-none">
            {FEATURED_AUDIO_EXHIBITS.map((item) => (
              <Link
                key={item.shortCode}
                to={`/a/${item.shortCode}`}
                className="w-64 shrink-0 rounded-3xl bg-white border border-[#CBD5E1] shadow-md p-3.5 flex flex-col justify-between space-y-3 active:scale-98 transition-transform"
              >
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    }}
                    className="absolute inset-0"
                  />

                  {/* Duration Pill */}
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold flex items-center space-x-1">
                    <Volume2 className="w-3 h-3 text-amber-300" />
                    <span>{item.duration}</span>
                  </span>

                  {/* Play circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#214E86] flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#214E86] uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-xs text-[#172033] line-clamp-1 mt-0.5">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                    {item.museum}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Museums List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Landmark className="w-4 h-4 text-[#214E86]" />
              <h3 className="font-serif font-bold text-base text-[#172033]">
                Museums in India
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {SEEDED_MUSEUMS.map((museum) => (
              <Link
                key={museum.id}
                to={`/museum/${museum.slug}`}
                className="rounded-3xl bg-white border border-[#CBD5E1] shadow-sm p-3.5 flex items-center space-x-3.5 active:scale-98 transition-transform"
              >
                <img
                  src={museum.image}
                  alt={museum.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-xs"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-[#64748B] flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-[#214E86] shrink-0" />
                    <span className="truncate">{museum.city}</span>
                  </span>
                  <h4 className="font-bold text-sm text-[#172033] line-clamp-1 mt-0.5">
                    {museum.name}
                  </h4>
                  <p className="text-[11px] text-[#214E86] font-medium mt-1">
                    {museum.galleries}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-[#64748B] shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Fixed Native Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] px-4 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        <Link
          to="/"
          className="flex flex-col items-center space-y-1 text-[#214E86] font-bold"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </Link>

        <Link
          to="/search"
          className="flex flex-col items-center space-y-1 text-[#64748B] hover:text-[#214E86]"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Search</span>
        </Link>

        {/* Floating Center Scan Button */}
        <button
          onClick={() => setIsScannerOpen(true)}
          className="-mt-6 w-14 h-14 rounded-full bg-[#214E86] text-white flex items-center justify-center shadow-2xl border-4 border-white active:scale-95 transition-transform"
          aria-label="Scan QR Code"
        >
          <QrCode className="w-6 h-6 text-amber-300 animate-pulse" />
        </button>

        <Link
          to="/museum/gmu-heritage-museum"
          className="flex flex-col items-center space-y-1 text-[#64748B] hover:text-[#214E86]"
        >
          <Landmark className="w-5 h-5" />
          <span className="text-[10px]">Galleries</span>
        </Link>

        <button
          onClick={() => navigate('/search?filter=audio')}
          className="flex flex-col items-center space-y-1 text-[#64748B] hover:text-[#214E86]"
        >
          <Headphones className="w-5 h-5" />
          <span className="text-[10px]">Audio</span>
        </button>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
