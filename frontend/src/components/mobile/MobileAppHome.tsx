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
    <div className="space-y-6 px-4 py-4">
      {/* Central Glowing QR Scanner Hero Card */}
      <div
        style={{
          backgroundColor: '#17365F',
          background: 'linear-gradient(135deg, #17365F 0%, #214E86 100%)',
        }}
        className="rounded-3xl p-6 text-white shadow-xl border border-slate-700 relative overflow-hidden"
      >
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
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#172033] shadow-sm placeholder:text-[#64748B] focus:outline-none focus:border-[#214E86]"
        />
      </form>

      {/* Audio Stories Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Headphones className="w-4 h-4 text-[#214E86]" />
            <h3 className="font-serif font-bold text-base text-[#172033]">
              Featured Audio Tours
            </h3>
          </div>
          <Link
            to="/search?filter=audio"
            className="text-xs font-bold text-[#214E86] flex items-center space-x-0.5 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex space-x-3.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {FEATURED_AUDIO_EXHIBITS.map((item) => (
            <Link
              key={item.shortCode}
              to={`/a/${item.shortCode}`}
              className="w-48 shrink-0 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm overflow-hidden flex flex-col justify-between p-3 space-y-2.5 active:scale-98 transition-transform"
            >
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[9px] font-bold text-amber-300 backdrop-blur-xs flex items-center space-x-1">
                  <Headphones className="w-2.5 h-2.5" />
                  <span>{item.duration}</span>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#214E86] block truncate">
                  {item.museum}
                </span>
                <h4 className="font-bold text-xs text-[#172033] line-clamp-2 leading-snug">
                  {item.name}
                </h4>
              </div>

              <div className="pt-1.5 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-bold text-[#214E86]">
                <span>Listen Audio</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Museums List */}
      <div className="space-y-3 pt-1">
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

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
