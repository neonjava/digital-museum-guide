import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Landmark,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Layers,
  ChevronRight,
  QrCode,
  Search,
  Sparkles,
  Headphones,
  Film,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { QRScannerModal } from '../../components/visitor/QRScannerModal';
import { Museum, Section, Artifact } from '../../types';
import { api } from '../../services/api';
import { isNativeApp } from '../../utils/platform';

// Complete museum database with direct exhibits
const MUSEUM_RECORDS: Record<
  string,
  {
    museum: Partial<Museum>;
    sections: Array<{ _id: string; name: string }>;
    artifacts: any[];
  }
> = {
  'gmu-heritage-museum': {
    museum: {
      name: 'GM University Heritage Museum',
      slug: 'gmu-heritage-museum',
      description:
        'A premier university museum preserving historical technological marvels, ancient hydrodynamics, rare palm-leaf manuscripts, and classical Deccan arts.',
      coverImage: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'University Main Boulevard, Heritage Campus',
        city: 'Davangere',
        state: 'Karnataka',
        country: 'India',
        postalCode: '577006',
      },
      openingHours: 'Tuesday - Sunday: 9:30 AM - 5:30 PM (Closed Mondays)',
      website: 'https://gmu.edu.in/heritage-museum',
    },
    sections: [
      { _id: 'sec_gmu_1', name: 'Ancient Technology & Engineering' },
      { _id: 'sec_gmu_2', name: 'Astronomy & Rare Manuscripts' },
      { _id: 'sec_gmu_3', name: 'Classical Sculptures & Metallurgy' },
    ],
    artifacts: [
      {
        shortCode: 'art_8f29d2',
        name: 'Ancient Water Clock (Ghati Yantra / Clepsydra)',
        sectionName: 'Ancient Technology & Engineering',
        datePeriod: 'c. 1020 CE (11th Century)',
        location: 'Gallery 2, Stand 14',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        description: 'A precision hydrodynamic timekeeping device used in ancient observatories to measure 24-minute "Ghati" intervals.',
        hasAudio: true,
        hasVideo: true,
      },
      {
        shortCode: 'art_a4f10e',
        name: '12th-Century Palm Leaf Astronomical Folio',
        sectionName: 'Astronomy & Rare Manuscripts',
        datePeriod: 'c. 1150 CE (12th Century)',
        location: 'Manuscripts Vault, Case 3',
        image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
        description: 'Rare Sanskrit treatise written in Grantha script containing mathematical equations for calculating lunar eclipses.',
        hasAudio: true,
        hasVideo: false,
      },
      {
        shortCode: 'art_7e20b4',
        name: 'Rare Chalukyan Celestial Brass Astrolabe',
        sectionName: 'Astronomy & Rare Manuscripts',
        datePeriod: 'c. 1280 CE (13th Century)',
        location: 'Astronomy Gallery, Stand 7',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        description: 'Engraved brass navigation astrolabe measuring altitude of celestial bodies and calculating local solar time.',
        hasAudio: true,
        hasVideo: true,
      },
    ],
  },
  'national-museum-new-delhi': {
    museum: {
      name: 'National Museum, New Delhi',
      slug: 'national-museum-new-delhi',
      description:
        'One of the largest museums in India, holding over 200,000 works of art spanning prehistoric Harappan civilization through the modern era.',
      coverImage: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Janpath, Rajpath Area',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110011',
      },
      openingHours: 'Tuesday - Sunday: 10:00 AM - 6:00 PM (Closed Mondays)',
      website: 'http://nationalmuseumindia.gov.in',
    },
    sections: [{ _id: 'sec_delhi_1', name: 'Indus Valley Civilization Gallery' }],
    artifacts: [
      {
        shortCode: 'art_2f90a1',
        name: 'Mohenjo-daro Bronze Dancing Girl',
        sectionName: 'Indus Valley Civilization Gallery',
        datePeriod: 'c. 2300 BCE (Bronze Age)',
        location: 'Central Rotunda, Case 1',
        image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80',
        description: 'World-famous lost-wax bronze statuette symbolizing prehistoric Harappan artistry and metallurgy.',
        hasAudio: true,
        hasVideo: true,
      },
    ],
  },
  'national-rail-museum': {
    museum: {
      name: 'National Rail Museum, New Delhi',
      slug: 'national-rail-museum',
      description:
        "Preserving India's rich 170-year railway heritage with 100+ life-sized exhibits, royal vintage saloons, and working locomotive models.",
      coverImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Chanakyapuri',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110021',
      },
      openingHours: 'Tuesday - Sunday: 10:00 AM - 5:00 PM (Closed Mondays)',
      website: 'https://nrmindia.org',
    },
    sections: [{ _id: 'sec_rail_1', name: 'Vintage Steam Locomotives & Royal Saloons' }],
    artifacts: [
      {
        shortCode: 'art_3c7d19',
        name: 'The Fairy Queen Steam Locomotive (1855)',
        sectionName: 'Vintage Steam Locomotives & Royal Saloons',
        datePeriod: '1855 CE (19th Century)',
        location: 'Track 1, Heritage Yard',
        image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80',
        description: 'The oldest operational steam locomotive in the world, certified by Guinness World Records.',
        hasAudio: true,
        hasVideo: true,
      },
    ],
  },
  'government-museum-chennai': {
    museum: {
      name: 'Government Museum, Chennai (Egmore)',
      slug: 'government-museum-chennai',
      description:
        'Established in 1851, the second oldest museum in India, globally renowned for its priceless collection of South Indian Bronzes.',
      coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Pantheon Road, Egmore',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        postalCode: '600008',
      },
      openingHours: 'Saturday - Thursday: 9:30 AM - 5:00 PM (Closed Fridays)',
      website: 'http://govtmuseumchennai.org',
    },
    sections: [{ _id: 'sec_egmore_1', name: 'Pallava & Chola Bronze Gallery' }],
    artifacts: [
      {
        shortCode: 'art_5d81c2',
        name: 'Chola Bronze Dancing Shiva (Nataraja)',
        sectionName: 'Pallava & Chola Bronze Gallery',
        datePeriod: 'c. 1100 CE (12th Century)',
        location: 'Bronze Gallery, Center Plinth',
        image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=600&q=80',
        description: 'Masterpiece lost-wax bronze casting representing the cosmic Anandatandava dance cycle.',
        hasAudio: true,
        hasVideo: true,
      },
    ],
  },
  'national-science-aerospace': {
    museum: {
      name: 'National Science & Aerospace Museum',
      slug: 'national-science-aerospace',
      description:
        "Showcasing India's pioneering aerospace achievements, rocket prototypes, robotic innovations, and quantum physics explorations.",
      coverImage: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Airport Road, Science City',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560017',
      },
      openingHours: 'Wednesday - Monday: 10:00 AM - 6:00 PM (Closed Tuesdays)',
      website: 'https://scienceaerospacemuseum.in',
    },
    sections: [{ _id: 'sec_space_1', name: 'Space Exploration & Rocketry' }],
    artifacts: [
      {
        shortCode: 'art_9c3b1a',
        name: 'Rohini-75 Sounding Rocket Prototype',
        sectionName: 'Space Exploration & Rocketry',
        datePeriod: '1967 CE',
        location: 'Launch Hall, Tower Alpha',
        image: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=600&q=80',
        description: 'First indigenously fabricated single-stage sounding rocket launched from Thumba in 1967.',
        hasAudio: true,
        hasVideo: true,
      },
    ],
  },
  'deccan-royal-arts': {
    museum: {
      name: 'Deccan Royal Arts & Cultural Heritage Museum',
      slug: 'deccan-royal-arts',
      description:
        'Preserving the grandeur of Vijayanagara, Bahmani, and Mysore royal arts, gilded weaponry, gold leaf miniature paintings, and silk textiles.',
      coverImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Palace Grounds, Royal Enclosure',
        city: 'Mysuru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '570001',
      },
      openingHours: 'Everyday: 9:00 AM - 5:30 PM',
      website: 'https://deccanroyalarts.org',
    },
    sections: [{ _id: 'sec_royal_1', name: 'Imperial Arms & Royal Metallurgy' }],
    artifacts: [
      {
        shortCode: 'art_1a7f3e',
        name: 'Mysore Tiger-Hilt Damascene Wootz Talwar',
        sectionName: 'Imperial Arms & Royal Metallurgy',
        datePeriod: 'c. 1790 CE (18th Century)',
        location: 'Armory Hall, Glass Stand 8',
        image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80',
        description: 'Hand-forged crucible Wootz steel sword with gold-damascened calligraphy and tiger-shaped pommel.',
        hasAudio: true,
        hasVideo: true,
      },
    ],
  },
};

