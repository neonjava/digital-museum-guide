import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
  ExternalLink,
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
  const publicUrl = `${window.location.origin}/a/${artifact.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('exhibit-qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR-${artifact.shortCode}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPNG = () => {
    const svgElement = document.getElementById('exhibit-qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1024, 1024);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `QR-${artifact.shortCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-museum-border my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="no-print p-4 border-b border-museum-border flex items-center justify-between bg-museum-bg">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-museum-primary" />
            <span className="font-serif font-bold text-sm text-museum-text">
              Exhibition QR Placard Card
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-museum-muted hover:text-museum-text hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Exhibit Card Content */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4 print:p-0 print:border-none">
          <div className="w-full border-2 border-museum-primary rounded-3xl p-6 sm:p-8 bg-linear-to-b from-museum-light/30 via-white to-white space-y-4 shadow-xs relative">
            {/* Museum Header Info */}
            <div className="flex items-center justify-center space-x-2 text-museum-primary border-b border-museum-border/60 pb-3">
              <Landmark className="w-5 h-5" />
              <span className="font-serif font-bold text-sm tracking-wider uppercase">
                {museum?.name || 'Heritage Museum'}
              </span>
            </div>

            {/* Artifact Name */}
            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-museum-muted block mb-1">
                Official Digital Guide
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-museum-text leading-snug">
                {artifact.name}
              </h2>
              {artifact.locationInsideMuseum && (
                <span className="inline-flex items-center space-x-1 text-xs text-museum-primary font-semibold mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{artifact.locationInsideMuseum}</span>
                </span>
              )}
            </div>

            {/* High Resolution SVG QR Code */}
            <div className="p-4 bg-white rounded-2xl border border-museum-border/80 shadow-qr inline-block my-2">
              <QRCodeSVG
                id="exhibit-qr-svg"
                value={publicUrl}
                size={220}
                level="H"
                fgColor="#214E86" // Museum deep blue
                bgColor="#FFFFFF"
              />
            </div>

            {/* Call To Action Banner */}
            <div className="space-y-1 pt-1">
              <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-museum-primary text-white text-xs font-bold shadow-xs">
                <Headphones className="w-3.5 h-3.5" />
                <span>Scan for Audio Narration & Video</span>
              </div>
              <p className="text-[11px] text-museum-muted tracking-tight pt-1">
                Point your phone camera at this QR code • No account required
              </p>
            </div>

            {/* Short Code Badge */}
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-museum-border/40">
              URL: {publicUrl}
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden when printing) */}
        <div className="no-print p-4 bg-museum-bg border-t border-museum-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-museum-primary text-white text-xs font-bold hover:bg-museum-hover shadow-xs active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Card</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-white border border-museum-border text-xs font-semibold text-museum-text hover:bg-museum-light transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PNG</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-white border border-museum-border text-xs font-semibold text-museum-text hover:bg-museum-light transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SVG</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-museum-border text-xs font-semibold text-museum-text hover:bg-museum-light transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-museum-muted" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
