import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Landmark,
  ChevronLeft,
  Headphones,
  Film,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Section, Artifact, Museum } from '../../types';
import { api } from '../../services/api';

export const SectionPage: React.FC = () => {
  const { museumId, sectionId } = useParams<{ museumId: string; sectionId: string }>();
  const [section, setSection] = useState<Section | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSectionArtifacts = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/public/section/${sectionId}/artifacts`);
        if (res.success && res.data) {
          setSection(res.data.section);
          setArtifacts(res.data.artifacts);
        }
      } catch (err) {
        console.error('Error loading section artifacts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (sectionId) {
      fetchSectionArtifacts();
    }
  }, [sectionId]);

  const filteredArtifacts = artifacts.filter((art) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      art.name.toLowerCase().includes(term) ||
      art.shortDescription.toLowerCase().includes(term) ||
      art.tags?.some((t) => t.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-museum-bg">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-museum-muted">
          <Link to="/" className="hover:text-museum-primary">
            Museums
          </Link>
          <span>/</span>
          <Link to={`/museum/${museumId}`} className="hover:text-museum-primary font-medium">
            {typeof section?.museumId === 'object' ? (section.museumId as Museum).name : 'Museum'}
          </Link>
          <span>/</span>
          <span className="text-museum-text font-bold truncate">{section?.name || 'Gallery'}</span>
        </div>

        {/* Section Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-card border border-museum-border p-6 sm:p-10">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-museum-light text-xs font-semibold backdrop-blur-xs">
              <Layers className="w-3.5 h-3.5" />
              <span>Gallery Collection</span>
            </span>

            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight">
              {section?.name}
            </h1>

            <p className="text-sm sm:text-base text-museum-light/90 leading-relaxed font-normal">
              {section?.description}
            </p>
          </div>
        </div>

        {/* Search within Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-museum-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter gallery exhibits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary"
            />
          </div>

          <span className="text-xs text-museum-muted font-medium self-end sm:self-center">
            Showing {filteredArtifacts.length} exhibit{filteredArtifacts.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Exhibits Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredArtifacts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-museum-border">
            <p className="text-base font-bold text-museum-text">No exhibits found</p>
            <p className="text-xs text-museum-muted mt-1">
              Try adjusting your search filter or explore another gallery.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredArtifacts.map((artifact) => {
              const coverImg =
                artifact.images?.find((img) => img.isCover)?.url ||
                artifact.images?.[0]?.url ||
                'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';

              return (
                <Link
                  key={artifact._id}
                  to={`/a/${artifact.shortCode}`}
                  className="group rounded-3xl overflow-hidden bg-white border border-museum-border shadow-card hover:shadow-elevated transition-all flex flex-col"
                >
                  <div className="h-48 bg-slate-800 relative overflow-hidden">
                    <img
                      src={coverImg}
                      alt={artifact.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                      }}
                      className="absolute inset-0"
                    />

                    {/* Media Badges */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                      {artifact.audioNarration?.url && (
                        <span className="p-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-museum-light" title="Audio Guide Included">
                          <Headphones className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {artifact.video?.url && (
                        <span className="p-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-museum-light" title="Video Documentary">
                          <Film className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {artifact.locationInsideMuseum && (
                      <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center space-x-1 text-xs drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-museum-light shrink-0" />
                        <span className="truncate">{artifact.locationInsideMuseum}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {artifact.datePeriod && (
                        <span className="text-xs font-bold text-museum-primary uppercase tracking-wider block mb-1">
                          {artifact.datePeriod}
                        </span>
                      )}
                      <h3 className="font-serif font-bold text-base sm:text-lg text-museum-text group-hover:text-museum-primary transition-colors line-clamp-2">
                        {artifact.name}
                      </h3>
                      <p className="text-xs text-museum-muted line-clamp-2 mt-1.5 leading-relaxed">
                        {artifact.shortDescription}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-museum-primary border-t border-museum-border/40">
                      <span>Open Guide</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
