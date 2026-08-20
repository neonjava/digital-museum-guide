import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Landmark,
  Headphones,
  Printer,
  ExternalLink,
  Search,
  MapPin,
  Sparkles,
  Download,
  Share2,
  Check,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';

const SEEDED_EXHIBITS = [
  {
    shortCode: 'art_8f29d2',
    name: 'Ancient Water Clock (Ghati Yantra / Clepsydra)',
    museum: 'GM University Heritage Museum',
    gallery: 'Ancient Technology & Engineering',
    period: 'c. 1020 CE (11th Century)',
    location: 'Gallery 2, Stand 14',
    description: 'Precision hydrodynamic timekeeping vessel measuring 24-minute "Ghati" intervals.',
    hasAudio: true,
    hasVideo: true,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  },
  {
    shortCode: 'art_a4f10e',
    name: '12th-Century Palm Leaf Astronomical Folio',
    museum: 'GM University Heritage Museum',
    gallery: 'Astronomy & Rare Manuscripts',
    period: 'c. 1150 CE (12th Century)',
    location: 'Manuscripts Vault, Case 3',
    description: 'Rare Sanskrit treatise on planetary orbits and lunar eclipse calculations.',
    hasAudio: true,
    hasVideo: false,
    coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
  },
  {
    shortCode: 'art_7e20b4',
    name: 'Rare Chalukyan Celestial Brass Astrolabe',
    museum: 'GM University Heritage Museum',
    gallery: 'Astronomy & Rare Manuscripts',
    period: 'c. 1280 CE (13th Century)',
    location: 'Astronomy Gallery, Stand 7',
    description: 'Precision brass astrolabe with engraved nakshatras for nighttime navigation.',
    hasAudio: true,
    hasVideo: true,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    shortCode: 'art_2f90a1',
    name: 'Mohenjo-daro Bronze Dancing Girl',
    museum: 'National Museum, New Delhi',
    gallery: 'Indus Valley Civilization Gallery',
    period: 'c. 2300 BCE (Bronze Age)',
    location: 'Central Rotunda, Case 1',
    description: 'World-famous lost-wax bronze statuette symbolizing prehistoric Harappan artistry.',
    hasAudio: true,
    hasVideo: true,
    coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80',
  },
  {
    shortCode: 'art_3c7d19',
    name: 'The Fairy Queen Steam Locomotive (1855)',
    museum: 'National Rail Museum, New Delhi',
    gallery: 'Vintage Locomotives & Royal Saloons',
    period: '1855 CE (19th Century)',
    location: 'Track 1, Heritage Yard',
    description: 'Guinness World Record certified oldest operational steam locomotive in the world.',
    hasAudio: true,
    hasVideo: true,
    coverImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80',
  },
  {
    shortCode: 'art_5d81c2',
    name: 'Chola Bronze Dancing Shiva (Nataraja)',
    museum: 'Government Museum, Chennai (Egmore)',
    gallery: 'Pallava & Chola Bronze Gallery',
    period: 'c. 1100 CE (12th Century)',
    location: 'Bronze Gallery, Center Plinth',
    description: 'Priceless lost-wax sculpture representing the cosmic Anandatandava dance cycle.',
    hasAudio: true,
    hasVideo: true,
    coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=600&q=80',
  },
  {
    shortCode: 'art_9c3b1a',
    name: 'Rohini-75 Sounding Rocket Prototype',
    museum: 'National Science & Aerospace Museum',
    gallery: 'Space Exploration & Rocketry',
    period: '1967 CE',
    location: 'Launch Hall, Tower Alpha',
    description: 'India’s first indigenously fabricated sounding rocket launched from Thumba.',
    hasAudio: true,
    hasVideo: true,
    coverImage: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=600&q=80',
  },
  {
    shortCode: 'art_1a7f3e',
    name: 'Mysore Tiger-Hilt Damascene Wootz Talwar',
    museum: 'Deccan Royal Arts & Cultural Heritage Museum',
    gallery: 'Imperial Arms & Royal Metallurgy',
    period: 'c. 1790 CE (18th Century)',
    location: 'Armory Hall, Glass Stand 8',
    description: 'Hand-forged crucible Wootz steel blade with gold-damascened calligraphy.',
    hasAudio: true,
    hasVideo: true,
    coverImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80',
  },
];

