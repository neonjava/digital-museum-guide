import React, { useState } from 'react';
import { ArtifactImage } from '../../types';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface ImageGalleryProps {
  images: ArtifactImage[];
  artifactName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, artifactName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-56 rounded-3xl bg-[#EAF2FA] border border-[#CBD5E1] flex flex-col items-center justify-center text-[#64748B]">
        <ImageIcon className="w-10 h-10 mb-2 text-[#214E86]" />
        <span className="text-xs font-semibold">No images available for this exhibit</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Image Container: Strictly constrained height so it never fills the entire screen */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="relative group w-full h-64 sm:h-80 md:h-[380px] rounded-3xl overflow-hidden bg-slate-950 shadow-md cursor-zoom-in border border-[#CBD5E1] flex items-center justify-center"
      >
        <img
          src={currentImage.url}
          alt={currentImage.caption || artifactName}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
          loading="eager"
        />

        {/* Fullscreen Expand Badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          aria-label="View fullscreen image"
          className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrows for multi-image exhibits */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-left">
            <p className="text-xs text-slate-100 font-medium line-clamp-1">
              {currentImage.caption}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-900 ${
                selectedIndex === idx
                  ? 'border-[#214E86] shadow-sm scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.caption || `Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen"
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={currentImage.url}
            alt={currentImage.caption || artifactName}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
