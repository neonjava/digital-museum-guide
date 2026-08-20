import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  FileAudio,
  FileVideo,
  Trash2,
  Copy,
  Check,
  UploadCloud,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { MediaUploader } from '../../components/admin/MediaUploader';
import { MediaItem } from '../../types';
import { api } from '../../services/api';

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const url = filterType ? `/media?mediaType=${filterType}` : '/media';
      const res = await api.get(url);
      if (res.success && res.data) {
        setMediaList(res.data);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filterType]);

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this media asset?')) {
      try {
        await api.delete(`/media/${id}`);
        fetchMedia();
      } catch (err: any) {
        alert(err.message || 'Failed to delete media');
      }
    }
  };

  return (
    <AdminLayout
      title="Media Storage Library"
      subtitle="Dedicated storage for exhibit images, audio voiceovers, and videos"
    >
      <div className="space-y-8">
        {/* Upload Box */}
        <div className="p-6 rounded-3xl bg-white border border-museum-border shadow-card space-y-4">
          <h3 className="font-serif font-bold text-base text-museum-text">
            Upload New Media Asset
          </h3>
          <MediaUploader
            onUploadSuccess={() => {
              fetchMedia();
            }}
          />
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {['', 'image', 'audio', 'video'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filterType === type
                    ? 'bg-museum-primary text-white shadow-xs'
                    : 'bg-white border border-museum-border text-museum-muted hover:text-museum-text'
                }`}
              >
                {type ? `${type}s` : 'All Files'}
              </button>
            ))}
          </div>

          <span className="text-xs text-museum-muted font-medium">
            {mediaList.length} asset{mediaList.length === 1 ? '' : 's'} stored
          </span>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : mediaList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-museum-border">
            <ImageIcon className="w-12 h-12 text-museum-muted mx-auto mb-3" />
            <h3 className="font-bold text-museum-text">No media files uploaded</h3>
            <p className="text-xs text-museum-muted mt-1">
              Upload images, MP3 narrations, or MP4 videos above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaList.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl bg-white border border-museum-border overflow-hidden shadow-card flex flex-col justify-between group"
              >
                <div className="relative aspect-square bg-slate-900 flex items-center justify-center overflow-hidden">
                  {item.mediaType === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : item.mediaType === 'audio' ? (
                    <div className="flex flex-col items-center text-museum-light space-y-2">
                      <FileAudio className="w-10 h-10" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        Audio Track
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-museum-light space-y-2">
                      <FileVideo className="w-10 h-10" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        Video Clip
                      </span>
                    </div>
                  )}

                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase">
                    {item.mediaType}
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  <span className="text-xs font-semibold text-museum-text block truncate" title={item.fileName}>
                    {item.fileName}
                  </span>

                  <div className="pt-2 border-t border-museum-border/60 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(item.url, item._id)}
                      className="flex items-center space-x-1 text-[11px] text-museum-primary hover:underline font-semibold"
                    >
                      {copiedId === item._id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1 rounded-md text-museum-muted hover:text-red-600 hover:bg-red-50"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
