import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import {
  QrCode,
  X,
  Camera,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [scannedArtifact, setScannedArtifact] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'interactive-qr-scanner-element';

  // Helper to extract artifact shortCode or redirect path from scanned QR text
  const parseScannedCode = (decodedText: string): string | null => {
    try {
      const trimmed = decodedText.trim();

      // Check format: /a/art_8f29d2 or /artifact/art_8f29d2
      const shortRouteMatch = trimmed.match(/\/a\/([a-zA-Z0-9_-]+)/i);
      if (shortRouteMatch && shortRouteMatch[1]) {
        return shortRouteMatch[1];
      }

      const longRouteMatch = trimmed.match(/\/artifact\/([a-zA-Z0-9_-]+)/i);
      if (longRouteMatch && longRouteMatch[1]) {
        return longRouteMatch[1];
      }

      // If text directly contains art_xxx
      if (trimmed.startsWith('art_')) {
        return trimmed;
      }

      // If text is alphanumeric exhibit code
      if (/^[a-zA-Z0-9_-]{6,30}$/.test(trimmed)) {
        return trimmed;
      }

      // Check if it's a URL
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('museumguide://')) {
        const parts = trimmed.split('/');
        const lastPart = parts[parts.length - 1]?.split('?')[0];
        if (lastPart && (lastPart.startsWith('art_') || parts.includes('a') || parts.includes('artifact'))) {
          return lastPart;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    const artifactId = parseScannedCode(decodedText);

    if (artifactId) {
      // Trigger haptic feedback if supported on device
      if (navigator.vibrate) {
        try {
          navigator.vibrate([60, 40, 80]);
        } catch {
          // ignore
        }
      }

      setScannedArtifact(artifactId);

      // Play short success animation, then navigate
      await stopScanner();
      setTimeout(() => {
        onClose();
        navigate(`/a/${artifactId}?src=qr`);
      }, 700);
    } else {
      setErrorMessage(
        'QR code format not recognized. Please scan a museum exhibit QR placard.'
      );
    }
  };

  const startWebScanner = async () => {
    setErrorMessage(null);
    setScannedArtifact(null);
    setIsScanning(true);

    try {
      if (qrScannerRef.current) {
        try {
          await qrScannerRef.current.stop();
        } catch {
          // ignore
        }
      }

      const scanner = new Html5Qrcode(scannerContainerId);
      qrScannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 15,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (_error) => {
          // scanning frame
        }
      );
      setHasPermission(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      setErrorMessage(
        'Camera permission was not granted or camera is busy. Please allow camera access in your device settings.'
      );
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (qrScannerRef.current) {
      try {
        if (qrScannerRef.current.isScanning) {
          await qrScannerRef.current.stop();
        }
        qrScannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startWebScanner();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="w-full max-w-md flex items-center justify-between text-white pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="font-bold text-sm block">Museum Camera Scanner</span>
            <span className="text-[10px] text-slate-300">Point at physical QR placard</span>
          </div>
        </div>
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          aria-label="Close scanner"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Viewport & Target Box */}
      <div className="w-full max-w-md flex flex-col items-center my-auto">
        {scannedArtifact ? (
          /* Sleek Success Animation Overlay */
          <div className="w-full bg-emerald-950/90 border-2 border-emerald-400 rounded-3xl p-8 text-center text-white space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.6)] animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exhibit Placard Verified</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-white">
                Opening Audio Guide...
              </h3>
              <p className="text-xs text-emerald-200/80 mt-1 font-mono">
                Code: {scannedArtifact}
              </p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="w-full bg-white/10 border border-red-400/40 rounded-3xl p-6 text-center text-white space-y-4 backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-300">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-red-200 mb-1">
                QR Code Not Recognized
              </h4>
              <p className="text-sm text-white/80 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => {
                setErrorMessage(null);
                startWebScanner();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-5 rounded-2xl bg-[#214E86] text-white font-bold hover:bg-[#17365F] shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        ) : (
          <div className="relative w-full aspect-square max-w-[300px] rounded-3xl overflow-hidden border-2 border-white/40 bg-black/60 shadow-2xl flex items-center justify-center">
            {/* HTML5 QR Code Video Feed */}
            <div id={scannerContainerId} className="w-full h-full object-cover" />

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-52 h-52 border-2 border-white/80 rounded-2xl relative shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {/* 4 Corner Accents */}
                <div className="absolute -top-1 -left-1 w-7 h-7 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-7 h-7 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />

                {/* Animated Laser Scanning Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#F59E0B] animate-[bounce_2s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        )}

        {!scannedArtifact && (
          <p className="text-white/80 text-xs text-center mt-5 max-w-xs leading-relaxed">
            Hold your camera steady over the QR code placed on the museum glass stand.
          </p>
        )}
      </div>

      {/* Footer info */}
      <div className="w-full max-w-md pb-4 text-center">
        <div className="inline-flex items-center space-x-1.5 text-[11px] text-white/70 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
          <span>Instant Audio • High-Res Artifact Views</span>
        </div>
      </div>
    </div>
  );
};
