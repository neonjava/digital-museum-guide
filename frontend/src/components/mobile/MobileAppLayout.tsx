import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Landmark,
  Compass,
  Search,
  QrCode,
  Layers,
  Headphones,
  ChevronLeft,
  Share2,
} from 'lucide-react';
import { QRScannerModal } from '../visitor/QRScannerModal';

interface MobileAppLayoutProps {
  children: React.ReactNode;
}

export const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const pathname = location.pathname;
  const search = location.search;
  const isHome = pathname === '/' || pathname === '';

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFCFD] text-[#172033] relative pb-28">
      {/* 1. Permanent Top Header: Only "Digital Museum Guide" with Museum Logo */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5">
          {!isHome ? (
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-xl text-[#214E86] active:bg-[#EAF2FA] transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : null}

          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#214E86] text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-4 h-4 text-amber-300" />
            </div>
            <span className="font-serif font-bold text-base text-[#172033] tracking-tight">
              Digital Museum Guide
            </span>
          </Link>
        </div>

        {/* Right action: Quick search shortcut on top */}
        {!pathname.includes('/search') && (
          <button
            onClick={() => navigate('/search')}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#214E86] active:bg-[#EAF2FA]"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
      </header>

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* 3. Permanent Fixed Bottom Navigation Bar on ALL Pages */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] shadow-2xl px-2 py-2 flex items-center justify-around">
        {/* Explore / Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center space-y-1 w-14 py-1 rounded-xl transition-all ${
            isHome
              ? 'text-[#214E86] font-bold'
              : 'text-[#64748B] hover:text-[#172033]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </Link>

        {/* Search */}
        <Link
          to="/search"
          className={`flex flex-col items-center justify-center space-y-1 w-14 py-1 rounded-xl transition-all ${
            pathname === '/search' && !search.includes('audio')
              ? 'text-[#214E86] font-bold'
              : 'text-[#64748B] hover:text-[#172033]'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Search</span>
        </Link>

        {/* Center Floating Camera Scanner FAB */}
        <div className="relative -top-5">
          <button
            onClick={() => setIsScannerOpen(true)}
            aria-label="Launch QR Camera Scanner"
            className="w-14 h-14 rounded-full bg-[#214E86] hover:bg-[#17365F] text-white shadow-[0_4px_20px_rgba(33,78,134,0.45)] border-4 border-white flex items-center justify-center active:scale-95 transition-all"
          >
            <QrCode className="w-6 h-6 text-amber-300 animate-pulse" />
          </button>
        </div>

        {/* Galleries */}
        <Link
          to="/museum/gmu-heritage-museum"
          className={`flex flex-col items-center justify-center space-y-1 w-14 py-1 rounded-xl transition-all ${
            pathname.includes('/museum/') || pathname.includes('/section/')
              ? 'text-[#214E86] font-bold'
              : 'text-[#64748B] hover:text-[#172033]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px]">Galleries</span>
        </Link>

        {/* Audio Tours */}
        <Link
          to="/search?filter=audio"
          className={`flex flex-col items-center justify-center space-y-1 w-14 py-1 rounded-xl transition-all ${
            search.includes('audio')
              ? 'text-[#214E86] font-bold'
              : 'text-[#64748B] hover:text-[#172033]'
          }`}
        >
          <Headphones className="w-5 h-5" />
          <span className="text-[10px]">Audio</span>
        </Link>
      </nav>

      {/* Global QR Scanner Modal accessible from ANY page */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
