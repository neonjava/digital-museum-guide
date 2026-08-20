import React from 'react';
import { Landmark, QrCode, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isNativeApp } from '../../utils/platform';

export const Footer: React.FC = () => {
  const isNative = isNativeApp();

  return (
    <footer className="border-t border-[#E2E8F0] bg-white py-8 mt-12 transition-colors">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-[#214E86]" />
            <span className="font-semibold text-[#172033]">
              Digital Museum QR Guide Platform
            </span>
            <span>•</span>
            <span>Empowering Museums with Smart Visitor Narratives</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/scan" className="hover:text-[#214E86] flex items-center space-x-1">
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Scanner</span>
            </Link>
            <Link to="/search" className="hover:text-[#214E86]">
              Exhibit Search
            </Link>
            {!isNative && (
              <Link to="/admin/login" className="hover:text-[#214E86] flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Staff Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
