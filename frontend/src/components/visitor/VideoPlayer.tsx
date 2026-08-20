import React, { useState, useRef, useEffect } from 'react';
import { Film, AlertCircle, RefreshCw, ExternalLink, Play } from 'lucide-react';
import { ArtifactVideo } from '../../types';

interface VideoPlayerProps {
  video: ArtifactVideo;
  title?: string;
  onPlayEvent?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, title, onPlayEvent }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setHasStarted(false);
  }, [video?.url]);

  if (!video || !video.url) return null;

  const videoTitle = video.title || title || 'Exhibit Documentary';

  // Check if YouTube / Vimeo embed
  const ytMatch = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/i);
  const isYouTube = !!ytMatch;
  const ytEmbed = isYouTube ? `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0` : null;

  const handlePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      if (onPlayEvent) onPlayEvent();
    }
  };

  return (
    <div className="my-6 rounded-3xl overflow-hidden border border-[#CBD5E1] bg-slate-950 shadow-md">
      {/* Header bar */}
      <div className="bg-[#17365F] px-4 py-3 flex items-center justify-between text-white border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center">
            <Film className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Exhibit Documentary
          </span>
        </div>
        <span className="text-xs text-slate-300 font-medium line-clamp-1 max-w-[200px] sm:max-w-md">
          {videoTitle}
        </span>
      </div>

      {/* Video Frame */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 bg-black flex items-center justify-center overflow-hidden">
        {ytEmbed ? (
          <iframe
            src={ytEmbed}
            title={videoTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Video Demonstration Available</h4>
              <p className="text-xs text-slate-400 mt-1">
                Stream demonstration recording directly
              </p>
            </div>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#214E86] hover:bg-[#17365F] text-xs font-bold text-white shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Video Stream</span>
            </a>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={video.url}
            playsInline
            controls
            preload="metadata"
            poster={video.posterUrl}
            className="w-full h-full object-contain bg-black"
            onPlay={handlePlay}
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </div>
  );
};
