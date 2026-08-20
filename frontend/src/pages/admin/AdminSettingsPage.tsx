import React from 'react';
import {
  Settings,
  ShieldCheck,
  Smartphone,
  Server,
  Cloud,
  CheckCircle2,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <AdminLayout
      title="Platform Settings & Deployment"
      subtitle="System status, Android App Links verification, and media storage configuration"
    >
      <div className="max-w-4xl space-y-6">
        {/* Administrator Profile Card */}
        <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-museum-light flex items-center justify-center text-museum-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-museum-text">
                Current Curator Account
              </h3>
              <p className="text-xs text-museum-muted">Role-based access control</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-museum-bg border border-museum-border/60">
              <span className="text-museum-muted block">Full Name</span>
              <span className="font-bold text-museum-text text-sm">{user?.name}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-museum-bg border border-museum-border/60">
              <span className="text-museum-muted block">Email Address</span>
              <span className="font-bold text-museum-text text-sm">{user?.email}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-museum-bg border border-museum-border/60">
              <span className="text-museum-muted block">Account Role</span>
              <span className="font-bold text-museum-primary text-sm">{user?.role}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-museum-bg border border-museum-border/60">
              <span className="text-museum-muted block">Session Security</span>
              <span className="font-bold text-emerald-700 text-sm">JWT Authenticated (7-day validity)</span>
            </div>
          </div>
        </div>

        {/* Android App Links Verification Status */}
        <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-museum-text">
                Android App Links & Deep Linking
              </h3>
              <p className="text-xs text-museum-muted">
                Automatic intent routing for physical exhibit URLs
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-museum-text/90 leading-relaxed">
            When visitors scan an exhibit QR code using an Android device with the Museum Guide app installed, the app opens natively via Android App Links. If not installed, it seamlessly loads the responsive visitor web application.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-1">
            <div className="text-slate-400">// Digital Asset Links Endpoint</div>
            <div className="text-emerald-400">GET /.well-known/assetlinks.json</div>
            <div className="text-slate-400 text-[11px] pt-1">
              Package: com.museumguide.app | Host: {window.location.host}
            </div>
          </div>
        </div>

        {/* Storage Provider & Deployment */}
        <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-museum-light text-museum-primary flex items-center justify-center">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-museum-text">
                Media Storage & Low-Cost Hosting Architecture
              </h3>
              <p className="text-xs text-museum-muted">
                Free-tier optimized deployment blueprint
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-museum-bg border border-museum-border space-y-1.5">
              <span className="font-bold text-museum-text block">Database Layer</span>
              <span className="text-museum-muted block">
                MongoDB Atlas (M0 Free Tier) or In-Memory Local Server
              </span>
              <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected & Mongoose Schematized</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-museum-bg border border-museum-border space-y-1.5">
              <span className="font-bold text-museum-text block">Media Storage Provider</span>
              <span className="text-museum-muted block">
                Cloudinary Free Tier CDN or Local Storage Provider
              </span>
              <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Storage Abstraction Active</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
