import React, { useState } from 'react';
import { Film, Maximize2, Play } from 'lucide-react';
import { ArtifactVideo } from '../../types';

interface VideoPlayerProps {
  video: ArtifactVideo;
  title?: string;
  onPlayEvent?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, title, onPlayEvent }) => {
  const [hasStarted, setHasStarted] = useState(false);

  if (!video.url) return null;

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-museum-border bg-black shadow-card">
      <div className="bg-museum-dark px-4 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <Film className="w-4 h-4 text-museum-light" />
          <span className="text-xs font-bold uppercase tracking-wider text-museum-light">
            Video Presentation
          </span>
        </div>
        <span className="text-xs text-slate-300 font-medium line-clamp-1">
          {video.title || title || 'Exhibit Documentary'}
        </span>
      </div>

      <div className="relative aspect-video bg-black flex items-center justify-center">
        <video
          src={video.url}
          poster={video.posterUrl}
          controls
          playsInline
          preload="metadata"
          onPlay={() => {
            if (!hasStarted) {
              setHasStarted(true);
              if (onPlayEvent) onPlayEvent();
            }
          }}
          className="w-full h-full object-contain"
        >
          Your browser does not support HTML5 video playback.
        </video>
      </div>
    </div>
  );
};
