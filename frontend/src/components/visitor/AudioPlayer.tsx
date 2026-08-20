import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  ChevronDown,
  ChevronUp,
  Headphones,
  Gauge,
} from 'lucide-react';
import { ArtifactAudio } from '../../types';

interface AudioPlayerProps {
  audio: ArtifactAudio;
  artifactName?: string;
  onPlayEvent?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audio,
  artifactName,
  onPlayEvent,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audio.duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleLoadedMetadata = () => {
      if (audioEl.duration && !isNaN(audioEl.duration)) {
        setDuration(audioEl.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioEl.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioEl.addEventListener('timeupdate', handleTimeUpdate);
    audioEl.addEventListener('ended', handleEnded);

    return () => {
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioEl.removeEventListener('timeupdate', handleTimeUpdate);
      audioEl.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        if (!hasTrackedPlay && onPlayEvent) {
          onPlayEvent();
          setHasTrackedPlay(true);
        }
      }).catch((err) => {
        console.error('Audio play error:', err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const restart10 = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const cyclePlaybackRate = () => {
    const speeds = [1.0, 1.25, 1.5, 0.8];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!audio.url) return null;

  return (
    <div className="rounded-2xl bg-linear-to-br from-museum-light/80 to-white border border-museum-border shadow-card p-5 my-6">
      <audio ref={audioRef} src={audio.url} preload="metadata" />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isPlaying ? 'bg-museum-primary text-white shadow-md' : 'bg-white text-museum-primary border border-museum-border'
          }`}>
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-museum-primary block">
              Audio Narration
            </span>
            <h4 className="text-sm font-bold text-museum-text line-clamp-1">
              {audio.title || `Story of ${artifactName || 'this Artifact'}`}
            </h4>
          </div>
        </div>

        {/* Speed button */}
        <button
          onClick={cyclePlaybackRate}
          className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-museum-border text-museum-primary hover:bg-museum-light/60 transition-colors shadow-2xs"
          title="Playback speed"
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>{playbackRate}x</span>
        </button>
      </div>

      {/* Main Scrubber */}
      <div className="space-y-1.5 mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          aria-label="Audio scrubber"
          className="w-full h-2 bg-museum-border/80 rounded-lg appearance-none cursor-pointer accent-museum-primary"
        />
        <div className="flex justify-between text-xs font-medium text-museum-muted">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Primary Control Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={restart10}
          className="p-2 text-museum-muted hover:text-museum-primary hover:bg-white rounded-xl transition-colors"
          title="Rewind 10 seconds"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Play/Pause Master Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
          className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-museum-primary text-white font-bold text-base hover:bg-museum-hover shadow-md active:scale-95 transition-all"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Audio</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current ml-0.5" />
              <span>Play Audio Narration</span>
            </>
          )}
        </button>

        <button
          onClick={toggleMute}
          className="p-2 text-museum-muted hover:text-museum-primary hover:bg-white rounded-xl transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Transcript Accordion if available */}
      {audio.transcript && (
        <div className="mt-4 pt-4 border-t border-museum-border/60">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between text-xs font-semibold text-museum-primary hover:underline"
          >
            <span className="flex items-center space-x-1.5">
              <FileText className="w-4 h-4" />
              <span>Read Narration Transcript</span>
            </span>
            {showTranscript ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showTranscript && (
            <div className="mt-3 p-3.5 rounded-xl bg-white border border-museum-border/80 text-sm text-museum-text leading-relaxed animate-in fade-in duration-150">
              {audio.transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
