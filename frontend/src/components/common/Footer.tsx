import React from 'react';
import { Landmark, QrCode, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-museum-border/60 bg-white py-8 mt-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-museum-muted">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-museum-primary" />
            <span className="font-semibold text-museum-text">
              Digital Museum QR Guide Platform
            </span>
            <span>•</span>
            <span>Empowering Museums with Smart Visitor Narratives</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/scan" className="hover:text-museum-primary flex items-center space-x-1">
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Scanner</span>
            </Link>
            <Link to="/search" className="hover:text-museum-primary">
              Exhibit Search
            </Link>
            <Link to="/admin/login" className="hover:text-museum-primary flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
