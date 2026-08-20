import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  FileText,
  ChevronDown,
  ChevronUp,
  Headphones,
  Sparkles,
  Mic,
  Copy,
  Check,
  Radio,
} from 'lucide-react';
import { ArtifactAudio } from '../../types';

interface AudioPlayerProps {
  audio: ArtifactAudio;
  artifactName?: string;
  transcriptText?: string;
  onPlayEvent?: () => void;
}

// Sentence splitter for safe TTS chunking (avoids Android WebView 15s cutoff bug)
const splitIntoSentences = (text: string): string[] => {
  if (!text) return [];
  const clean = text.replace(/\s+/g, ' ').trim();
  const matches = clean.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g);
  if (!matches) return [clean];
  return matches.map((s) => s.trim()).filter((s) => s.length > 0);
};

// Fallback pleasant Web Audio chime
const playFallbackChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.25); // E5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Ignore audio context restriction
  }
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audio,
  artifactName,
  transcriptText,
  onPlayEvent,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [isTtsPaused, setIsTtsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audio.duration || 120);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);
  const [activeVoiceName, setActiveVoiceName] = useState<string>('');
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [ttsChunkIndex, setTtsChunkIndex] = useState(0);

  // Refs to avoid stale closures in event listeners
  const isTtsPlayingRef = useRef(false);
  const ttsIndexRef = useRef(0);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const textToRead = useMemo(() => {
    return (
      audio.transcript ||
      transcriptText ||
      `Welcome to the audio guide for ${
        artifactName || 'this historical exhibit'
      }. Discover the fascinating craftsmanship, historical context, and cultural heritage preserved in this collection.`
    );
  }, [audio.transcript, transcriptText, artifactName]);

  const sentenceChunks = useMemo(() => splitIntoSentences(textToRead), [textToRead]);
  const chunksRef = useRef<string[]>(sentenceChunks);
  useEffect(() => {
    chunksRef.current = sentenceChunks;
  }, [sentenceChunks]);

  // Voice selection fallback logic
  const getPreferredVoice = useCallback(
    (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
      if (!voices || voices.length === 0) return null;

      // 1. Indian English
      const inVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('en-in') ||
          v.lang.toLowerCase().includes('en_in') ||
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('prabhat') ||
          v.name.toLowerCase().includes('neerja') ||
          v.name.toLowerCase().includes('rishi')
      );
      if (inVoice) return inVoice;

      // 2. US / UK / Global English
      const enVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('en-us') ||
          v.lang.toLowerCase().startsWith('en-gb') ||
          v.lang.toLowerCase().startsWith('en')
      );
      if (enVoice) return enVoice;

      // 3. System default
      const defaultVoice = voices.find((v) => v.default);
      if (defaultVoice) return defaultVoice;

      // 4. First voice
      return voices[0] || null;
    },
    []
  );

  // Load and subscribe to voices (Web & Android WebView)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setVoiceList(voices);
        const preferred = getPreferredVoice(voices);
        if (preferred) setActiveVoiceName(preferred.name);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);

    // WebView polling retries
    const t1 = setTimeout(updateVoices, 100);
    const t2 = setTimeout(updateVoices, 500);
    const t3 = setTimeout(updateVoices, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      }
    };
  }, [getPreferredVoice]);

  // KeepAlive timer for Chrome / Android WebView to prevent 15s pause bug
  const startKeepAlive = () => {
    if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
    keepAliveTimerRef.current = setInterval(() => {
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused
      ) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  const clearKeepAlive = () => {
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  };

  // Speak a single sentence chunk
  const speakChunk = useCallback(
    (index: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        playFallbackChime();
        return;
      }

      const chunks = chunksRef.current;
      if (index >= chunks.length || !isTtsPlayingRef.current) {
        setIsTtsPlaying(false);
        setIsTtsPaused(false);
        isTtsPlayingRef.current = false;
        setTtsChunkIndex(0);
        ttsIndexRef.current = 0;
        clearKeepAlive();
        return;
      }

      window.speechSynthesis.cancel();

      const chunkText = chunks[index];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      activeUtteranceRef.current = utterance;
      setTtsChunkIndex(index);
      ttsIndexRef.current = index;

      const voice = getPreferredVoice(voiceList);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.rate = playbackRate * 0.94;
      utterance.pitch = 1.02;

      utterance.onstart = () => {
        setIsTtsPlaying(true);
        setIsTtsPaused(false);
        if (!hasTrackedPlay && onPlayEvent) {
          onPlayEvent();
          setHasTrackedPlay(true);
        }
      };

      utterance.onend = () => {
        if (isTtsPlayingRef.current) {
          speakChunk(index + 1);
        }
      };

      utterance.onerror = (e) => {
        if (e.error === 'canceled' || e.error === 'interrupted') return;
        console.warn('TTS utterance error:', e);
        if (isTtsPlayingRef.current && index + 1 < chunks.length) {
          speakChunk(index + 1);
        } else {
          setIsTtsPlaying(false);
          setIsTtsPaused(false);
          isTtsPlayingRef.current = false;
          clearKeepAlive();
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [getPreferredVoice, hasTrackedPlay, onPlayEvent, playbackRate, voiceList]
  );

  // Standard HTML5 Audio event bindings
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
      clearKeepAlive();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopTTS = useCallback(() => {
    isTtsPlayingRef.current = false;
    setIsTtsPlaying(false);
    setIsTtsPaused(false);
    clearKeepAlive();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Main Play / Pause Toggle for Original Audio
  const togglePlayAudio = () => {
    if (isTtsPlaying || isTtsPaused) {
      stopTTS();
    }

    if (!audioRef.current || !audio.url) {
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
          // Seamless fallback to AI Voice Guide TTS if audio file fails
          toggleTTS();
        });
    }
  };

  // Toggle AI TTS Voice Narrator
  const toggleTTS = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      playFallbackChime();
      return;
    }

    if (isTtsPlaying) {
      // Pause TTS
      isTtsPlayingRef.current = false;
      setIsTtsPlaying(false);
      setIsTtsPaused(true);
      window.speechSynthesis.cancel();
      clearKeepAlive();
    } else if (isTtsPaused) {
      // Resume TTS from current sentence chunk
      isTtsPlayingRef.current = true;
      setIsTtsPlaying(true);
      setIsTtsPaused(false);
      startKeepAlive();
      speakChunk(ttsIndexRef.current);
    } else {
      // Start TTS from start
      chunksRef.current = splitIntoSentences(textToRead);
      isTtsPlayingRef.current = true;
      setIsTtsPlaying(true);
      setIsTtsPaused(false);
      ttsIndexRef.current = 0;
      startKeepAlive();
      speakChunk(0);
    }
  };

  // Jump to specific sentence in TTS
  const playFromChunk = (index: number) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    chunksRef.current = splitIntoSentences(textToRead);
    isTtsPlayingRef.current = true;
    setIsTtsPlaying(true);
    setIsTtsPaused(false);
    ttsIndexRef.current = index;
    startKeepAlive();
    speakChunk(index);
  };

  // Seek time scrubber for Audio
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Skip 10 seconds back / forward
  const skipTime = (seconds: number) => {
    if (isPlaying && audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    } else if (isTtsPlaying || isTtsPaused) {
      const newIndex = Math.max(
        0,
        Math.min(chunksRef.current.length - 1, ttsIndexRef.current + (seconds > 0 ? 1 : -1))
      );
      playFromChunk(newIndex);
    }
  };

  // Cycle playback rate (0.8x -> 1.0x -> 1.25x -> 1.5x)
  const cyclePlaybackRate = () => {
    const rates = [0.8, 1.0, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
    if (isTtsPlaying) {
      speakChunk(ttsIndexRef.current);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  // Copy transcript text
  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(textToRead);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isAnyPlaying = isPlaying || isTtsPlaying;
  const isAnyActive = isPlaying || isTtsPlaying || isTtsPaused;

  const ttsProgressPercent =
    sentenceChunks.length > 0
      ? Math.round(((ttsChunkIndex + 1) / sentenceChunks.length) * 100)
      : 0;

  return (
    <div className="rounded-3xl bg-[#EAF2FA] border-2 border-[#CBD5E1] shadow-card p-4 sm:p-5 my-6 space-y-4">
      {audio.url && <audio ref={audioRef} src={audio.url} preload="metadata" />}

      {/* Header with Title & Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
              isAnyPlaying
                ? 'bg-[#214E86] text-white shadow-lg animate-pulse'
                : 'bg-white text-[#214E86] border border-[#CBD5E1]'
            }`}
          >
            <Headphones className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#214E86] block">
                Official Audio Guide
              </span>
              {isTtsPlaying && (
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[9px] font-extrabold flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>AI Voice Narrator</span>
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-serif font-bold text-[#172033] truncate">
              {audio.title || `Story of ${artifactName || 'this Exhibit'}`}
            </h4>
          </div>
        </div>

        {/* AI Voice & Original Track Mode Switcher */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={toggleTTS}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
              isTtsPlaying
                ? 'bg-amber-500 text-white shadow-md'
                : isTtsPaused
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-white border border-[#CBD5E1] text-[#214E86] hover:bg-[#EAF2FA]'
            }`}
            title="Narrate exhibit story with AI Voice Storyteller"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>
              {isTtsPlaying ? 'Pause AI' : isTtsPaused ? 'Resume AI' : 'AI Narrator'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Interactive Controls & Scrubber Box */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#CBD5E1] shadow-xs space-y-3">
        <div className="flex items-center space-x-3">
          {/* Main Play / Pause Button */}
          <button
            onClick={togglePlayAudio}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#214E86] hover:bg-[#17365F] text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
            aria-label={isAnyPlaying ? 'Pause Audio' : 'Play Audio'}
          >
            {isAnyPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          {/* Skip Buttons (Rewind & Forward 10s) */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => skipTime(-10)}
              className="p-2 rounded-xl text-[#214E86] hover:bg-[#EAF2FA] active:scale-95 transition-colors"
              title="Rewind 10 seconds / Previous sentence"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => skipTime(10)}
              className="p-2 rounded-xl text-[#214E86] hover:bg-[#EAF2FA] active:scale-95 transition-colors"
              title="Skip 10 seconds / Next sentence"
              aria-label="Skip forward 10 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Time & Progress Scrubber */}
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
              <span>
                {isTtsPlaying || isTtsPaused
                  ? `Sentence ${ttsChunkIndex + 1} of ${sentenceChunks.length}`
                  : formatTime(currentTime)}
              </span>
              <span>
                {isTtsPlaying || isTtsPaused
                  ? `${ttsProgressPercent}% narrated`
                  : formatTime(duration)}
              </span>
            </div>

            {isTtsPlaying || isTtsPaused ? (
              /* TTS Progress Bar */
              <div className="relative w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${ttsProgressPercent}%` }}
                />
              </div>
            ) : (
              /* Audio File Time Scrubber Slider */
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Audio scrubber"
                  className="w-full h-2.5 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer accent-[#214E86]"
                />
              </div>
            )}
          </div>

          {/* Playback Rate & Volume Controls */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={cyclePlaybackRate}
              className="px-2 py-1 rounded-lg bg-[#EAF2FA] hover:bg-[#CBD5E1]/50 text-[11px] font-bold text-[#214E86] transition-colors"
              title="Change playback speed"
            >
              {playbackRate}x
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#214E86] hover:bg-[#EAF2FA] active:scale-95 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Story Transcript Reader */}
      <div className="border-t border-[#CBD5E1] pt-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center space-x-1.5 text-xs font-bold text-[#214E86] hover:underline cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Read Audio Story Transcript</span>
            {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTranscript && (
            <button
              onClick={handleCopyTranscript}
              className="flex items-center space-x-1 text-[11px] font-medium text-[#64748B] hover:text-[#214E86] transition-colors"
              title="Copy transcript text"
            >
              {copiedTranscript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        {showTranscript && (
          <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-white border border-[#CBD5E1] text-xs sm:text-sm text-[#172033] leading-relaxed animate-in fade-in duration-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-[11px] text-[#64748B]">
              <span className="font-semibold">Interactive Story Transcript</span>
              <span className="italic">Click any sentence to listen from there</span>
            </div>

            <div className="space-y-2">
              {sentenceChunks.map((sentence, idx) => {
                const isCurrent = (isTtsPlaying || isTtsPaused) && ttsChunkIndex === idx;
                return (
                  <span
                    key={idx}
                    onClick={() => playFromChunk(idx)}
                    className={`inline cursor-pointer rounded-md px-1 py-0.5 transition-colors ${
                      isCurrent
                        ? 'bg-amber-200 text-amber-950 font-medium shadow-xs ring-2 ring-amber-400/40'
                        : 'hover:bg-[#EAF2FA] text-[#17365F]'
                    }`}
                  >
                    {sentence}{' '}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
