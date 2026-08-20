import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Landmark,
  QrCode,
  Search,
  Type,
  Eye,
  Menu,
  X,
  ShieldCheck,
  Smartphone,
  Compass,
} from 'lucide-react';
import { useAccessibility, TextSize } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { isNativeApp } from '../../utils/platform';

interface HeaderProps {
  museumTitle?: string;
  museumSlug?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ museumTitle, museumSlug }) => {
  const navigate = useNavigate();
  const { textSize, setTextSize, highContrast, toggleHighContrast } = useAccessibility();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const isNative = isNativeApp();

  const textSizeLabels: Record<TextSize, string> = {
    normal: 'A',
    large: 'A+',
    xlarge: 'A++',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <Link
          to={museumSlug ? `/museum/${museumSlug}` : '/'}
          className="flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#214E86] flex items-center justify-center text-white shadow-xs group-hover:bg-[#17365F] transition-colors">
            <Landmark className="w-5 h-5 text-[#EAF2FA]" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#214E86] block">
              {isNative ? 'Museum Visitor Companion' : 'National Digital Guide'}
            </span>
            <span className="text-base sm:text-lg font-bold text-[#172033] tracking-tight line-clamp-1">
              {museumTitle || 'Digital Museum Platform'}
            </span>
          </div>
        </Link>

        {/* Center Nav (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-[#172033]">
          <Link
            to="/museum/gmu-heritage-museum"
            className="hover:text-[#214E86] transition-colors flex items-center space-x-1.5"
          >
            <Compass className="w-4 h-4 text-[#214E86]" />
            <span>Explore Galleries</span>
          </Link>

          {/* Only show Download App on Web browser, NEVER inside the Android App */}
          {!isNative && (
            <a
              href="/downloads/gmu-museum-guide.apk"
              download="gmu-museum-guide.apk"
              className="hover:text-[#214E86] transition-colors flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download Android App (APK)</span>
            </a>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Search */}
          <button
            onClick={() => navigate('/search')}
            aria-label="Search exhibits"
            className="p-2 rounded-lg text-[#64748B] hover:text-[#214E86] hover:bg-[#EAF2FA] transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Scan QR Button */}
          <Link
            to="/scan"
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#214E86] text-white text-sm font-semibold hover:bg-[#17365F] shadow-xs active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">Scan QR</span>
            <span className="sm:hidden">Scan</span>
          </Link>

          {/* Accessibility Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowA11yMenu(!showA11yMenu)}
              aria-label="Accessibility options"
              className={`p-2 rounded-lg transition-colors ${
                highContrast || textSize !== 'normal'
                  ? 'bg-[#EAF2FA] text-[#214E86] font-bold'
                  : 'text-[#64748B] hover:text-[#214E86] hover:bg-[#EAF2FA]'
              }`}
            >
              <Type className="w-5 h-5" />
            </button>

            {/* Accessibility Dropdown */}
            {showA11yMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-2 pb-2 border-b border-[#E2E8F0]">
                  Display & Accessibility
                </div>

                <div className="py-2">
                  <div className="text-xs font-medium text-[#172033] px-2 mb-1.5">
                    Text Size
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-[#FBFCFD] p-1 rounded-xl border border-[#E2E8F0]">
                    {(['normal', 'large', 'xlarge'] as TextSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setTextSize(size)}
                        className={`py-1 rounded-lg text-xs font-bold transition-all ${
                          textSize === size
                            ? 'bg-[#214E86] text-white shadow-xs'
                            : 'text-[#64748B] hover:text-[#172033]'
                        }`}
                      >
                        {textSizeLabels[size]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={toggleHighContrast}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-[#172033] hover:bg-[#EAF2FA] transition-colors"
                  >
                    <span className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-[#214E86]" />
                      <span>High Contrast</span>
                    </span>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        highContrast ? 'bg-[#214E86]' : 'bg-gray-300'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Dashboard link on web only */}
          {!isNative && (
            isAuthenticated ? (
              <Link
                to="/admin"
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#172033] hover:bg-[#EAF2FA] transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#214E86]" />
                <span>Admin ({user?.role})</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="hidden md:flex items-center space-x-1 text-xs font-semibold text-[#172033] hover:text-[#214E86] transition-colors px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#EAF2FA]"
              >
                <span>Admin Login</span>
              </Link>
            )
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#214E86]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link
            to="/museum/gmu-heritage-museum"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#172033] hover:bg-[#EAF2FA]"
          >
            Explore Galleries
          </Link>

          {!isNative && (
            <a
              href="/downloads/gmu-museum-guide.apk"
              download="gmu-museum-guide.apk"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Download Android App (APK)</span>
            </a>
          )}

          <Link
            to="/scan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#214E86] bg-[#EAF2FA] font-semibold"
          >
            Scan Exhibit QR
          </Link>

          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#172033] hover:bg-[#EAF2FA]"
          >
            Search Exhibits
          </Link>

          {!isNative && (
            <div className="border-t border-[#E2E8F0] pt-2">
              {isAuthenticated ? (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#214E86]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#214E86] hover:underline"
                >
                  Staff / Admin Portal Login
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
