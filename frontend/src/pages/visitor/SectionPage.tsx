import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Landmark,
  ChevronLeft,
  Headphones,
  Film,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  Layers,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Section, Artifact, Museum } from '../../types';
import { api } from '../../services/api';
import { isNativeApp } from '../../utils/platform';

const FALLBACK_SECTION_ARTIFACTS: any[] = [
  {
    _id: 'art_8f29d2',
    shortCode: 'art_8f29d2',
    name: 'Ancient Water Clock (Ghati Yantra / Clepsydra)',
    datePeriod: 'c. 1020 CE (11th Century)',
    locationInsideMuseum: 'Gallery 2 (Ancient Tech), Stand 14',
    shortDescription: 'Precision hydrodynamic timekeeping vessel measuring 24-minute "Ghati" intervals.',
    images: [{ url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' }],
    audioNarration: { url: 'https://actions.google.com/sounds/v1/water/water_dripping_in_cave.ogg' },
    video: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  },
  {
    _id: 'art_a4f10e',
    shortCode: 'art_a4f10e',
    name: '12th-Century Palm Leaf Astronomical Folio',
    datePeriod: 'c. 1150 CE (12th Century)',
    locationInsideMuseum: 'Manuscripts Vault, Case 3',
    shortDescription: 'Rare Sanskrit treatise on planetary orbits and lunar eclipse calculations.',
    images: [{ url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80' }],
    audioNarration: { url: 'https://actions.google.com/sounds/v1/science/radar_screen.ogg' },
  },
  {
    _id: 'art_7e20b4',
    shortCode: 'art_7e20b4',
    name: 'Rare Chalukyan Celestial Brass Astrolabe',
    datePeriod: 'c. 1280 CE (13th Century)',
    locationInsideMuseum: 'Astronomy Gallery, Stand 7',
    shortDescription: 'Precision brass astrolabe with engraved nakshatras for nighttime navigation.',
    images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' }],
    audioNarration: { url: 'https://actions.google.com/sounds/v1/foley/temple_bell.ogg' },
  },
];

export const SectionPage: React.FC = () => {
  const { museumId, sectionId } = useParams<{ museumId: string; sectionId: string }>();
  const navigate = useNavigate();
  const isNative = isNativeApp();

  const [section, setSection] = useState<Section | null>({
    _id: sectionId || 'sec_1',
    museumId: museumId || 'm1',
    name: 'Gallery Wing Collection',
    description: 'Explore historical marvels, sculptures, manuscripts, and interactive audio guides.',
    displayOrder: 1,
    isActive: true,
    createdAt: '',
    updatedAt: '',
  });
  const [artifacts, setArtifacts] = useState<any[]>(FALLBACK_SECTION_ARTIFACTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSectionArtifacts = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/public/section/${sectionId}/artifacts`);
        if (res.success && res.data && res.data.artifacts && res.data.artifacts.length > 0) {
          setSection(res.data.section);
          setArtifacts(res.data.artifacts);
        }
      } catch (err) {
        console.warn('Using embedded gallery exhibits:', err);
      } finally {
        setLoading(false);
      }
    };

    if (sectionId) {
      fetchSectionArtifacts();
    }
  }, [sectionId]);

  const filteredArtifacts = artifacts.filter((art) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      art.name.toLowerCase().includes(term) ||
      art.shortDescription?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFCFD] text-[#172033]">
      {!isNative && <Header />}

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-8">
        {/* Navigation Breadcrumb (Desktop) */}
        {!isNative && (
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#64748B] overflow-x-auto pb-1">
            <Link to="/" className="hover:text-[#214E86] shrink-0 font-medium">
              Museums
            </Link>
            <span>/</span>
            {museumId && (
              <>
                <Link
                  to={`/museum/${museumId}`}
                  className="hover:text-[#214E86] font-medium shrink-0"
                >
                  Museum Hub
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#172033] font-bold truncate">{section?.name}</span>
          </div>
        )}

        {/* Section Banner */}
        <div
          style={{ backgroundColor: '#17365F' }}
          className="relative rounded-3xl overflow-hidden text-white shadow-xl border border-slate-700 p-6 sm:p-10"
        >
          <div className="max-w-3xl relative z-10 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span>Gallery Wing</span>
              </span>

              {museumId && (
                <Link
                  to={`/museum/${museumId}`}
                  className="inline-flex items-center space-x-1 text-xs text-amber-300 font-semibold hover:underline"
                >
                  <span>Return to Museum Explorer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight">
              {section?.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              {section?.description}
            </p>
          </div>
        </div>

        {/* Search within Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter exhibits in this gallery..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#CBD5E1] text-xs sm:text-sm text-[#172033] focus:outline-none focus:border-[#214E86]"
            />
          </div>

          <span className="text-xs text-[#64748B] font-semibold">
            Showing {filteredArtifacts.length} exhibit{filteredArtifacts.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Exhibits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtifacts.map((artifact) => {
            const coverImg =
              artifact.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';

            return (
              <Link
                key={artifact.shortCode || artifact._id}
                to={`/a/${artifact.shortCode}`}
                className="group rounded-3xl overflow-hidden bg-white border border-[#CBD5E1] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between p-4 space-y-3"
              >
                <div className="relative aspect-16/10 rounded-2xl bg-slate-900 overflow-hidden">
                  <img
                    src={coverImg}
                    alt={artifact.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5">
                    {artifact.audioNarration?.url && (
                      <span className="p-1.5 rounded-lg bg-black/70 text-amber-300">
                        <Headphones className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {artifact.video?.url && (
                      <span className="p-1.5 rounded-lg bg-black/70 text-emerald-300">
                        <Film className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  {artifact.datePeriod && (
                    <span className="text-[10px] font-bold text-[#214E86] uppercase tracking-wider block">
                      {artifact.datePeriod}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-sm text-[#172033] group-hover:text-[#214E86] transition-colors line-clamp-2 leading-snug">
                    {artifact.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B] line-clamp-2">
                    {artifact.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#214E86]">
                  <span>Explore Exhibit</span>
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