export const QRShowcasePage: React.FC = () => {
  const [selectedMuseum, setSelectedMuseum] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredExhibits = SEEDED_EXHIBITS.filter((ex) =>
    selectedMuseum === 'ALL' ? true : ex.museum.toLowerCase().includes(selectedMuseum.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const copyUrl = (shortCode: string) => {
    const url = `${window.location.origin}/a/${shortCode}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(shortCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFCFD] text-[#172033]">
      <Header />

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-10">
        {/* Banner */}
        <section
          style={{ backgroundColor: '#17365F' }}
          className="rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold border border-white/20">
              <QrCode className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive QR Testing & Printable Placards</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-white">
              Museum Exhibit QR Code Placards
            </h1>
            <p className="text-sm text-slate-100 leading-relaxed font-normal">
              Point your Android mobile app camera at any of the live QR placards below to instantly test artifact audio narration, high-res galleries, and historical storytelling.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-[#214E86] font-bold text-sm hover:bg-slate-100 shadow-md active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print All Placards</span>
            </button>
          </div>
        </section>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'ALL', label: 'All 8 Seeded Placards' },
            { id: 'GM University', label: 'GMU Heritage Museum' },
            { id: 'National Museum', label: 'National Museum Delhi' },
            { id: 'Rail Museum', label: 'National Rail Museum' },
            { id: 'Chennai', label: 'Chennai Egmore Museum' },
            { id: 'Science', label: 'Aerospace Museum' },
            { id: 'Deccan', label: 'Deccan Royal Museum' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedMuseum(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMuseum === cat.id
                  ? 'bg-[#214E86] text-white shadow-sm'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#172033] hover:bg-[#EAF2FA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Placards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredExhibits.map((item) => {
            const deepLinkUrl = `https://gmu-museum.netlify.app/a/${item.shortCode}`;
            const isCopied = copiedCode === item.shortCode;

            return (
              <div
                key={item.shortCode}
                className="rounded-3xl bg-white border border-[#CBD5E1] shadow-md hover:shadow-xl transition-all p-5 flex flex-col justify-between space-y-4 text-center group relative overflow-hidden"
              >
                {/* Top Institution & Gallery */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#214E86] block truncate">
                    {item.museum}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#172033] line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B] line-clamp-1">
                    {item.gallery} • {item.period}
                  </p>
                </div>

                {/* Scannable High-Contrast QR Code Card */}
                <div className="bg-[#FBFCFD] p-4 rounded-2xl border-2 border-dashed border-[#CBD5E1] flex flex-col items-center justify-center space-y-2.5 mx-auto w-full">
                  <div className="p-2.5 bg-white rounded-xl shadow-xs border border-[#E2E8F0]">
                    <QRCodeSVG
                      value={deepLinkUrl}
                      size={140}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <div className="text-center">
                    <span className="text-[11px] font-mono font-bold text-[#214E86] bg-[#EAF2FA] px-2.5 py-0.5 rounded-md">
                      {item.shortCode}
                    </span>
                    <span className="text-[10px] text-[#64748B] block mt-1 font-medium">
                      📱 Point Phone Camera to Scan
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyUrl(item.shortCode)}
                      className="flex-1 py-2 px-3 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#172033] hover:bg-[#EAF2FA] flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied URL</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 text-[#214E86]" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`/a/${item.shortCode}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#214E86] text-white text-xs font-bold hover:bg-[#17365F] flex items-center justify-center space-x-1 transition-colors"
                    >
                      <span>Open Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="text-[10px] text-[#64748B] flex items-center justify-center space-x-1">
                    <MapPin className="w-3 h-3 text-[#214E86]" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
