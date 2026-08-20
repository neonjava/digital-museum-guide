import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Landmark,
  Layers,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Museums', path: '/admin/museums', icon: Landmark },
    { label: 'Sections & Galleries', path: '/admin/sections', icon: Layers },
    { label: 'Artifacts', path: '/admin/artifacts', icon: Sparkles },
    { label: 'QR Code Studio', path: '/admin/qr-codes', icon: QrCode },
    { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-museum-bg flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-museum-border shrink-0 select-none">
        {/* Brand header */}
        <div className="p-6 border-b border-museum-border">
          <Link to="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-museum-primary flex items-center justify-center text-white shadow-xs">
              <Landmark className="w-5 h-5 text-museum-light" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-museum-primary block">
                Management
              </span>
              <span className="font-serif font-bold text-base text-museum-text">
                Museum Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-museum-primary text-white font-semibold shadow-xs'
                    : 'text-museum-text hover:bg-museum-light/60 hover:text-museum-primary'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-museum-muted'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Public shortcut */}
        <div className="p-4 border-t border-museum-border space-y-3 bg-museum-bg/50">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-museum-border text-xs font-semibold text-museum-text hover:text-museum-primary transition-colors"
          >
            <span>Open Visitor Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-museum-muted" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="min-w-0 flex-1 mr-2">
              <span className="text-xs font-bold text-museum-text block truncate">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[11px] font-semibold text-museum-primary block">
                {user?.role || 'MUSEUM_ADMIN'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="p-2 rounded-xl text-museum-muted hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden bg-white border-b border-museum-border px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link to="/admin" className="flex items-center space-x-2">
          <Landmark className="w-6 h-6 text-museum-primary" />
          <span className="font-serif font-bold text-museum-text text-base">Museum Admin</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg text-museum-muted hover:text-museum-primary"
            aria-label="Toggle navigation drawer"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-b border-museum-border p-4 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-museum-primary text-white font-semibold'
                    : 'text-museum-text hover:bg-museum-light'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-museum-border flex items-center justify-between">
            <Link
              to="/"
              className="text-xs font-semibold text-museum-primary flex items-center space-x-1"
            >
              <span>Visitor Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-600 flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-museum-border px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-museum-text">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-museum-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center space-x-2 shrink-0">{actions}</div>}
        </div>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
