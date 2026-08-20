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
      <div className="w-full h-64 rounded-3xl bg-museum-light/50 border border-museum-border flex flex-col items-center justify-center text-museum-muted">
        <ImageIcon className="w-12 h-12 stroke-[1.5] mb-2" />
        <span className="text-sm font-medium">No images available for this exhibit</span>
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
      {/* Main Image Container */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="relative group w-full aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden bg-slate-900 shadow-card cursor-zoom-in border border-museum-border"
      >
        <img
          src={currentImage.url}
          alt={currentImage.caption || artifactName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="eager"
        />

        <div
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Fullscreen Expand Badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          aria-label="View fullscreen image"
          className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Caption Overlay */}
        {currentImage.caption && (
          <div className="absolute bottom-3 left-4 right-4 text-xs sm:text-sm text-white/90 font-medium drop-shadow-md">
            {currentImage.caption}
          </div>
        )}

        {/* Arrows for multi-image */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-museum-primary ring-2 ring-museum-primary/30 scale-95'
                  : 'border-transparent opacity-70 hover:opacity-100'
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
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen"
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl max-h-[85vh] relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.url}
              alt={currentImage.caption || artifactName}
              className="max-w-full max-h-[75vh] object-contain rounded-xl"
            />
            {currentImage.caption && (
              <p className="text-white/80 text-sm mt-3 text-center px-4">
                {currentImage.caption}
              </p>
            )}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-6 flex items-center space-x-4">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white text-xs font-semibold">
                {selectedIndex + 1} / {images.length}
              </span>
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
