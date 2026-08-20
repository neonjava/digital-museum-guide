import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import {
  QrCode,
  Printer,
  Download,
  Copy,
  Check,
  X,
  Landmark,
  Headphones,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Artifact, Museum, Section } from '../../types';

interface QRPrintCardModalProps {
  artifact: Artifact;
  museum?: Museum;
  section?: Section;
  onClose: () => void;
}

export const QRPrintCardModal: React.FC<QRPrintCardModalProps> = ({
  artifact,
  museum,
  section,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const publicUrl = `https://gmu-museum.netlify.app/a/${artifact.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Exports ONLY the museum placard card itself as a crisp high-res PNG image
  const handleDownloadCardPNG = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3, // High DPI / Crisp print resolution
        backgroundColor: '#FFFFFF',
      });
      const link = document.createElement('a');
      link.download = `${artifact.shortCode}-${artifact.name.replace(/[^a-zA-Z0-9]/g, '_')}-placard.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting card PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E2E8F0] my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="no-print p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FBFCFD]">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-[#214E86]" />
            <span className="font-serif font-bold text-sm text-[#172033]">
              Exhibition QR Placard
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-[#EAF2FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Card Container that is exported as PNG */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center print:p-0 print:border-none">
          <div
            ref={cardRef}
            className="w-full border-2 border-[#214E86] rounded-3xl p-6 sm:p-8 bg-white space-y-4 shadow-sm relative text-center"
          >
            {/* Museum Header Info */}
            <div className="flex items-center justify-center space-x-2 text-[#214E86] border-b border-[#E2E8F0] pb-3">
              <Landmark className="w-5 h-5 text-[#214E86]" />
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wider uppercase">
                {museum?.name || 'National Heritage Museum'}
              </span>
            </div>

            {/* Exhibit Name & Details */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#64748B] block">
                Official Digital Audio Guide
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-[#172033] leading-snug">
                {artifact.name}
              </h2>
              {artifact.locationInsideMuseum && (
                <span className="inline-flex items-center space-x-1 text-xs text-[#214E86] font-semibold mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{artifact.locationInsideMuseum}</span>
                </span>
              )}
            </div>

            {/* High-Contrast SVG QR Code */}
            <div className="p-4 bg-white rounded-2xl border border-[#CBD5E1] shadow-md inline-block my-2">
              <QRCodeSVG
                value={publicUrl}
                size={210}
                level="H"
                fgColor="#17365F"
                bgColor="#FFFFFF"
              />
            </div>

            {/* Action Callout */}
            <div className="space-y-1.5 pt-1">
              <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#214E86] text-white text-xs font-bold shadow-sm">
                <Headphones className="w-3.5 h-3.5 text-amber-300" />
                <span>Scan for Audio Narration & Video Story</span>
              </div>
              <p className="text-[11px] text-[#64748B] tracking-tight">
                Point your phone camera at this QR code • No app download needed
              </p>
            </div>

            {/* Clean Exhibit Identifier */}
            <div className="text-[11px] font-bold text-[#214E86] pt-2 border-t border-[#E2E8F0] tracking-widest uppercase font-mono">
              Exhibit ID: {artifact.shortCode}
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="no-print p-4 bg-[#FBFCFD] border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadCardPNG}
              disabled={isExporting}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#214E86] text-white text-xs font-bold hover:bg-[#17365F] shadow-sm active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PNG...' : 'Download Placard (PNG)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#172033] hover:bg-[#EAF2FA] transition-colors"
            >
              <Printer className="w-4 h-4 text-[#214E86]" />
              <span>Print</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#172033] hover:bg-[#EAF2FA] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
