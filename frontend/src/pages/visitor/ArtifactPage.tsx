import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Landmark,
  MapPin,
  Calendar,
  UserCheck,
  Tag,
  Share2,
  QrCode,
  ArrowLeft,
  Headphones,
  BookOpen,
  Info,
  Check,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { ImageGallery } from '../../components/visitor/ImageGallery';
import { AudioPlayer } from '../../components/visitor/AudioPlayer';
import { VideoPlayer } from '../../components/visitor/VideoPlayer';
import { RichContentRenderer } from '../../components/visitor/RichContentRenderer';
import { QRPrintCardModal } from '../../components/admin/QRPrintCardModal';
import { Artifact, Museum, Section } from '../../types';
import { api } from '../../services/api';

export const ArtifactPage: React.FC = () => {
  const { artifactId } = useParams<{ artifactId: string }>();
  const [searchParams] = useSearchParams();
  const trafficSource = (searchParams.get('src') || 'WEB').toUpperCase();

  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [relatedArtifacts, setRelatedArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUnpublished, setIsUnpublished] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        setLoading(true);
        setIsUnpublished(false);
        const res = await api.get(`/public/artifact/${artifactId}`);

        if (res.success && res.data) {
          setArtifact(res.data.artifact);
          setRelatedArtifacts(res.data.relatedArtifacts || []);

          // Telemetry tracking: Record page view or QR scan event
          const eventType = trafficSource === 'QR' ? 'QR_SCAN' : 'PAGE_VIEW';
          const museumId = typeof res.data.artifact.museumId === 'object'
            ? res.data.artifact.museumId._id
            : res.data.artifact.museumId;
          const sectionId = typeof res.data.artifact.sectionId === 'object'
            ? res.data.artifact.sectionId._id
            : res.data.artifact.sectionId;

          api.post('/analytics/view', {
            artifactId: res.data.artifact._id,
            museumId,
            sectionId,
            eventType,
            source: trafficSource,
          }).catch(() => {});
        }
      } catch (err: any) {
        console.error('Error fetching artifact:', err);
        if (err.message && err.message.includes('unavailable')) {
          setIsUnpublished(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (artifactId) {
      fetchArtifact();
      window.scrollTo(0, 0);
    }
  }, [artifactId, trafficSource]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAudioTrackEvent = () => {
    if (!artifact) return;
    const museumId = typeof artifact.museumId === 'object' ? artifact.museumId._id : artifact.museumId;
    api.post('/analytics/track', {
      artifactId: artifact._id,
      museumId,
      eventType: 'AUDIO_PLAY',
      source: trafficSource,
    }).catch(() => {});
  };

  const handleVideoTrackEvent = () => {
    if (!artifact) return;
    const museumId = typeof artifact.museumId === 'object' ? artifact.museumId._id : artifact.museumId;
    api.post('/analytics/track', {
      artifactId: artifact._id,
      museumId,
      eventType: 'VIDEO_PLAY',
      source: trafficSource,
    }).catch(() => {});
  };

  const museum = artifact?.museumId as Museum | undefined;
  const section = artifact?.sectionId as Section | undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-museum-bg">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6 animate-pulse">
          <div className="h-6 w-1/3 bg-slate-200 rounded-lg" />
          <div className="h-80 bg-slate-200 rounded-3xl" />
          <div className="h-10 w-2/3 bg-slate-200 rounded-xl" />
          <div className="h-28 bg-slate-200 rounded-2xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isUnpublished) {
    return (
      <div className="min-h-screen flex flex-col bg-museum-bg">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-museum-text">Exhibit Unavailable</h2>
          <p className="text-sm text-museum-muted mt-2 mb-6 leading-relaxed">
            This exhibit is currently in curation or unavailable for public viewing.
          </p>
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-museum-primary text-white font-bold text-sm hover:bg-museum-hover"
          >
            Explore Other Exhibits
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="min-h-screen flex flex-col bg-museum-bg">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Landmark className="w-16 h-16 text-museum-muted mb-4" />
          <h2 className="text-2xl font-bold text-museum-text">Artifact Not Found</h2>
          <p className="text-sm text-museum-muted mt-2 mb-6">
            The scanned QR code or URL does not match any registered artifact.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-museum-primary text-white font-semibold hover:bg-museum-hover"
          >
            Explore Exhibits
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-museum-bg">
      <Header
        museumTitle={museum?.name}
        museumSlug={museum?.slug}
        showBack={true}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-museum-muted overflow-x-auto pb-1">
          <Link to="/" className="hover:text-museum-primary shrink-0">
            Museums
          </Link>
          <span>/</span>
          {museum && (
            <>
              <Link to={`/museum/${museum.slug || museum._id}`} className="hover:text-museum-primary font-medium shrink-0">
                {museum.name}
              </Link>
              <span>/</span>
            </>
          )}
          {section && (
            <>
              <Link
                to={`/museum/${museum?.slug || museum?._id}/section/${section._id}`}
                className="hover:text-museum-primary font-medium shrink-0"
              >
                {section.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-museum-text font-bold truncate">{artifact.name}</span>
        </div>

        {/* Hero Gallery */}
        <ImageGallery images={artifact.images} artifactName={artifact.name} />

        {/* Title, Metadata & Action Badges */}
        <div className="space-y-4 pt-2">
          {/* Location & Period Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {artifact.locationInsideMuseum && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-museum-primary text-white text-xs font-semibold shadow-xs">
                <MapPin className="w-3.5 h-3.5" />
                <span>{artifact.locationInsideMuseum}</span>
              </div>
            )}

            {artifact.datePeriod && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-museum-light text-museum-primary border border-museum-border text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{artifact.datePeriod}</span>
              </div>
            )}

            {artifact.creatorOrigin && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-museum-light text-museum-dark border border-museum-border text-xs font-medium">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{artifact.creatorOrigin}</span>
              </div>
            )}
          </div>

          {/* Main Exhibit Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-museum-text tracking-tight leading-tight">
              {artifact.name}
            </h1>

            {/* Quick Share & QR Card Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-museum-border text-xs font-semibold text-museum-text hover:bg-museum-light transition-colors shadow-2xs"
                title="Copy exhibit URL"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-museum-muted" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-museum-light text-museum-primary border border-museum-primary/20 text-xs font-bold hover:bg-museum-primary hover:text-white transition-all shadow-2xs"
                title="View printable QR code card"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Card</span>
              </button>
            </div>
          </div>

          {/* Short summary description */}
          {artifact.shortDescription && (
            <p className="text-base sm:text-lg text-museum-dark font-medium leading-relaxed bg-museum-light/30 p-4 rounded-2xl border border-museum-border/40">
              {artifact.shortDescription}
            </p>
          )}
        </div>

        {/* 1. Audio Narration Player (Top Priority for Visitors) */}
        {artifact.audioNarration?.url && (
          <AudioPlayer
            audio={artifact.audioNarration}
            artifactName={artifact.name}
            onPlayEvent={handleAudioTrackEvent}
          />
        )}

        {/* 2. Video Player (If Available) */}
        {artifact.video?.url && (
          <VideoPlayer
            video={artifact.video}
            title={artifact.name}
            onPlayEvent={handleVideoTrackEvent}
          />
        )}

        {/* 3. Full Story / Overview */}
        {artifact.fullDescription && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-museum-border shadow-card space-y-3">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-museum-primary flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>About this Artifact</span>
            </h2>
            <p className="text-base sm:text-lg text-museum-text/90 leading-relaxed whitespace-pre-line font-normal">
              {artifact.fullDescription}
            </p>
          </div>
        )}

        {/* 4. Structured Rich Content Blocks */}
        {artifact.richContent && artifact.richContent.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-museum-border shadow-card">
            <RichContentRenderer blocks={artifact.richContent} />
          </div>
        )}

        {/* 5. Historical Context & Background */}
        {artifact.historicalInformation && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#EAF2FA] border border-[#CBD5E1] shadow-card space-y-3">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-museum-primary flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>Historical Significance</span>
            </h2>
            <p className="text-sm sm:text-base text-museum-text/90 leading-relaxed font-normal">
              {artifact.historicalInformation}
            </p>
          </div>
        )}

        {/* 6. Tags */}
        {artifact.tags && artifact.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-museum-muted mr-1">Tags:</span>
            {artifact.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-white border border-museum-border text-xs text-museum-muted font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 7. Related Exhibits in this Gallery */}
        {relatedArtifacts.length > 0 && (
          <div className="pt-6 border-t border-museum-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-museum-text">
                More Exhibits in this Gallery
              </h3>
              {section && (
                <Link
                  to={`/museum/${museum?.slug || museum?._id}/section/${section._id}`}
                  className="text-xs font-semibold text-museum-primary hover:underline"
                >
                  View All
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArtifacts.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/a/${rel.shortCode}`}
                  className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white border border-museum-border shadow-card hover:shadow-elevated transition-all group"
                >
                  <img
                    src={rel.images?.[0]?.url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80'}
                    alt={rel.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-museum-text group-hover:text-museum-primary transition-colors truncate">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-museum-muted truncate mt-0.5">
                      {rel.locationInsideMuseum || rel.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* QR Code Printable Modal */}
      {showQRModal && (
        <QRPrintCardModal
          artifact={artifact}
          museum={museum}
          section={section}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};
