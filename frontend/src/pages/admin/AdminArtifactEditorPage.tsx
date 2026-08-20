import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Headphones,
  Film,
  Plus,
  Trash2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Layers,
  Calendar,
  UserCheck,
  MapPin,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { MediaUploader } from '../../components/admin/MediaUploader';
import { QRPrintCardModal } from '../../components/admin/QRPrintCardModal';
import {
  Artifact,
  Museum,
  Section,
  RichContentBlock,
  ArtifactImage,
  MediaItem,
} from '../../types';
import { api } from '../../services/api';

export const AdminArtifactEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // Museum & Sections list
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [museumId, setMuseumId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [historicalInformation, setHistoricalInformation] = useState('');
  const [datePeriod, setDatePeriod] = useState('');
  const [creatorOrigin, setCreatorOrigin] = useState('');
  const [locationInsideMuseum, setLocationInsideMuseum] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [tags, setTags] = useState<string>('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');

  // Rich Structured Content Blocks
  const [richBlocks, setRichBlocks] = useState<RichContentBlock[]>([]);

  // Images
  const [images, setImages] = useState<ArtifactImage[]>([]);

  // Audio Narration
  const [audioUrl, setAudioUrl] = useState('');
  const [audioTitle, setAudioTitle] = useState('Audio Narration');
  const [audioTranscript, setAudioTranscript] = useState('');

  // Video
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPoster, setVideoPoster] = useState('');

  // Saved artifact details for QR preview
  const [savedArtifact, setSavedArtifact] = useState<Artifact | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Museums
  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const res = await api.get('/museums');
        if (res.success && res.data) {
          setMuseums(res.data);
          if (!isEditMode && res.data.length > 0 && !museumId) {
            setMuseumId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching museums:', err);
      }
    };
    fetchMuseums();
  }, []);

  // 2. Fetch Sections when museum changes
  useEffect(() => {
    const fetchSections = async () => {
      if (!museumId) return;
      try {
        const res = await api.get(`/sections/museum/${museumId}`);
        if (res.success && res.data) {
          setSections(res.data);
          if (!isEditMode && res.data.length > 0) {
            setSectionId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching sections:', err);
      }
    };
    fetchSections();
  }, [museumId]);

  // 3. If Edit Mode, fetch existing artifact
  useEffect(() => {
    const fetchArtifact = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/artifacts/${id}`);
        if (res.success && res.data) {
          const art: Artifact = res.data;
          setSavedArtifact(art);
          setName(art.name);
          setMuseumId(typeof art.museumId === 'object' ? art.museumId._id : art.museumId);
          setSectionId(typeof art.sectionId === 'object' ? art.sectionId._id : art.sectionId);
          setShortDescription(art.shortDescription || '');
          setFullDescription(art.fullDescription || '');
          setHistoricalInformation(art.historicalInformation || '');
          setDatePeriod(art.datePeriod || '');
          setCreatorOrigin(art.creatorOrigin || '');
          setLocationInsideMuseum(art.locationInsideMuseum || '');
          setDisplayOrder(art.displayOrder || 1);
          setTags(art.tags?.join(', ') || '');
          setStatus(art.status || 'DRAFT');
          setRichBlocks(art.richContent || []);
          setImages(art.images || []);
          setAudioUrl(art.audioNarration?.url || '');
          setAudioTitle(art.audioNarration?.title || 'Audio Narration');
          setAudioTranscript(art.audioNarration?.transcript || '');
          setVideoUrl(art.video?.url || '');
          setVideoTitle(art.video?.title || '');
          setVideoPoster(art.video?.posterUrl || '');
        }
      } catch (err) {
        console.error('Error loading artifact:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchArtifact();
    }
  }, [id, isEditMode]);

  // Rich Content Handlers
  const addBlock = (type: 'heading' | 'paragraph' | 'bullet_list' | 'image' | 'quote') => {
    const newBlock: RichContentBlock = {
      id: 'block_' + Math.random().toString(36).substring(2, 9),
      type,
      content: '',
      items: type === 'bullet_list' ? [''] : undefined,
    };
    setRichBlocks([...richBlocks, newBlock]);
  };

  const removeBlock = (index: number) => {
    setRichBlocks(richBlocks.filter((_, i) => i !== index));
  };

  const updateBlockContent = (index: number, content: string) => {
    const updated = [...richBlocks];
    updated[index].content = content;
    setRichBlocks(updated);
  };

  const updateBulletItem = (blockIndex: number, itemIndex: number, text: string) => {
    const updated = [...richBlocks];
    if (updated[blockIndex].items) {
      updated[blockIndex].items![itemIndex] = text;
      setRichBlocks(updated);
    }
  };

  const addBulletItem = (blockIndex: number) => {
    const updated = [...richBlocks];
    if (updated[blockIndex].items) {
      updated[blockIndex].items!.push('');
      setRichBlocks(updated);
    }
  };

  // Image Gallery Handlers
  const addImageUrl = (url: string, caption = '') => {
    setImages([...images, { url, caption, isCover: images.length === 0 }]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const setAsCover = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isCover: i === index,
    }));
    setImages(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        museumId,
        sectionId,
        name,
        shortDescription,
        fullDescription,
        historicalInformation,
        datePeriod,
        creatorOrigin,
        locationInsideMuseum,
        displayOrder,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        status,
        richContent: richBlocks,
        images,
        audioNarration: {
          url: audioUrl,
          title: audioTitle,
          transcript: audioTranscript,
        },
        video: {
          url: videoUrl,
          title: videoTitle,
          posterUrl: videoPoster,
        },
      };

      let res;
      if (isEditMode) {
        res = await api.put(`/artifacts/${id}`, payload);
      } else {
        res = await api.post('/artifacts', payload);
      }

      if (res.success && res.data) {
        setSavedArtifact(res.data);
        if (!isEditMode) {
          navigate(`/admin/artifacts/${res.data._id}/edit`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save artifact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title={isEditMode ? `Edit Exhibit: ${name || 'Artifact'}` : 'Create New Exhibit'}
      subtitle="Fill exhibit metadata, structured story, audio narrations, and QR codes"
      actions={
        <div className="flex items-center space-x-2">
          {savedArtifact && (
            <>
              <Link
                to={`/a/${savedArtifact.shortCode}`}
                target="_blank"
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-white border border-museum-border text-xs font-semibold text-museum-text hover:bg-museum-light transition-colors"
              >
                <span>Visitor View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setShowQRModal(true)}
                className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-museum-light text-museum-primary border border-museum-primary/30 text-xs font-bold hover:bg-museum-primary hover:text-white transition-all shadow-2xs"
              >
                <QrCode className="w-4 h-4" />
                <span>QR Placard</span>
              </button>
            </>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-museum-primary text-white text-xs font-bold hover:bg-museum-hover shadow-xs active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Core Exhibit Information */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-museum-border shadow-card space-y-5">
            <h3 className="font-serif font-bold text-lg text-museum-text flex items-center space-x-2 border-b border-museum-border pb-3">
              <BookOpen className="w-5 h-5 text-museum-primary" />
              <span>1. Basic Exhibit Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Museum *
                </label>
                <select
                  required
                  value={museumId}
                  onChange={(e) => setMuseumId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm font-medium text-museum-text focus:outline-hidden focus:border-museum-primary"
                >
                  {museums.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Gallery / Section *
                </label>
                <select
                  required
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm font-medium text-museum-text focus:outline-hidden focus:border-museum-primary"
                >
                  {sections.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                Artifact / Model Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ancient Water Clock (Ghati Yantra / Clepsydra)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm font-semibold text-museum-text focus:outline-hidden focus:border-museum-primary"
              />
            </div>

            <div>
              <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                Short Description (Summary)
              </label>
              <textarea
                rows={2}
                placeholder="One to two sentences summarizing the artifact for visitors..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Period / Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 11th Century CE / 1020 CE"
                  value={datePeriod}
                  onChange={(e) => setDatePeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary"
                />
              </div>

              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Creator / Origin
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chalukyan Artisans / Vijayanagara"
                  value={creatorOrigin}
                  onChange={(e) => setCreatorOrigin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary"
                />
              </div>

              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Location Inside Museum
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gallery 2, Stand 14"
                  value={locationInsideMuseum}
                  onChange={(e) => setLocationInsideMuseum(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Timekeeping, Bronze, Astronomy, Manuscripts"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary"
                />
              </div>

              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm font-bold text-museum-text focus:outline-hidden focus:border-museum-primary"
                >
                  <option value="DRAFT">DRAFT (Hidden from Visitors)</option>
                  <option value="PUBLISHED">PUBLISHED (Publicly Accessible)</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Narrative & Historical Content */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-museum-border shadow-card space-y-5">
            <h3 className="font-serif font-bold text-lg text-museum-text flex items-center space-x-2 border-b border-museum-border pb-3">
              <Sparkles className="w-5 h-5 text-museum-primary" />
              <span>2. Full Story & Historical Information</span>
            </h3>

            <div>
              <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                Full Description / Artifact Story
              </label>
              <textarea
                rows={4}
                placeholder="Comprehensive narrative detailing how the artifact was made, its functional purpose, and cultural meaning..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary leading-relaxed"
              />
            </div>

            <div>
              <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                Historical Significance / Archaeological Context
              </label>
              <textarea
                rows={3}
                placeholder="Historical context, excavation notes, or royal treatises describing this exhibit..."
                value={historicalInformation}
                onChange={(e) => setHistoricalInformation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary leading-relaxed"
              />
            </div>

            {/* Structured Content Blocks Builder */}
            <div className="pt-4 border-t border-museum-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-museum-text">
                    Structured Story Blocks
                  </h4>
                  <p className="text-xs text-museum-muted">
                    Add styled headings, paragraphs, bullet lists, or quotes to build a rich narrative
                  </p>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => addBlock('heading')}
                    className="px-2.5 py-1 rounded-lg bg-museum-light text-museum-primary text-xs font-bold hover:bg-museum-primary hover:text-white transition-all"
                  >
                    + Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('paragraph')}
                    className="px-2.5 py-1 rounded-lg bg-museum-light text-museum-primary text-xs font-bold hover:bg-museum-primary hover:text-white transition-all"
                  >
                    + Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('bullet_list')}
                    className="px-2.5 py-1 rounded-lg bg-museum-light text-museum-primary text-xs font-bold hover:bg-museum-primary hover:text-white transition-all"
                  >
                    + Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('quote')}
                    className="px-2.5 py-1 rounded-lg bg-museum-light text-museum-primary text-xs font-bold hover:bg-museum-primary hover:text-white transition-all"
                  >
                    + Quote
                  </button>
                </div>
              </div>

              {richBlocks.map((block, idx) => (
                <div
                  key={block.id}
                  className="p-4 rounded-2xl bg-museum-bg border border-museum-border relative space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-museum-primary uppercase tracking-wider">
                    <span>Block #{idx + 1}: {block.type}</span>
                    <button
                      type="button"
                      onClick={() => removeBlock(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {block.type === 'heading' && (
                    <input
                      type="text"
                      placeholder="Enter section heading..."
                      value={block.content || ''}
                      onChange={(e) => updateBlockContent(idx, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-museum-border text-sm font-bold text-museum-text"
                    />
                  )}

                  {block.type === 'paragraph' && (
                    <textarea
                      rows={2}
                      placeholder="Enter paragraph text..."
                      value={block.content || ''}
                      onChange={(e) => updateBlockContent(idx, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-museum-border text-sm text-museum-text"
                    />
                  )}

                  {block.type === 'quote' && (
                    <textarea
                      rows={2}
                      placeholder="Enter historical inscription or famous commentary quote..."
                      value={block.content || ''}
                      onChange={(e) => updateBlockContent(idx, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-museum-border text-sm italic text-museum-text"
                    />
                  )}

                  {block.type === 'bullet_list' && (
                    <div className="space-y-2">
                      {block.items?.map((item, itemIdx) => (
                        <input
                          key={itemIdx}
                          type="text"
                          placeholder={`Bullet item #${itemIdx + 1}`}
                          value={item}
                          onChange={(e) => updateBulletItem(idx, itemIdx, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-museum-border text-xs text-museum-text"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => addBulletItem(idx)}
                        className="text-xs font-bold text-museum-primary hover:underline"
                      >
                        + Add Bullet Point
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: High-Res Image Gallery */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-museum-border shadow-card space-y-5">
            <h3 className="font-serif font-bold text-lg text-museum-text flex items-center space-x-2 border-b border-museum-border pb-3">
              <ImageIcon className="w-5 h-5 text-museum-primary" />
              <span>3. Exhibit Image Gallery</span>
            </h3>

            {/* Direct Upload */}
            <MediaUploader
              accept="image/*"
              mediaTypeLabel="photographs / exhibit images"
              onUploadSuccess={(media) => addImageUrl(media.url, media.fileName)}
            />

            {/* Current Images List */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-museum-border bg-museum-bg flex items-center space-x-3 relative"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `Image ${idx}`}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <input
                        type="text"
                        placeholder="Image caption..."
                        value={img.caption || ''}
                        onChange={(e) => {
                          const updated = [...images];
                          updated[idx].caption = e.target.value;
                          setImages(updated);
                        }}
                        className="w-full px-2 py-1 text-xs rounded-lg border border-museum-border bg-white"
                      />
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setAsCover(idx)}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-bold transition-colors ${
                            img.isCover
                              ? 'bg-museum-primary text-white'
                              : 'bg-white border border-museum-border text-museum-muted hover:text-museum-primary'
                          }`}
                        >
                          {img.isCover ? 'Cover Image' : 'Set as Cover'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="text-[11px] text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Audio Narration */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-museum-border shadow-card space-y-5">
            <h3 className="font-serif font-bold text-lg text-museum-text flex items-center space-x-2 border-b border-museum-border pb-3">
              <Headphones className="w-5 h-5 text-museum-primary" />
              <span>4. Audio Narration (Voice Guide)</span>
            </h3>

            <MediaUploader
              accept="audio/*"
              mediaTypeLabel="voiceover / audio narration track (MP3/WAV/M4A)"
              onUploadSuccess={(media) => setAudioUrl(media.url)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Audio Stream URL
                </label>
                <input
                  type="text"
                  placeholder="https://... or uploaded file path"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-xs text-museum-text focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Audio Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Audio Guide: The Rhythm of Water Clock Mechanics"
                  value={audioTitle}
                  onChange={(e) => setAudioTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                Audio Narration Transcript (Accessible Subtitles)
              </label>
              <textarea
                rows={3}
                placeholder="Full spoken text of the audio track for visitors with hearing impairments..."
                value={audioTranscript}
                onChange={(e) => setAudioTranscript(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>

          {/* Section 5: Video Documentary */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-museum-border shadow-card space-y-5">
            <h3 className="font-serif font-bold text-lg text-museum-text flex items-center space-x-2 border-b border-museum-border pb-3">
              <Film className="w-5 h-5 text-museum-primary" />
              <span>5. Video Documentary / Demonstration</span>
            </h3>

            <MediaUploader
              accept="video/*"
              mediaTypeLabel="video clip / demonstration (MP4/WebM)"
              onUploadSuccess={(media) => setVideoUrl(media.url)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Video Stream URL
                </label>
                <input
                  type="text"
                  placeholder="https://... or uploaded video path"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-xs text-museum-text focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-museum-text block mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  placeholder="Demonstration: 24-Minute Sinking Cycle"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              to="/admin/artifacts"
              className="px-6 py-3 rounded-2xl border border-museum-border font-semibold text-xs text-museum-muted hover:bg-museum-light transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-8 py-3 rounded-2xl bg-museum-primary text-white font-bold text-sm hover:bg-museum-hover shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Exhibit...' : 'Save & Publish Exhibit'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* QR Code Printable Modal */}
      {showQRModal && savedArtifact && (
        <QRPrintCardModal
          artifact={savedArtifact}
          museum={museums.find((m) => m._id === museumId)}
          section={sections.find((s) => s._id === sectionId)}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </AdminLayout>
  );
};
