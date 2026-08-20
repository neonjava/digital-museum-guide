import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
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
  },
  {
    shortCode: 'art_a4f10e',
    name: '12th-Century Palm Leaf Astronomical Folio',
    museum: 'GM University Heritage Museum',
    gallery: 'Astronomy & Rare Manuscripts',
    period: 'c. 1150 CE (12th Century)',
    location: 'Manuscripts Vault, Case 3',
    description: 'Rare Sanskrit treatise on planetary orbits and lunar eclipse calculations.',
  },
  {
    shortCode: 'art_7e20b4',
    name: 'Rare Chalukyan Celestial Brass Astrolabe',
    museum: 'GM University Heritage Museum',
    gallery: 'Astronomy & Rare Manuscripts',
    period: 'c. 1280 CE (13th Century)',
    location: 'Astronomy Gallery, Stand 7',
    description: 'Precision brass astrolabe with engraved nakshatras for nighttime navigation.',
  },
  {
    shortCode: 'art_2f90a1',
    name: 'Mohenjo-daro Bronze Dancing Girl',
    museum: 'National Museum, New Delhi',
    gallery: 'Indus Valley Civilization Gallery',
    period: 'c. 2300 BCE (Bronze Age)',
    location: 'Central Rotunda, Case 1',
    description: 'World-famous lost-wax bronze statuette symbolizing prehistoric Harappan artistry.',
  },
  {
    shortCode: 'art_3c7d19',
    name: 'The Fairy Queen Steam Locomotive (1855)',
    museum: 'National Rail Museum, New Delhi',
    gallery: 'Vintage Locomotives & Royal Saloons',
    period: '1855 CE (19th Century)',
    location: 'Track 1, Heritage Yard',
    description: 'Guinness World Record certified oldest operational steam locomotive in the world.',
  },
  {
    shortCode: 'art_5d81c2',
    name: 'Chola Bronze Dancing Shiva (Nataraja)',
    museum: 'Government Museum, Chennai (Egmore)',
    gallery: 'Pallava & Chola Bronze Gallery',
    period: 'c. 1100 CE (12th Century)',
    location: 'Bronze Gallery, Center Plinth',
    description: 'Priceless lost-wax sculpture representing the cosmic Anandatandava dance cycle.',
  },
  {
    shortCode: 'art_9c3b1a',
    name: 'Rohini-75 Sounding Rocket Prototype',
    museum: 'National Science & Aerospace Museum',
    gallery: 'Space Exploration & Rocketry',
    period: '1967 CE',
    location: 'Launch Hall, Tower Alpha',
    description: 'India’s first indigenously fabricated sounding rocket launched from Thumba.',
  },
  {
    shortCode: 'art_1a7f3e',
    name: 'Mysore Tiger-Hilt Damascene Wootz Talwar',
    museum: 'Deccan Royal Arts & Cultural Heritage Museum',
    gallery: 'Imperial Arms & Royal Metallurgy',
    period: 'c. 1790 CE (18th Century)',
    location: 'Armory Hall, Glass Stand 8',
    description: 'Hand-forged crucible Wootz steel blade with gold-damascened calligraphy.',
  },
];

export const QRShowcasePage: React.FC = () => {
  const [selectedMuseum, setSelectedMuseum] = useState('ALL');
  const [downloadingCode, setDownloadingCode] = useState<string | null>(null);

  const filteredExhibits = SEEDED_EXHIBITS.filter((ex) =>
    selectedMuseum === 'ALL' ? true : ex.museum.toLowerCase().includes(selectedMuseum.toLowerCase())
  );

  const downloadCardAsPNG = async (shortCode: string, name: string) => {
    const cardEl = document.getElementById(`placard-card-${shortCode}`);
    if (!cardEl) return;

    try {
      setDownloadingCode(shortCode);
      const dataUrl = await toPng(cardEl, {
        pixelRatio: 3,
        backgroundColor: '#FFFFFF',
      });
      const link = document.createElement('a');
      link.download = `${shortCode}-${name.replace(/[^a-zA-Z0-9]/g, '_')}-placard.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting PNG:', err);
    } finally {
      setDownloadingCode(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFCFD] text-[#172033]">
      <Header />

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Banner */}
        <section
          style={{ backgroundColor: '#17365F' }}
          className="rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold border border-white/20">
              <QrCode className="w-3.5 h-3.5 text-amber-300" />
              <span>Printable Exhibition Placards & PNG Exporter</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-white">
              Museum Exhibit Placard Cards
            </h1>
            <p className="text-sm text-slate-100 leading-relaxed font-normal">
              Download high-resolution PNG placards to print and place beside glass exhibits. Point your mobile app camera to scan and test instantly.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-[#214E86] font-bold text-sm hover:bg-slate-100 shadow-md active:scale-95 transition-all shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print All Placards</span>
          </button>
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
            const isSaving = downloadingCode === item.shortCode;

            return (
              <div
                key={item.shortCode}
                className="rounded-3xl bg-white border border-[#CBD5E1] shadow-md hover:shadow-xl transition-all p-5 flex flex-col justify-between space-y-4"
              >
                {/* Clean Scannable Card to Export */}
                <div
                  id={`placard-card-${item.shortCode}`}
                  className="bg-white p-5 rounded-2xl border-2 border-[#214E86] flex flex-col items-center justify-between text-center space-y-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-[#214E86] tracking-wider block">
                      {item.museum}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#172033] line-clamp-2 leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-[#64748B] block">
                      {item.gallery}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#CBD5E1] shadow-sm my-1">
                    <QRCodeSVG
                      value={deepLinkUrl}
                      size={145}
                      level="H"
                      fgColor="#17365F"
                      bgColor="#FFFFFF"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#214E86] text-white text-[10px] font-bold">
                      <Headphones className="w-3 h-3 text-amber-300" />
                      <span>Scan for Audio & Story</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#214E86] font-mono block pt-1">
                      Exhibit ID: {item.shortCode}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => downloadCardAsPNG(item.shortCode, item.name)}
                    disabled={isSaving}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#214E86] text-white text-xs font-bold hover:bg-[#17365F] flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Exporting...' : 'Save PNG Card'}</span>
                  </button>

                  <Link
                    to={`/a/${item.shortCode}`}
                    className="py-2 px-3 rounded-xl border border-[#CBD5E1] text-[#172033] hover:bg-[#EAF2FA] text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <span>View Page</span>
                    <ExternalLink className="w-3 h-3 text-[#214E86]" />
                  </Link>
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
