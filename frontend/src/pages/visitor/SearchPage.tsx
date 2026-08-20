import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Landmark,
  ArrowRight,
  Headphones,
  Film,
  Sparkles,
  ChevronLeft,
  Filter,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Artifact, Museum } from '../../types';
import { api } from '../../services/api';
import { isNativeApp } from '../../utils/platform';

const SEEDED_SEARCH_DATA: any[] = [
  {
    _id: 'a1',
    shortCode: 'art_8f29d2',
    name: 'Ancient Water Clock (Ghati Yantra / Clepsydra)',
    datePeriod: 'c. 1020 CE (11th Century)',
    museum: 'GM University Heritage Museum',
    gallery: 'Ancient Technology & Engineering',
    locationInsideMuseum: 'Gallery 2 (Ancient Tech), Stand 14',
    shortDescription: 'Precision hydrodynamic timekeeping device measuring 24-minute "Ghati" intervals.',
    images: [{ url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' }],
    hasAudio: true,
    hasVideo: true,
  },
  {
    _id: 'a2',
    shortCode: 'art_a4f10e',
    name: '12th-Century Palm Leaf Astronomical Folio',
    datePeriod: 'c. 1150 CE (12th Century)',
    museum: 'GM University Heritage Museum',
    gallery: 'Astronomy & Rare Manuscripts',
    locationInsideMuseum: 'Manuscripts Vault, Case 3',
    shortDescription: 'Rare Sanskrit treatise on planetary orbits and lunar eclipse calculations.',
    images: [{ url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80' }],
    hasAudio: true,
    hasVideo: false,
  },
  {
    _id: 'a3',
    shortCode: 'art_7e20b4',
    name: 'Rare Chalukyan Celestial Brass Astrolabe',
    datePeriod: 'c. 1280 CE (13th Century)',
    museum: 'GM University Heritage Museum',
    gallery: 'Astronomy & Rare Manuscripts',
    locationInsideMuseum: 'Astronomy Gallery, Stand 7',
    shortDescription: 'Precision brass astrolabe with engraved nakshatras for nighttime navigation.',
    images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' }],
    hasAudio: true,
    hasVideo: true,
  },
  {
    _id: 'a4',
    shortCode: 'art_2f90a1',
    name: 'Mohenjo-daro Bronze Dancing Girl',
    datePeriod: 'c. 2300 BCE (Bronze Age)',
    museum: 'National Museum, New Delhi',
    gallery: 'Indus Valley Civilization Gallery',
    locationInsideMuseum: 'Central Rotunda, Case 1',
    shortDescription: 'World-famous lost-wax bronze statuette symbolizing prehistoric Harappan artistry.',
    images: [{ url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80' }],
    hasAudio: true,
    hasVideo: true,
  },
  {
    _id: 'a5',
    shortCode: 'art_3c7d19',
    name: 'The Fairy Queen Steam Locomotive (1855)',
    datePeriod: '1855 CE (19th Century)',
    museum: 'National Rail Museum, New Delhi',
    gallery: 'Vintage Steam Locomotives',
    locationInsideMuseum: 'Track 1, Heritage Yard',
    shortDescription: 'Guinness World Record certified oldest operational steam locomotive in the world.',
    images: [{ url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80' }],
    hasAudio: true,
    hasVideo: true,
  },
  {
    _id: 'a6',
    shortCode: 'art_5d81c2',
    name: 'Chola Bronze Dancing Shiva (Nataraja)',
    datePeriod: 'c. 1100 CE (12th Century)',
    museum: 'Government Museum, Chennai (Egmore)',
    gallery: 'Pallava & Chola Bronze Gallery',
    locationInsideMuseum: 'Bronze Gallery, Center Plinth',
    shortDescription: 'Priceless lost-wax sculpture representing the cosmic Anandatandava dance cycle.',
    images: [{ url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=600&q=80' }],
    hasAudio: true,
    hasVideo: true,
  },
  {
    _id: 'a7',
    shortCode: 'art_9c3b1a',
    name: 'Rohini-75 Sounding Rocket Prototype',
    datePeriod: '1967 CE',
    museum: 'National Science & Aerospace Museum',
    gallery: 'Space Exploration & Rocketry',
    locationInsideMuseum: 'Launch Hall, Tower Alpha',
    shortDescription: 'India’s first indigenously fabricated sounding rocket launched from Thumba.',
    images: [{ url: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=600&q=80' }],
    hasAudio: true,
    hasVideo: true,
  },
  {
    _id: 'a8',
    shortCode: 'art_1a7f3e',
    name: 'Mysore Tiger-Hilt Damascene Wootz Talwar',
    datePeriod: 'c. 1790 CE (18th Century)',
    museum: 'Deccan Royal Arts & Cultural Heritage Museum',
    gallery: 'Imperial Arms & Royal Metallurgy',
    locationInsideMuseum: 'Armory Hall, Glass Stand 8',
    shortDescription: 'Hand-forged crucible Wootz steel blade with gold-damascened calligraphy.',
    images: [{ url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80' }],
    hasAudio: true,
    hasVideo: true,
  },
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const initialFilter = searchParams.get('filter') || 'ALL';
  const isNative = isNativeApp();

  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [results, setResults] = useState<any[]>(SEEDED_SEARCH_DATA);
  const [loading, setLoading] = useState(false);

  const performSearch = async (searchTerm: string, filter: string) => {
    try {
      setLoading(true);
      let list = SEEDED_SEARCH_DATA;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        list = list.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.shortDescription.toLowerCase().includes(q) ||
            item.museum.toLowerCase().includes(q) ||
            item.gallery.toLowerCase().includes(q)
        );
      }

      if (filter === 'audio') {
        list = list.filter((item) => item.hasAudio);
      } else if (filter === 'video') {
        list = list.filter((item) => item.hasVideo);
      }

      setResults(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(query, activeFilter);
  }, [query, activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query, filter: activeFilter });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFCFD] text-[#172033]">
      {!isNative ? (
        <Header />
      ) : (
        /* Mobile App Consistent Top Header */
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-xl text-[#214E86] active:bg-[#EAF2FA]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-[#214E86] text-white flex items-center justify-center">
                <Landmark className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-serif font-bold text-sm text-[#172033]">
                Exhibit Directory
              </span>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#172033]">
            {activeFilter === 'audio' ? 'Audio Tour Guides' : 'Search Museum Exhibits'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Browse artifacts, audio guides, video demonstrations, and gallery collections
          </p>
        </div>

        {/* Search input form */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center shadow-sm rounded-2xl bg-white border border-[#CBD5E1] overflow-hidden p-1.5"
        >
          <Search className="w-5 h-5 text-[#64748B] ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Search exhibits (e.g. 'water clock', 'locomotive', 'bronze', 'rocket')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2.5 text-sm sm:text-base text-[#172033] placeholder:text-[#64748B] focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#214E86] text-white text-xs sm:text-sm font-bold hover:bg-[#17365F] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All 8 Exhibits' },
            { id: 'audio', label: '🎙️ Voice Stories (Audio)' },
            { id: 'video', label: '🎬 Video Demonstrations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                setSearchParams({ q: query, filter: tab.id });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#214E86] text-white shadow-sm'
                  : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#172033]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {results.map((artifact) => {
            const cover =
              artifact.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80';

            return (
              <Link
                key={artifact.shortCode || artifact._id}
                to={`/a/${artifact.shortCode}`}
                className="rounded-3xl bg-white border border-[#CBD5E1] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group p-4 space-y-3"
              >
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={cover}
                    alt={artifact.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    {artifact.hasAudio && (
                      <span className="p-1.5 rounded-lg bg-black/70 text-amber-300">
                        <Headphones className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {artifact.hasVideo && (
                      <span className="p-1.5 rounded-lg bg-black/70 text-emerald-300">
                        <Film className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#214E86] uppercase tracking-wider block truncate">
                    {artifact.museum}
                  </span>
                  <h3 className="font-serif font-bold text-sm text-[#172033] group-hover:text-[#214E86] transition-colors line-clamp-2 leading-snug">
                    {artifact.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B] line-clamp-2 mt-1">
                    {artifact.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#214E86]">
                  <span>Explore Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {!isNative && <Footer />}
    </div>
  );
};
