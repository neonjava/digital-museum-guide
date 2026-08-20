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
  Sparkles,
  Mic,
} from 'lucide-react';
import { ArtifactAudio } from '../../types';

interface AudioPlayerProps {
  audio: ArtifactAudio;
  artifactName?: string;
  transcriptText?: string;
  onPlayEvent?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audio,
  artifactName,
  transcriptText,
  onPlayEvent,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audio.duration || 120);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const textToRead =
    audio.transcript ||
    transcriptText ||
    `Welcome to the audio tour for ${artifactName || 'this historical exhibit'}. Listen as we explore the craftsmanship, historical context, and cultural significance preserved in this collection.`;

  // Load available TTS voices (Edge / Google / Natural voices)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setVoiceList(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Standard Audio events
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
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePlayAudio = () => {
    if (isTtsPlaying) {
      stopTTS();
    }

    if (!audioRef.current) {
      toggleTTS();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          if (!hasTrackedPlay && onPlayEvent) {
            onPlayEvent();
            setHasTrackedPlay(true);
          }
        })
        .catch(() => {
          // If audio URL fails or is blocked, seamlessly fallback to AI Voice Guide TTS!
          toggleTTS();
        });
    }
  };

  // Expressive Text-to-Speech narration with emotion and pacing
  const toggleTTS = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isTtsPlaying) {
      window.speechSynthesis.pause();
      setIsTtsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsTtsPlaying(true);
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utteranceRef.current = utterance;

      // Select natural Indian English / expressive voice (like Edge Prabhat / Google en-IN)
      const preferredVoice =
        voiceList.find(
          (v) =>
            v.lang.includes('en-IN') ||
            v.name.includes('India') ||
            v.name.includes('Prabhat') ||
            v.name.includes('Natural') ||
            v.name.includes('Google')
        ) ||
        voiceList.find((v) => v.lang.startsWith('en')) ||
        voiceList[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Expressive speech parameters for museum storytelling
      utterance.rate = 0.94; // slightly relaxed storytelling tempo
      utterance.pitch = 1.03; // engaging storytelling pitch

      utterance.onstart = () => {
        setIsTtsPlaying(true);
        if (!hasTrackedPlay && onPlayEvent) {
          onPlayEvent();
          setHasTrackedPlay(true);
        }
      };

      utterance.onend = () => {
        setIsTtsPlaying(false);
      };

      utterance.onerror = () => {
        setIsTtsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopTTS = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsTtsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isAnyActive = isPlaying || isTtsPlaying;

  return (
    <div className="rounded-3xl bg-[#EAF2FA] border-2 border-[#CBD5E1] shadow-md p-5 my-6 space-y-4">
      {audio.url && <audio ref={audioRef} src={audio.url} preload="metadata" />}

      {/* Header with status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isAnyActive
                ? 'bg-[#214E86] text-white shadow-lg animate-pulse'
                : 'bg-white text-[#214E86] border border-[#CBD5E1]'
            }`}
          >
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#214E86] block">
                Official Voice Guide
              </span>
              {isTtsPlaying && (
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[9px] font-bold">
                  AI Narrator
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-[#172033] line-clamp-1">
              {audio.title || `Story of ${artifactName || 'this Artifact'}`}
            </h4>
          </div>
        </div>

        {/* AI Voice Toggle Button */}
        <button
          onClick={toggleTTS}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isTtsPlaying
              ? 'bg-amber-500 text-white'
              : 'bg-white border border-[#CBD5E1] text-[#214E86] hover:bg-slate-100'
          }`}
          title="Narrate transcript with AI Storyteller"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{isTtsPlaying ? 'Pause AI' : 'AI Voice'}</span>
        </button>
      </div>

      {/* Play Controls and Waveform Scrubber */}
      <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-[#CBD5E1]">
        <button
          onClick={togglePlayAudio}
          className="w-12 h-12 rounded-2xl bg-[#214E86] text-white flex items-center justify-center hover:bg-[#17365F] shadow-md active:scale-95 transition-all shrink-0"
          aria-label={isAnyActive ? 'Pause' : 'Play'}
        >
          {isAnyActive ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
            <span>{isTtsPlaying ? 'AI Narrating' : formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="relative w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className={`h-full bg-[#214E86] transition-all ${
                isTtsPlaying ? 'animate-pulse w-full' : ''
              }`}
              style={{
                width: isTtsPlaying ? '100%' : `${(currentTime / (duration || 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Narrative Story Transcript (Toggleable) */}
      <div className="border-t border-[#CBD5E1] pt-3">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full flex items-center justify-between text-xs font-bold text-[#214E86] hover:underline"
        >
          <span className="flex items-center space-x-1.5">
            <FileText className="w-4 h-4" />
            <span>Read Audio Story Transcript</span>
          </span>
          {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTranscript && (
          <div className="mt-3 p-4 rounded-2xl bg-white border border-[#CBD5E1] text-xs sm:text-sm text-[#172033] leading-relaxed animate-in fade-in duration-200">
            <p className="italic font-serif text-[#17365F]">{textToRead}</p>
          </div>
        )}
      </div>
    </div>
  );
};
