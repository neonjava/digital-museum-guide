import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { QRScannerModal } from '../../components/visitor/QRScannerModal';
import { Museum, Section } from '../../types';
import { api } from '../../services/api';

// Rich fallback museum records
const FALLBACK_MUSEUMS: Record<string, { museum: Partial<Museum>; sections: Partial<Section>[] }> = {
  'gmu-heritage-museum': {
    museum: {
      name: 'GM University Heritage Museum',
      slug: 'gmu-heritage-museum',
      description:
        'A premier university museum dedicated to preserving historical technological marvels, ancient hydrodynamics, rare palm-leaf manuscripts, and classical Deccan arts.',
      logo: 'https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'University Main Boulevard, Heritage Campus',
        city: 'Davangere',
        state: 'Karnataka',
        country: 'India',
        postalCode: '577006',
      },
      contact: {
        email: 'heritage@gmu.edu.in',
        phone: '+91 8192 234567',
      },
      openingHours: 'Tuesday - Sunday: 9:30 AM - 5:30 PM (Closed Mondays)',
      website: 'https://gmu.edu.in/heritage-museum',
    },
    sections: [
      {
        _id: 'sec_gmu_1',
        name: 'Ancient Technology & Engineering',
        description: 'Hydrodynamic timekeepers, metallurgical furnaces, and mechanical innovations of ancient civilizations.',
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
      {
        _id: 'sec_gmu_2',
        name: 'Astronomy & Rare Manuscripts',
        description: 'Original palm-leaf folios, brass celestial astrolabes, and star charts dating from the 8th to 17th centuries.',
        coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
        displayOrder: 2,
      },
      {
        _id: 'sec_gmu_3',
        name: 'Classical Sculptures & Metallurgy',
        description: 'Masterpieces of bronze casting (cire perdue), stone carvings, and temple iconography.',
        coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
        displayOrder: 3,
      },
      {
        _id: 'sec_gmu_4',
        name: 'Freedom Struggle & Regional History',
        description: 'Relics, underground printing presses, and photographs documenting the regional freedom movement.',
        coverImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
        displayOrder: 4,
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
    sections: [
      {
        _id: 'sec_delhi_1',
        name: 'Indus Valley Civilization Gallery',
        description: 'Excavated relics from Mohenjo-daro and Harappa including the Dancing Girl and terracotta seals.',
        coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
      {
        _id: 'sec_delhi_2',
        name: 'Maurya, Shunga & Kushana Art Gallery',
        description: 'Polished sandstone sculptures, Gandhara Buddhas, and Mathura yakshi pillars.',
        coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
        displayOrder: 2,
      },
    ],
  },
  'national-rail-museum': {
    museum: {
      name: 'National Rail Museum, New Delhi',
      slug: 'national-rail-museum',
      description:
        'Showcasing India’s rich 170-year railway heritage with 100+ life-sized exhibits, royal vintage saloons, and the 1855 Fairy Queen steam engine.',
      coverImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Chanakyapuri, Shanti Path',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110021',
      },
      openingHours: 'Tuesday - Sunday: 10:00 AM - 5:00 PM (Closed Mondays)',
    },
    sections: [
      {
        _id: 'sec_rail_1',
        name: 'Vintage Steam Locomotives & Royal Saloons',
        description: 'Historical steam locomotives including the Fairy Queen (1855) and Maharaja Saloon coaches.',
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
    ],
  },
  'government-museum-chennai': {
    museum: {
      name: 'Government Museum, Chennai (Egmore)',
      slug: 'government-museum-chennai',
      description:
        'Established in 1851, globally renowned for its priceless collection of South Indian Bronzes, Amaravati sculptures, and numismatics.',
      coverImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Pantheon Road, Egmore',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        postalCode: '600008',
      },
      openingHours: 'Saturday - Thursday: 9:30 AM - 5:00 PM (Closed Fridays)',
    },
    sections: [
      {
        _id: 'sec_egmore_1',
        name: 'Pallava & Chola Bronze Gallery',
        description: 'Masterpiece lost-wax bronzes from the 8th to 13th century Chola epoch.',
        coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
    ],
  },
  'national-science-aerospace': {
    museum: {
      name: 'National Science & Aerospace Museum',
      slug: 'national-science-aerospace',
      description:
        'Showcasing India’s pioneering aerospace achievements, rocket prototypes, robotic innovations, and quantum physics explorations.',
      coverImage: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'HAL Airport Road, Science City',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560017',
      },
      openingHours: 'Wednesday - Monday: 10:00 AM - 6:00 PM (Closed Tuesdays)',
    },
    sections: [
      {
        _id: 'sec_space_1',
        name: 'Space Exploration & Rocketry',
        description: 'Historical sounding rockets, lunar rover landing apparatus, and telemetry tracking arrays.',
        coverImage: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
    ],
  },
  'deccan-royal-arts': {
    museum: {
      name: 'Deccan Royal Arts & Cultural Heritage Museum',
      slug: 'deccan-royal-arts',
      description:
        'Preserving the grandeur of Vijayanagara, Bahmani, and Mysore royal arts, gilded weaponry, gold leaf miniature paintings, and silk textiles.',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Palace Grounds, Heritage Complex',
        city: 'Mysuru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '570001',
      },
      openingHours: 'Everyday: 9:00 AM - 5:30 PM',
    },
    sections: [
      {
        _id: 'sec_royal_1',
        name: 'Imperial Arms & Royal Metallurgy',
        description: 'Wootz steel swords, damascened daggers, gold-inlaid armor, and cavalry regalia.',
        coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
    ],
  },
};

export const MuseumPage: React.FC = () => {
  const { museumId } = useParams<{ museumId: string }>();
  const [museum, setMuseum] = useState<Museum | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMuseumDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/public/museum/${museumId}`);
        if (res.success && res.data) {
          setMuseum(res.data.museum);
          setSections(res.data.sections);
        } else {
          loadFallback();
        }
      } catch (err) {
        console.warn('API fetch error, loading fallback museum profile:', err);
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      const match = FALLBACK_MUSEUMS[museumId || ''] || FALLBACK_MUSEUMS['gmu-heritage-museum'];
      if (match) {
        setMuseum(match.museum as Museum);
        setSections(match.sections as Section[]);
      }
    };

    if (museumId) {
      fetchMuseumDetails();
    }
  }, [museumId]);

  if (loading && !museum) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFCFD]">
        <Header />
        <div className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-6 animate-pulse">
          <div className="h-72 rounded-3xl bg-slate-200" />
          <div className="h-8 w-1/3 bg-slate-200 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-56 bg-slate-200 rounded-3xl" />
            <div className="h-56 bg-slate-200 rounded-3xl" />
            <div className="h-56 bg-slate-200 rounded-3xl" />
            <div className="h-56 bg-slate-200 rounded-3xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!museum) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFCFD]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Landmark className="w-16 h-16 text-[#64748B] mb-4" />
          <h2 className="text-2xl font-bold text-[#172033]">Museum Not Found</h2>
          <p className="text-sm text-[#64748B] mt-2 mb-6">
            The requested museum could not be found or is currently inactive.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-[#214E86] text-white font-semibold hover:bg-[#17365F]"
          >
            Return to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredSections = sections.filter((sec) =>
    searchQuery.trim()
      ? sec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sec.description && sec.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFCFD] text-[#172033]">
      <Header museumTitle={museum.name} museumSlug={museum.slug} />

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-10">
        {/* Cover Hero Banner */}
        <div
          style={{ backgroundColor: '#17365F' }}
          className="relative rounded-3xl overflow-hidden text-white shadow-xl border border-slate-700"
        >
          <div className="relative h-72 sm:h-96 w-full">
            <img
              src={
                museum.coverImage ||
                'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1600&q=80'
              }
              alt={museum.name}
              className="w-full h-full object-cover opacity-40"
            />
            <div
              style={{
                background: 'linear-gradient(to top, rgba(23, 54, 95, 0.95) 0%, rgba(23, 54, 95, 0.4) 60%, transparent 100%)',
              }}
              className="absolute inset-0"
            />

            <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <span className="px-3 py-1 rounded-full bg-white/20 border border-white/25 text-xs font-semibold text-white uppercase tracking-wider backdrop-blur-xs">
                  National Heritage Institution
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
                  {museum.name}
                </h1>
                {museum.address?.city && (
                  <p className="flex items-center space-x-1.5 text-xs sm:text-sm text-slate-100 font-medium">
                    <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <span>
                      {museum.address.street ? `${museum.address.street}, ` : ''}
                      {museum.address.city}, {museum.address.state}
                    </span>
                  </p>
                )}
              </div>

              {/* QR Scan Button */}
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-white text-[#214E86] font-bold text-sm hover:bg-slate-100 shadow-xl active:scale-95 transition-all shrink-0"
              >
                <QrCode className="w-5 h-5 text-[#214E86]" />
                <span>Scan Exhibit QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Museum Description & Practical Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#214E86]">
              About the Museum
            </h2>
            <p className="text-sm sm:text-base text-[#172033]/90 leading-relaxed font-normal">
              {museum.description || 'Welcome to this digital museum guide.'}
            </p>
          </div>

          {/* Practical Info Card */}
          <div className="p-6 rounded-3xl bg-[#EAF2FA] border border-[#CBD5E1] shadow-sm space-y-4 text-xs sm:text-sm">
            <h3 className="font-serif font-bold text-base text-[#214E86] flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Visitor Information</span>
            </h3>

            <div className="space-y-3 pt-1">
              <div>
                <span className="font-semibold text-[#17365F] block">Opening Hours</span>
                <span className="text-[#64748B]">{museum.openingHours || 'Tue - Sun: 9:30 AM - 5:30 PM'}</span>
              </div>

              {museum.contact?.email && (
                <div>
                  <span className="font-semibold text-[#17365F] block">Contact</span>
                  <span className="text-[#64748B]">{museum.contact.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Museum Sections / Galleries */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#172033]">
                Galleries & Exhibition Wings
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Explore themed halls, artifacts, and interactive multimedia audio tours
              </p>
            </div>

            {/* Filter sections */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search gallery wings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#172033] focus:outline-none focus:border-[#214E86]"
              />
            </div>
          </div>

          {filteredSections.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E2E8F0]">
              <p className="text-sm text-[#64748B]">No galleries match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSections.map((section) => (
                <Link
                  key={section._id}
                  to={`/museum/${museum.slug || museum._id}/section/${section._id}`}
                  className="group rounded-3xl overflow-hidden bg-white border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="h-44 bg-slate-900 relative overflow-hidden">
                    <img
                      src={
                        section.coverImage ||
                        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={section.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                      }}
                      className="absolute inset-0"
                    />

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300 block">
                        Gallery Wing
                      </span>
                      <h3 className="font-serif font-bold text-base group-hover:text-amber-200 transition-colors line-clamp-1">
                        {section.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {section.description}
                    </p>

                    <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#214E86]">
                      <span>Enter Gallery</span>
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

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
