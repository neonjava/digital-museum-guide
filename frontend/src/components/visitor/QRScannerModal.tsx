import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Capacitor } from '@capacitor/core';
import {
  QrCode,
  X,
  Camera,
  AlertCircle,
  RefreshCw,
  Flashlight,
  ExternalLink,
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

      // Check if it's a URL to this application
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const url = new URL(trimmed);
        const path = url.pathname;
        const urlShortMatch = path.match(/\/a\/([a-zA-Z0-9_-]+)/i);
        if (urlShortMatch && urlShortMatch[1]) {
          return urlShortMatch[1];
        }
        const urlLongMatch = path.match(/\/artifact\/([a-zA-Z0-9_-]+)/i);
        if (urlLongMatch && urlLongMatch[1]) {
          return urlLongMatch[1];
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
      // Stop scanner and navigate to artifact page
      await stopScanner();
      onClose();
      navigate(`/a/${artifactId}?src=qr`);
    } else {
      // Show friendly unsupported QR error as specified in requirement 31
      setErrorMessage(
        'Invalid or unsupported museum QR code. Please scan a museum exhibit QR code.'
      );
    }
  };

  const startWebScanner = async () => {
    setErrorMessage(null);
    setIsScanning(true);

    try {
      // Ensure any existing instance is stopped
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
          fps: 10,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (_error) => {
          // Continuous frame error, normal when looking for QR
        }
      );
      setHasPermission(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      setErrorMessage(
        'Camera permission was denied or camera is not available. Please allow camera access in your browser settings.'
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
      // Small timeout to allow DOM container to render
      const timer = setTimeout(() => {
        startWebScanner();
      }, 200);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="w-full max-w-md flex items-center justify-between text-white pt-2">
        <div className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-museum-light" />
          <span className="font-bold text-base">Exhibit Scanner</span>
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
        {errorMessage ? (
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
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-5 rounded-2xl bg-museum-primary text-white font-bold hover:bg-museum-hover shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        ) : (
          <div className="relative w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden border-2 border-museum-light/50 bg-black/60 shadow-2xl flex items-center justify-center">
            {/* HTML5 QR Code Container */}
            <div id={scannerContainerId} className="w-full h-full object-cover" />

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-56 h-56 border-2 border-museum-light/80 rounded-2xl relative">
                {/* Corner Highlights */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg" />

                {/* Animated Scan Line */}
                <div className="absolute inset-x-0 h-0.5 bg-museum-light shadow-[0_0_12px_#EAF2FA] animate-[bounce_2.5s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        )}

        <p className="text-white/80 text-xs sm:text-sm text-center mt-4 max-w-xs">
          Point your camera at the QR code placed next to any physical museum artifact.
        </p>
      </div>

      {/* Footer info / Test artifact shortcut */}
      <div className="w-full max-w-md pb-4 text-center">
        <div className="inline-flex items-center space-x-2 text-xs text-white/60 bg-white/5 px-3 py-1.5 rounded-full">
          <span>Supported: Museum App Links, Deep Links & Exhibit URLs</span>
        </div>
      </div>
    </div>
  );
};