export const MuseumPage: React.FC = () => {
  const { museumId } = useParams<{ museumId: string }>();
  const navigate = useNavigate();
  const isNative = isNativeApp();

  const [selectedSection, setSelectedSection] = useState('ALL');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Normalize key
  const lookupKey = museumId || 'gmu-heritage-museum';
  const data =
    MUSEUM_RECORDS[lookupKey] ||
    Object.values(MUSEUM_RECORDS).find((m) => m.museum.slug === lookupKey) ||
    MUSEUM_RECORDS['gmu-heritage-museum'];

  const { museum, sections, artifacts } = data;

  const filteredArtifacts = artifacts.filter((art) =>
    selectedSection === 'ALL' ? true : art.sectionName.toLowerCase().includes(selectedSection.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFCFD] text-[#172033]">
      {!isNative && <Header museumTitle={museum.name} museumSlug={museum.slug} />}

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-8">
        {/* 1. All-in-One Hero Banner */}
        <div
          style={{ backgroundColor: '#17365F' }}
          className="relative rounded-3xl overflow-hidden text-white shadow-xl border border-slate-700 p-6 sm:p-10"
        >
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
              <Landmark className="w-3.5 h-3.5 text-amber-300" />
              <span>{museum.address?.city}, {museum.address?.state}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight leading-tight">
              {museum.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              {museum.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>{museum.openingHours}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>{museum.address?.street}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Gallery Filter Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#172033] flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#214E86]" />
              <span>Exhibitions & Artifacts in this Museum</span>
            </h2>
            <span className="text-xs font-bold text-[#64748B]">
              {filteredArtifacts.length} exhibit{filteredArtifacts.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedSection('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSection === 'ALL'
                  ? 'bg-[#214E86] text-white shadow-sm'
                  : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#172033]'
              }`}
            >
              All Galleries
            </button>
            {sections.map((sec) => (
              <button
                key={sec._id}
                onClick={() => setSelectedSection(sec.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSection === sec.name
                    ? 'bg-[#214E86] text-white shadow-sm'
                    : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#172033]'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Direct Artifact Grid (All-In-One: Photos, Details, Audio Guides) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredArtifacts.map((art) => (
            <div
              key={art.shortCode}
              className="rounded-3xl bg-white border border-[#CBD5E1] shadow-sm hover:shadow-xl transition-all p-4 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={art.image}
                    alt={art.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center space-x-1.5">
                    {art.hasAudio && (
                      <span className="p-1.5 rounded-lg bg-black/70 text-amber-300">
                        <Headphones className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {art.hasVideo && (
                      <span className="p-1.5 rounded-lg bg-black/70 text-emerald-300">
                        <Film className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Exhibit Details */}
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-[#214E86] uppercase tracking-wider mb-1">
                    <span>{art.sectionName}</span>
                    <span>•</span>
                    <span>{art.datePeriod}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#172033] leading-snug">
                    {art.name}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mt-1">
                    {art.description}
                  </p>
                </div>
              </div>

              {/* Action Button: Direct Open */}
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[11px] text-[#214E86] font-semibold flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{art.location}</span>
                </span>

                <Link
                  to={`/a/${art.shortCode}`}
                  className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-[#214E86] hover:bg-[#17365F] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  <span>Explore Exhibit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {!isNative && <Footer />}

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
