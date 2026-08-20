import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Landmark,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Layers,
  ChevronRight,
  QrCode,
  Search,
  Sparkles,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { QRScannerModal } from '../../components/visitor/QRScannerModal';
import { Museum, Section } from '../../types';
import { api } from '../../services/api';

export const MuseumPage: React.FC = () => {
  const { museumId } = useParams<{ museumId: string }>();
  const [museum, setMuseum] = useState<Museum | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMuseumDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/public/museum/${museumId}`);
        if (res.success && res.data) {
          setMuseum(res.data.museum);
          setSections(res.data.sections);
        }
      } catch (err) {
        console.error('Error loading museum:', err);
      } finally {
        setLoading(false);
      }
    };

    if (museumId) {
      fetchMuseumDetails();
    }
  }, [museumId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-museum-bg">
        <Header />
        <div className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-6 animate-pulse">
          <div className="h-64 rounded-3xl bg-slate-200" />
          <div className="h-8 w-1/3 bg-slate-200 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-40 bg-slate-200 rounded-2xl" />
            <div className="h-40 bg-slate-200 rounded-2xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!museum) {
    return (
      <div className="min-h-screen flex flex-col bg-museum-bg">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Landmark className="w-16 h-16 text-museum-muted mb-4" />
          <h2 className="text-2xl font-bold text-museum-text">Museum Not Found</h2>
          <p className="text-sm text-museum-muted mt-2 mb-6">
            The requested museum could not be found or is currently inactive.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-museum-primary text-white font-semibold hover:bg-museum-hover"
          >
            Return to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-museum-bg">
      <Header museumTitle={museum.name} museumSlug={museum.slug} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-8">
        {/* Cover Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-card border border-museum-border">
          <div className="relative h-64 sm:h-80 w-full">
            <img
              src={
                museum.coverImage ||
                'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1600&q=80'
              }
              alt={museum.name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-t from-museum-dark via-museum-dark/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="px-3 py-1 rounded-full bg-museum-primary/80 border border-white/20 text-xs font-semibold text-museum-light uppercase tracking-wider backdrop-blur-xs">
                  Heritage Collection
                </span>
                <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight">
                  {museum.name}
                </h1>
                {museum.address?.city && (
                  <p className="flex items-center space-x-1.5 text-xs sm:text-sm text-museum-light/90">
                    <MapPin className="w-4 h-4 text-museum-light flex-shrink-0" />
                    <span>
                      {museum.address.street ? `${museum.address.street}, ` : ''}
                      {museum.address.city}, {museum.address.state}
                    </span>
                  </p>
                )}
              </div>

              {/* QR Scan Button */}
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-museum-primary font-bold text-sm hover:bg-museum-light shadow-lg active:scale-95 transition-all"
              >
                <QrCode className="w-5 h-5 text-museum-primary" />
                <span>Scan Exhibit QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Museum Description & Practical Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-museum-border shadow-card space-y-4">
            <h2 className="text-xl font-serif font-bold text-museum-primary">
              About the Museum
            </h2>
            <p className="text-sm sm:text-base text-museum-text/90 leading-relaxed font-normal">
              {museum.description || 'Welcome to this digital museum guide.'}
            </p>
          </div>

          {/* Practical Info Card */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-museum-light/60 to-white border border-museum-border shadow-card space-y-4 text-xs sm:text-sm">
            <h3 className="font-serif font-bold text-base text-museum-primary flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Visitor Information</span>
            </h3>

            <div className="space-y-3 pt-1">
              <div>
                <span className="font-semibold text-museum-dark block">Opening Hours</span>
                <span className="text-museum-muted">{museum.openingHours}</span>
              </div>

              {museum.contact?.email && (
                <div>
                  <span className="font-semibold text-museum-dark block">Inquiries</span>
                  <a
                    href={`mailto:${museum.contact.email}`}
                    className="text-museum-primary hover:underline"
                  >
                    {museum.contact.email}
                  </a>
                </div>
              )}

              {museum.contact?.phone && (
                <div>
                  <span className="font-semibold text-museum-dark block">Phone</span>
                  <span className="text-museum-muted">{museum.contact.phone}</span>
                </div>
              )}

              {museum.website && (
                <div>
                  <span className="font-semibold text-museum-dark block">Website</span>
                  <a
                    href={museum.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-museum-primary hover:underline flex items-center space-x-1"
                  >
                    <span>Visit Official Site</span>
                    <Globe className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Galleries / Sections Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-museum-text flex items-center space-x-2">
                <Layers className="w-6 h-6 text-museum-primary" />
                <span>Museum Galleries & Wings</span>
              </h2>
              <p className="text-xs sm:text-sm text-museum-muted mt-0.5">
                Explore the curated collections and digital artifact guides
              </p>
            </div>
          </div>

          {sections.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-museum-border">
              <p className="text-sm text-museum-muted">No sections registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sections.map((section) => (
                <Link
                  key={section._id}
                  to={`/museum/${museum.slug || museum._id}/section/${section._id}`}
                  className="group rounded-3xl overflow-hidden bg-white border border-museum-border shadow-card hover:shadow-elevated transition-all flex flex-col"
                >
                  <div className="h-44 bg-slate-800 relative overflow-hidden">
                    <img
                      src={
                        section.coverImage ||
                        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={section.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-semibold">
                        {section.artifactCount || 0} Exhibits
                      </span>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-white mt-1.5 line-clamp-1">
                        {section.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs sm:text-sm text-museum-muted line-clamp-2 leading-relaxed">
                      {section.description || 'Explore the exhibits in this gallery.'}
                    </p>

                    <div className="flex items-center justify-between text-xs font-bold text-museum-primary pt-2 border-t border-museum-border/40">
                      <span>Browse Gallery Exhibits</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
