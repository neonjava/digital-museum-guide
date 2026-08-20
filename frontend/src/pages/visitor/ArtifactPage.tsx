import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Landmark,
  MapPin,
  Calendar,
  UserCheck,
  Tag,
  Share2,
  QrCode,
  ArrowLeft,
  Headphones,
  BookOpen,
  Info,
  Check,
  Layers,
  Sparkles,
  AlertCircle,
  Volume2,
  ArrowRight,
  Download,
  Globe,
  X,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { ImageGallery } from '../../components/visitor/ImageGallery';
import { AudioPlayer } from '../../components/visitor/AudioPlayer';
import { VideoPlayer } from '../../components/visitor/VideoPlayer';
import { RichContentRenderer } from '../../components/visitor/RichContentRenderer';
import { QRPrintCardModal } from '../../components/admin/QRPrintCardModal';
import { Artifact, Museum, Section } from '../../types';
import { api } from '../../services/api';
import { isNativeApp } from '../../utils/platform';

// Complete fallback profiles for all 8 seeded artifacts
const FALLBACK_ARTIFACTS: Record<string, any> = {
  art_8f29d2: {
    _id: 'art_8f29d2',
    shortCode: 'art_8f29d2',
    name: 'Ancient Water Clock (Ghati Yantra / Clepsydra)',
    shortDescription:
      'A precision hydrodynamic timekeeping device used in ancient observatories to measure 24-minute "Ghati" intervals.',
    fullDescription:
      'The Ghati Yantra is one of humanity’s earliest empirical precision instruments for measuring time independently of sunlight. This model consists of a calibrated copper bowl with a precision micro-orifice floating in a bronze reservoir.',
    historicalInformation:
      'Described in the 5th-century astronomical treatise Surya Siddhanta and the Panchasiddhantika of Varahamihira.',
    datePeriod: 'c. 1020 CE (11th Century)',
    creatorOrigin: 'Chalukyan Guild of Mechanical Artisans (Kalyana)',
    locationInsideMuseum: 'Gallery 2 (Ancient Tech), Stand 14',
    tags: ['Timekeeping', 'Engineering', 'Hydrodynamics', 'Astronomy'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Calibrated copper bowl in water reservoir',
        isCover: true,
      },
    ],
    audioNarration: {
      url: 'https://actions.google.com/sounds/v1/water/water_dripping_in_cave.ogg',
      title: 'Audio Guide: The Rhythm of Water Clock Mechanics',
      duration: 145,
      transcript:
        'Welcome to Exhibit 14. Before mechanical pendulum clocks existed, ancient astronomers looked to steady liquid flow to divide day and night into sixty equal intervals called ghatis. Notice the microscopic precision orifice at the base of this calibrated copper basin...',
    },
    video: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Demonstration: 24-Minute Sinking Cycle',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    },
    museumId: {
      _id: 'm1',
      name: 'GM University Heritage Museum',
      slug: 'gmu-heritage-museum',
    },
    sectionId: {
      _id: 'sec_gmu_1',
      name: 'Ancient Technology & Engineering',
    },
    status: 'PUBLISHED',
  },
  art_a4f10e: {
    _id: 'art_a4f10e',
    shortCode: 'art_a4f10e',
    name: '12th-Century Palm Leaf Astronomical Folio',
    shortDescription:
      'Rare Sanskrit treatise written in Grantha script containing mathematical equations for calculating lunar eclipses.',
    fullDescription:
      'Inscribed with a fine iron stylus and treated with natural lampblack charcoal ink, this palm-leaf manuscript preserves medieval celestial calculations with astonishing precision.',
    historicalInformation:
      'Composed during the zenith of the Western Chalukya scholastic period.',
    datePeriod: 'c. 1150 CE (12th Century)',
    creatorOrigin: 'Astronomer Bhaskaracharya School',
    locationInsideMuseum: 'Manuscripts Vault, Case 3',
    tags: ['Manuscript', 'Astronomy', 'Sanskrit', 'Grantha Script'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
        caption: 'Engraved palm-leaf folio with astronomical diagrams',
        isCover: true,
      },
    ],
    audioNarration: {
      url: 'https://actions.google.com/sounds/v1/science/radar_screen.ogg',
      title: 'Audio Guide: Reading Medieval Star Charts',
      duration: 130,
    },
    museumId: {
      _id: 'm1',
      name: 'GM University Heritage Museum',
      slug: 'gmu-heritage-museum',
    },
    sectionId: {
      _id: 'sec_gmu_2',
      name: 'Astronomy & Rare Manuscripts',
    },
    status: 'PUBLISHED',
  },
  art_7e20b4: {
    _id: 'art_7e20b4',
    shortCode: 'art_7e20b4',
    name: 'Rare Chalukyan Celestial Brass Astrolabe',
    shortDescription:
      'Engraved brass navigation astrolabe measuring altitude of celestial bodies and calculating local solar time.',
    fullDescription:
      'This multi-plate brass astrolabe includes rete pointers for 28 nakshatras (lunar mansions) and latitude plates calibrated for central and southern India.',
    historicalInformation:
      'Used by royal maritime navigators and court astrologers.',
    datePeriod: 'c. 1280 CE (13th Century)',
    creatorOrigin: 'Deccan Guild of Metallurgists',
    locationInsideMuseum: 'Astronomy Gallery, Stand 7',
    tags: ['Astrolabe', 'Navigation', 'Metallurgy', 'Brass'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Engraved brass astrolabe rete and mater',
        isCover: true,
      },
    ],
    audioNarration: {
      url: 'https://actions.google.com/sounds/v1/foley/temple_bell.ogg',
      title: 'Audio Guide: Celestial Navigation in the Deccan',
      duration: 140,
    },
    museumId: {
      _id: 'm1',
      name: 'GM University Heritage Museum',
      slug: 'gmu-heritage-museum',
    },
    sectionId: {
      _id: 'sec_gmu_2',
      name: 'Astronomy & Rare Manuscripts',
    },
    status: 'PUBLISHED',
  },
  art_2f90a1: {
    _id: 'art_2f90a1',
    shortCode: 'art_2f90a1',
    name: 'Mohenjo-daro Bronze Dancing Girl',
    shortDescription:
      'World-famous lost-wax bronze statuette symbolizing prehistoric Harappan artistry and metallurgy.',
    fullDescription:
      'Discovered in 1926 at Mohenjo-daro, this 10.5 cm bronze figurine depicts a young girl in a confident standing pose with bangles up to her shoulder.',
    historicalInformation:
      'Created during the Mature Harappan phase of the Indus Valley Civilization.',
    datePeriod: 'c. 2300 BCE (Bronze Age)',
    creatorOrigin: 'Harappan Artisans',
    locationInsideMuseum: 'Central Rotunda, Case 1',
    tags: ['Harappan', 'Bronze Age', 'Mohenjo-daro', 'Sculpture'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
        caption: 'Mohenjo-daro bronze figurine front view',
        isCover: true,
      },
    ],
    audioNarration: {
      url: 'https://actions.google.com/sounds/v1/foley/temple_bell.ogg',
      title: 'Audio Guide: The Mystery of the Harappan Dancing Girl',
      duration: 155,
    },
    museumId: {
      _id: 'm2',
      name: 'National Museum, New Delhi',
      slug: 'national-museum-new-delhi',
    },
    sectionId: {
      _id: 'sec_delhi_1',
      name: 'Indus Valley Civilization Gallery',
    },
    status: 'PUBLISHED',
  },
  art_3c7d19: {
    _id: 'art_3c7d19',
    shortCode: 'art_3c7d19',
    name: 'The Fairy Queen Steam Locomotive (1855)',
    shortDescription:
      'The oldest operational steam locomotive in the world, certified by Guinness World Records.',
    fullDescription:
      'Built in Leeds, England by Kitson, Thompson and Hewitson in 1855, the Fairy Queen hauled passenger and military trains for the East Indian Railway.',
    historicalInformation:
      'Restored in 1997 for heritage luxury runs between New Delhi and Alwar.',
    datePeriod: '1855 CE (19th Century)',
    creatorOrigin: 'Kitson & Co., Leeds',
    locationInsideMuseum: 'Track 1, Heritage Yard',
    tags: ['Steam Train', 'Railway', 'Heritage', 'Locomotive'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Fairy Queen locomotive engine',
        isCover: true,
      },
    ],
    audioNarration: {
      url: 'https://actions.google.com/sounds/v1/transportation/steam_train_horn.ogg',
      title: 'Audio Guide: The Roar of the 1855 Fairy Queen',
      duration: 135,
    },
    museumId: {
      _id: 'm3',
      name: 'National Rail Museum, New Delhi',
      slug: 'national-rail-museum',
    },
    sectionId: {
      _id: 'sec_rail_1',
      name: 'Vintage Steam Locomotives & Royal Saloons',
    },
    status: 'PUBLISHED',
  },
  art_5d81c2: {
    _id: 'art_5d81c2',
    shortCode: 'art_5d81c2',
    name: 'Chola Bronze Dancing Shiva (Nataraja)',
    shortDescription:
      'Masterpiece lost-wax bronze casting representing the cosmic Anandatandava dance cycle.',
    fullDescription:
      'Cast in the 12th century, this iconic bronze depiction of Lord Shiva surrounded by a ring of flames (prabhavali) symbolizes creation, preservation, and dissolution.',
    historicalInformation:
      'Apex achievement of Imperial Chola metallurgy and sacred Saivite iconography.',
    datePeriod: 'c. 1100 CE (12th Century)',
    creatorOrigin: 'Chola Royal Sthapatis (Thanjavur)',
    locationInsideMuseum: 'Bronze Gallery, Center Plinth',
    tags: ['Chola', 'Bronze', 'Sculpture', 'Nataraja', 'Iconography'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
        caption: 'Chola Nataraja bronze sculpture',
        isCover: true,
      },
    ],
    audioNarration: {
      url: 'https://actions.google.com/sounds/v1/foley/temple_bell.ogg',
      title: 'Audio Guide: Symphony of the Cosmic Dance',
      duration: 160,
    },
    museumId: {
      _id: 'm4',
      name: 'Government Museum, Chennai (Egmore)',
      slug: 'government-museum-chennai',
    },
    sectionId: {
      _id: 'sec_egmore_1',
      name: 'Pallava & Chola Bronze Gallery',
    },
    status: 'PUBLISHED',
  },
  art_9c3b1a: {
    _id: 'art_9c3b1a',
    shortCode: 'art_9c3b1a',
    name: 'Rohini-75 Sounding Rocket Prototype',
    shortDescription:
      'First indigenously fabricated single-stage sounding rocket launched from Thumba in 1967.',
    fullDescription:
      'The Rohini-75 (RH-75) marked the founding milestone of the Indian Space Research Programme, developed by Dr. Vikram Sarabhai and APJ Abdul Kalam.',
    historicalInformation:
      'Launched on November 20, 1967 from the Thumba Equatorial Rocket Launching Station.',
    datePeriod: '1967 CE',
    creatorOrigin: 'Indian Space Research Organisation (ISRO)',
    locationInsideMuseum: 'Launch Hall, Tower Alpha',
    tags: ['Rocketry', 'ISRO', 'Aerospace', 'Science'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=1200&q=80',
        caption: 'RH-75 sounding rocket casing',
        isCover: true,
      },
    ],
    audioNarration: {
      url: 'https://actions.google.com/sounds/v1/science/radar_screen.ogg',
      title: 'Audio Guide: India’s Journey into the Cosmos',
      duration: 150,
    },
    museumId: {
      _id: 'm5',
      name: 'National Science & Aerospace Museum',
      slug: 'national-science-aerospace',
    },
    sectionId: {
      _id: 'sec_space_1',
      name: 'Space Exploration & Rocketry',
    },
    status: 'PUBLISHED',
  },
  art_1a7f3e: {
    _id: 'art_1a7f3e',
    shortCode: 'art_1a7f3e',
    name: 'Mysore Tiger-Hilt Damascene Wootz Talwar',
    shortDescription:
      'Hand-forged crucible Wootz steel sword with gold-damascened calligraphy and tiger-shaped pommel.',
    fullDescription:
      'Features authentic crystalline Wootz steel patterns on the curved blade, known worldwide for its extraordinary hardness and micro-carbide sharpness.',
    historicalInformation:
      'Crafted in the Mysore royal armory during the Anglo-Mysore war period.',
    datePeriod: 'c. 1790 CE (18th Century)',
    creatorOrigin: 'Mysore Royal Armory Metallurgists',
    locationInsideMuseum: 'Armory Hall, Glass Stand 8',
    tags: ['Wootz Steel', 'Sword', 'Arms & Armor', 'Mysore'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Tiger-hilt damascene sword blade',
        isCover: true,
      },
    ],
    audioNarration: {
      url: 'https://actions.google.com/sounds/v1/foley/temple_bell.ogg',
      title: 'Audio Guide: The Metallurgy of Indian Wootz Steel',
      duration: 145,
    },
    museumId: {
      _id: 'm6',
      name: 'Deccan Royal Arts & Cultural Heritage Museum',
      slug: 'deccan-royal-arts',
    },
    sectionId: {
      _id: 'sec_royal_1',
      name: 'Imperial Arms & Royal Metallurgy',
    },
    status: 'PUBLISHED',
  },
};

