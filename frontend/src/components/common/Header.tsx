import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Download,
  Compass,
} from 'lucide-react';
import { useAccessibility, TextSize } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  museumTitle?: string;
  museumSlug?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ museumTitle, museumSlug }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { textSize, setTextSize, highContrast, toggleHighContrast } = useAccessibility();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showA11yMenu, setShowA11yMenu] = useState(false);

  const textSizeLabels: Record<TextSize, string> = {
    normal: 'A',
    large: 'A+',
    xlarge: 'A++',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-museum-border/60 transition-colors shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <Link
          to={museumSlug ? `/museum/${museumSlug}` : '/'}
          className="flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-museum-primary flex items-center justify-center text-white shadow-xs group-hover:bg-museum-hover transition-colors">
            <Landmark className="w-5 h-5 text-museum-light" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-museum-primary block">
              GMU Heritage
            </span>
            <span className="text-base sm:text-lg font-bold text-museum-text tracking-tight line-clamp-1">
              {museumTitle || 'Digital Museum Guide'}
            </span>
          </div>
        </Link>

        {/* Center Nav (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-museum-text">
          <Link
            to="/museum/gmu-heritage-museum"
            className="hover:text-museum-primary transition-colors flex items-center space-x-1.5"
          >
            <Compass className="w-4 h-4 text-museum-primary" />
            <span>Explore Museum</span>
          </Link>
          <a
            href="/downloads/gmu-museum-guide.apk"
            download="gmu-museum-guide.apk"
            className="hover:text-museum-primary transition-colors flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download App (APK)</span>
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Search */}
          <button
            onClick={() => navigate('/search')}
            aria-label="Search exhibits"
            className="p-2 rounded-lg text-museum-muted hover:text-museum-primary hover:bg-museum-light/50 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Scan QR Button (Visitor Hero Action) */}
          <Link
            to="/scan"
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-museum-primary text-white text-sm font-semibold hover:bg-museum-hover shadow-xs active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4 text-museum-light animate-pulse" />
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
                  ? 'bg-museum-light text-museum-primary font-bold'
                  : 'text-museum-muted hover:text-museum-primary hover:bg-museum-light/50'
              }`}
            >
              <Type className="w-5 h-5" />
            </button>

            {/* Accessibility Dropdown */}
            {showA11yMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-museum-border shadow-elevated p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-xs font-bold text-museum-muted uppercase tracking-wider px-2 pb-2 border-b border-museum-border/40">
                  Display & Accessibility
                </div>

                <div className="py-2">
                  <div className="text-xs font-medium text-museum-text px-2 mb-1.5">
                    Text Size
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-museum-bg p-1 rounded-xl border border-museum-border/60">
                    {(['normal', 'large', 'xlarge'] as TextSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setTextSize(size)}
                        className={`py-1 rounded-lg text-xs font-bold transition-all ${
                          textSize === size
                            ? 'bg-museum-primary text-white shadow-xs'
                            : 'text-museum-muted hover:text-museum-text'
                        }`}
                      >
                        {textSizeLabels[size]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-museum-border/40">
                  <button
                    onClick={toggleHighContrast}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-museum-text hover:bg-museum-light/60 transition-colors"
                  >
                    <span className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-museum-primary" />
                      <span>High Contrast</span>
                    </span>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        highContrast ? 'bg-museum-primary' : 'bg-gray-300'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Dashboard link or Mobile Menu */}
          {isAuthenticated ? (
            <Link
              to="/admin"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-museum-border text-xs font-semibold text-museum-text hover:bg-museum-light transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-museum-primary" />
              <span>Admin ({user?.role})</span>
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="hidden md:flex items-center space-x-1 text-xs font-semibold text-museum-text hover:text-museum-primary transition-colors px-2.5 py-1.5 rounded-lg border border-museum-border hover:bg-museum-light"
            >
              <span>Admin Login</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-museum-muted hover:text-museum-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-museum-border bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link
            to="/museum/gmu-heritage-museum"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-museum-text hover:bg-museum-light"
          >
            Explore GMU Museum
          </Link>
          <a
            href="/downloads/gmu-museum-guide.apk"
            download="gmu-museum-guide.apk"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200"
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Download Android App (APK)</span>
          </a>
          <Link
            to="/scan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-museum-primary bg-museum-light/60 font-semibold"
          >
            Scan Exhibit QR
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-museum-text hover:bg-museum-light"
          >
            Search Exhibits
          </Link>
          <div className="border-t border-museum-border pt-2">
            {isAuthenticated ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold text-museum-primary"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-museum-primary hover:underline"
              >
                Staff / Admin Portal Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
