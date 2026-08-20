import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QrCode, ArrowLeft, Landmark, RefreshCw } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { QRScannerModal } from '../../components/visitor/QRScannerModal';

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [manualCode, setManualCode] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(true);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      let code = manualCode.trim();
      if (code.includes('/a/')) {
        code = code.split('/a/')[1];
      }
      navigate(`/a/${code}?src=qr`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-museum-bg">
      <Header />

      <main className="flex-1 max-w-lg mx-auto px-4 py-8 w-full flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-museum-light border border-museum-primary/20 flex items-center justify-center text-museum-primary shadow-xs">
          <QrCode className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-museum-text">
            Artifact QR Scanner
          </h1>
          <p className="text-xs sm:text-sm text-museum-muted mt-2 max-w-sm">
            Scan the QR placard next to any museum exhibit or enter its code below.
          </p>
        </div>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-museum-primary text-white font-bold text-base hover:bg-museum-hover shadow-elevated active:scale-95 transition-all"
        >
          <QrCode className="w-5 h-5" />
          <span>Launch Camera Scanner</span>
        </button>

        {/* Manual Shortcode fallback */}
        <div className="w-full pt-6 border-t border-museum-border/60">
          <span className="text-xs font-semibold text-museum-muted uppercase tracking-wider block mb-3">
            Or Enter Exhibit Code
          </span>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. art_8f29d2"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-museum-border bg-white text-sm text-museum-text focus:outline-hidden focus:border-museum-primary"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-museum-dark text-white text-sm font-semibold hover:bg-museum-primary transition-colors"
            >
              Open
            </button>
          </form>
        </div>
      </main>

      <Footer />

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