export const ArtifactPage: React.FC = () => {
  const { artifactId } = useParams<{ artifactId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trafficSource = (searchParams.get('src') || 'WEB').toUpperCase();
  const isNative = isNativeApp();

  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [relatedArtifacts, setRelatedArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAppPrompt, setShowAppPrompt] = useState(true);

  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/public/artifact/${artifactId}`);

        if (res.success && res.data && res.data.artifact) {
          setArtifact(res.data.artifact);
          setRelatedArtifacts(res.data.relatedArtifacts || []);
        } else {
          loadFallback();
        }
      } catch (err: any) {
        console.warn('API fetch error, loading embedded artifact profile:', err);
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      const match =
        FALLBACK_ARTIFACTS[artifactId || ''] || FALLBACK_ARTIFACTS['art_8f29d2'];
      if (match) {
        setArtifact(match as Artifact);
        // Find other artifacts from the same museum as related
        const related = Object.values(FALLBACK_ARTIFACTS)
          .filter(
            (a: any) =>
              a.shortCode !== match.shortCode &&
              a.museumId?.slug === match.museumId?.slug
          )
          .slice(0, 3);
        setRelatedArtifacts(related as Artifact[]);
      }
    };

    if (artifactId) {
      fetchArtifact();
      window.scrollTo(0, 0);
    }
  }, [artifactId, trafficSource]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const museum = artifact?.museumId as Museum | undefined;
  const section = artifact?.sectionId as Section | undefined;

  if (loading && !artifact) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFCFD]">
        {!isNative && <Header />}
        <div className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-6 animate-pulse">
          <div className="aspect-16/10 rounded-3xl bg-slate-200" />
          <div className="h-8 w-2/3 bg-slate-200 rounded-lg" />
          <div className="h-24 bg-slate-200 rounded-2xl" />
        </div>
        {!isNative && <Footer />}
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFCFD]">
        {!isNative && <Header />}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Landmark className="w-16 h-16 text-[#64748B] mb-4" />
          <h2 className="text-2xl font-bold text-[#172033]">Exhibit Not Found</h2>
          <p className="text-sm text-[#64748B] mt-2 mb-6">
            The requested exhibit code could not be loaded.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-[#214E86] text-white font-semibold hover:bg-[#17365F]"
          >
            Return to Explorer
          </Link>
        </div>
        {!isNative && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFCFD] text-[#172033]">
      {!isNative && <Header museumTitle={museum?.name} museumSlug={museum?.slug} />}

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* Navigation Breadcrumb (Desktop) */}
        {!isNative && (
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#64748B] overflow-x-auto pb-1">
            <Link to="/" className="hover:text-[#214E86] shrink-0 font-medium">
              Museums
            </Link>
            <span>/</span>
            {museum && (
              <>
                <Link
                  to={`/museum/${museum.slug || museum._id}`}
                  className="hover:text-[#214E86] font-medium shrink-0"
                >
                  {museum.name}
                </Link>
                <span>/</span>
              </>
            )}
            {section && (
              <>
                <Link
                  to={`/museum/${museum?.slug || museum?._id}?gallery=${section._id}`}
                  className="hover:text-[#214E86] font-medium shrink-0"
                >
                  {section.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#172033] font-bold truncate">{artifact.name}</span>
          </div>
        )}

        {/* Google Lens / Mobile Web QR Scan Gateway Banner */}
        {showAppPrompt && !isNative && (
          <div className="max-w-4xl mx-auto w-full bg-[#17365F] text-white p-5 rounded-3xl shadow-xl border border-slate-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                    Official Museum Digital Guide
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Exhibit: {artifact.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowAppPrompt(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
                aria-label="Dismiss banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              You scanned a physical museum placard! For the best in-gallery companion experience with voice narration tours and interactive features, download the official Android App or continue with the web guide.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <a
                href="/downloads/gmu-museum-guide.apk"
                download="gmu-museum-guide.apk"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-all text-center"
              >
                <Download className="w-4 h-4" />
                <span>Download Android App (APK)</span>
              </a>

              <button
                onClick={() => setShowAppPrompt(false)}
                className="py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors text-center"
              >
                <Globe className="w-4 h-4" />
                <span>Continue with Web Guide</span>
              </button>
            </div>
          </div>
        )}

        {/* Clean Hero Image Gallery */}
        <div className="max-w-4xl mx-auto w-full">
          <ImageGallery images={artifact.images || []} artifactName={artifact.name} />
        </div>

        {/* Title, Metadata & Action Badges */}
        <div className="max-w-4xl mx-auto w-full space-y-4">
          {/* Location, Period & Origin Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {artifact.locationInsideMuseum && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#214E86] text-white text-xs font-semibold shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{artifact.locationInsideMuseum}</span>
              </div>
            )}

            {artifact.datePeriod && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2FA] text-[#214E86] border border-[#CBD5E1] text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{artifact.datePeriod}</span>
              </div>
            )}

            {artifact.creatorOrigin && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2FA] text-[#17365F] border border-[#CBD5E1] text-xs font-medium">
                <UserCheck className="w-3.5 h-3.5 text-[#214E86]" />
                <span>{artifact.creatorOrigin}</span>
              </div>
            )}
          </div>

          {/* Main Exhibit Title & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold text-[#172033] tracking-tight leading-tight">
              {artifact.name}
            </h1>

            {/* Quick Share & QR Card Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#172033] hover:bg-[#EAF2FA] text-xs font-semibold shadow-xs transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#214E86]" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#214E86] text-white text-xs font-bold hover:bg-[#17365F] shadow-xs transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-300" />
                <span>QR Placard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* 1. Official Audio Narration Guide */}
          {artifact.audioNarration?.url && (
            <AudioPlayer
              audio={artifact.audioNarration}
              artifactName={artifact.name}
            />
          )}

          {/* 2. Exhibit Overview */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#214E86]">
              Exhibit Overview
            </h2>
            <p className="text-sm sm:text-base text-[#172033]/90 leading-relaxed font-normal">
              {artifact.shortDescription}
            </p>
            {artifact.fullDescription && (
              <p className="text-sm sm:text-base text-[#172033]/80 leading-relaxed font-normal pt-3 border-t border-[#E2E8F0]">
                {artifact.fullDescription}
              </p>
            )}
          </div>

          {/* 3. Video Documentary */}
          {artifact.video?.url && (
            <VideoPlayer video={artifact.video} />
          )}

          {/* 4. Structured Rich Content Blocks */}
          {artifact.richContent && artifact.richContent.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm">
              <RichContentRenderer blocks={artifact.richContent} />
            </div>
          )}

          {/* 5. Historical Context & Background */}
          {artifact.historicalInformation && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#EAF2FA] border border-[#CBD5E1] shadow-sm space-y-3">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#214E86] flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>Historical Significance</span>
              </h2>
              <p className="text-sm sm:text-base text-[#172033]/90 leading-relaxed font-normal">
                {artifact.historicalInformation}
              </p>
            </div>
          )}

          {/* 6. Tags */}
          {artifact.tags && artifact.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Tag className="w-4 h-4 text-[#64748B]" />
              {artifact.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white border border-[#CBD5E1] text-xs font-semibold text-[#64748B]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 7. Related Exhibits in Same Collection */}
          {relatedArtifacts.length > 0 && (
            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-[#172033]">
                  More Exhibits in this Museum
                </h3>
                {museum && (
                  <Link
                    to={`/museum/${museum.slug || museum._id}`}
                    className="text-xs font-bold text-[#214E86] hover:underline flex items-center space-x-1"
                  >
                    <span>View Museum Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedArtifacts.map((rel) => (
                  <Link
                    key={rel.shortCode || rel._id}
                    to={`/a/${rel.shortCode}`}
                    className="p-3.5 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs hover:shadow-md transition-all flex items-center space-x-3 group"
                  >
                    <img
                      src={
                        rel.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={rel.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-xs text-[#172033] group-hover:text-[#214E86] transition-colors truncate">
                        {rel.name}
                      </h4>
                      <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                        {rel.shortDescription}
                      </p>
                      <span className="text-[10px] text-[#214E86] font-bold mt-1 block">
                        Explore →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {!isNative && <Footer />}

      {/* QR Code Printable Modal */}
      {showQRModal && (
        <QRPrintCardModal
          artifact={artifact}
          museum={museum}
          section={section}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};
