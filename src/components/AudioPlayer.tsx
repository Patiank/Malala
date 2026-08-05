import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Radio, ListMusic, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Language } from '../lib/translations';
import { getDirectDriveUrl } from '../data/content';

interface AudioPlayerProps {
  lang: Language;
  customAudioUrl?: string;
  customAudioTitle?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  titleEn: string;
  artist: string;
  url: string;
}

export const DEFAULT_TRACKS: AudioTrack[] = [
  {
    id: 'track-1',
    title: 'Instrumen Saluang & Talempong Syahdu Minang',
    titleEn: 'Peaceful Minangkabau Saluang & Talempong',
    artist: 'Pariwisata Sumbar',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=instrumental-bamboo-flute-112349.mp3',
  },
  {
    id: 'track-2',
    title: 'Musik Tradisional Ranah Minang',
    titleEn: 'Traditional Minang Ethnic Music',
    artist: 'Kesenian Minangkabau',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b417e089.mp3?filename=asian-flute-and-gong-ambient-14732.mp3',
  },
  {
    id: 'track-3',
    title: 'Alunan Geopark Lembah Harau & Alam',
    titleEn: 'Lembah Harau Geopark Nature Acoustic',
    artist: 'Atmosphere Sumbar',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=relaxing-bamboo-flute-14309.mp3',
  },
];

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  lang,
  customAudioUrl,
  customAudioTitle,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Active track determination with direct drive URL conversion
  const formattedCustomUrl = customAudioUrl ? getDirectDriveUrl(customAudioUrl) : '';
  const tracks = DEFAULT_TRACKS;
  const currentTrack = formattedCustomUrl
    ? {
        id: 'custom',
        title: customAudioTitle || (lang === 'en' ? 'Custom Background Audio' : 'Musik Latar Khas Sumbar'),
        titleEn: customAudioTitle || 'Custom Background Audio',
        artist: 'Dinas Pariwisata Sumbar',
        url: formattedCustomUrl,
      }
    : tracks[selectedTrackIndex];

  // Autoplay on mount & fallback on user interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let hasStarted = false;

    const startPlayback = () => {
      if (hasStarted) return;
      audio
        .play()
        .then(() => {
          hasStarted = true;
          setIsPlaying(true);
          // Clean up interaction listeners once playing
          window.removeEventListener('click', startPlayback);
          window.removeEventListener('pointerdown', startPlayback);
          window.removeEventListener('keydown', startPlayback);
          window.removeEventListener('touchstart', startPlayback);
        })
        .catch((err) => {
          // If browser blocks unmuted autoplay without prior interaction,
          // keep listener active so it plays on first click/touch
          console.warn('Autoplay waiting for first user interaction:', err);
        });
    };

    // Immediate attempt
    startPlayback();

    // Interaction fallback listeners
    window.addEventListener('click', startPlayback, { once: false });
    window.addEventListener('pointerdown', startPlayback, { once: false });
    window.addEventListener('keydown', startPlayback, { once: false });
    window.addEventListener('touchstart', startPlayback, { once: false });

    return () => {
      window.removeEventListener('click', startPlayback);
      window.removeEventListener('pointerdown', startPlayback);
      window.removeEventListener('keydown', startPlayback);
      window.removeEventListener('touchstart', startPlayback);
    };
  }, [currentTrack.url]);

  // Sync volume, timeupdate, and ended listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (!customAudioUrl && tracks.length > 1) {
        setSelectedTrackIndex((prev) => (prev + 1) % tracks.length);
        setIsPlaying(true);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, isMuted, customAudioUrl, tracks.length]);

  // Handle Play / Pause toggle
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio play request blocked or failed:', err);
          setIsPlaying(false);
        });
    }
  }, [isPlaying]);

  // Handle Mute toggle
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Handle Volume slider change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  // Handle Seek slider change
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Select track from playlist
  const handleSelectTrack = (index: number) => {
    setSelectedTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 100);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="metadata"
      />

      {/* Main Container Card */}
      <div
        className={`bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200/80 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
          isExpanded ? 'w-[320px] sm:w-[360px] p-4' : 'w-auto p-2 sm:p-2.5'
        }`}
      >
        {/* Compact View (Minimized Floating Pill) */}
        {!isExpanded ? (
          <div className="flex items-center gap-2.5">
            {/* Spinning Vinyl / Music Badge Icon */}
            <button
              onClick={togglePlay}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-gradient-to-tr from-red-600 to-amber-500 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-red-600 hover:text-white'
              }`}
              title={isPlaying ? (lang === 'en' ? 'Pause Audio' : 'Jeda Musik') : (lang === 'en' ? 'Play Audio' : 'Putar Musik')}
              aria-label="Play/Pause Audio"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 translate-x-0.5" />
              )}
            </button>

            {/* Equalizer Wave / Playing State */}
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 text-left cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex flex-col">
                <span className="font-orbitron font-bold text-[10px] tracking-wider text-red-600 uppercase flex items-center gap-1">
                  <Music className="w-3 h-3 text-red-600" />
                  <span>{lang === 'en' ? 'Minang Audio' : 'Musik Minang'}</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-800 max-w-[130px] sm:max-w-[160px] truncate">
                  {lang === 'en' ? currentTrack.titleEn : currentTrack.title}
                </span>
              </div>

              {/* Animated Soundbars when playing */}
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3.5 px-1">
                  <span className="w-0.5 bg-red-600 h-full animate-[bounce_1s_infinite_100ms] rounded-full" />
                  <span className="w-0.5 bg-amber-500 h-2/3 animate-[bounce_1s_infinite_300ms] rounded-full" />
                  <span className="w-0.5 bg-red-600 h-full animate-[bounce_1s_infinite_200ms] rounded-full" />
                </div>
              )}
            </button>

            {/* Expand Toggle Arrow */}
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer rounded-full hover:bg-slate-100"
              title={lang === 'en' ? 'Expand Player' : 'Buka Pemutar Musik'}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded Player View */
          <div className="flex flex-col gap-3">
            {/* Header Title & Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="font-orbitron font-extrabold text-[11px] tracking-wider text-red-600 uppercase flex items-center gap-1">
                    <span>MALALA AUDIO PLAYER</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {lang === 'en' ? 'Minangkabau Background Music' : 'Musik Latar Syahdu Minangkabau'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer rounded-full hover:bg-slate-100"
                title={lang === 'en' ? 'Minimize' : 'Kecilkan'}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Current Track Info */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-amber-50/50 p-2.5 rounded-xl border border-red-100/60">
              <div
                className={`w-10 h-10 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-md ${
                  isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                }`}
              >
                <Music className="w-5 h-5" />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {lang === 'en' ? currentTrack.titleEn : currentTrack.title}
                </span>
                <span className="text-[10px] font-medium text-slate-500 truncate">
                  {currentTrack.artist}
                </span>
              </div>
            </div>

            {/* Time Seek Bar */}
            <div className="flex flex-col gap-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 px-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls & Volume */}
            <div className="flex items-center justify-between pt-1">
              {/* Playlist Toggle */}
              {!customAudioUrl && (
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    showPlaylist
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={lang === 'en' ? 'Playlist' : 'Daftar Lagu'}
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">{lang === 'en' ? 'Tracks' : 'Lagu'}</span>
                </button>
              )}

              {/* Center Play Button */}
              <button
                onClick={togglePlay}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg transform hover:scale-105 active:scale-95 ${
                  isPlaying
                    ? 'bg-red-600 text-white shadow-red-500/30'
                    : 'bg-slate-900 text-white hover:bg-red-600'
                }`}
                aria-label="Play or Pause"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 translate-x-0.5" />
                )}
              </button>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <button
                  onClick={toggleMute}
                  className="p-1 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>

            {/* Playlist Drawer Section */}
            {showPlaylist && !customAudioUrl && (
              <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'en' ? 'Select Minang Track' : 'Pilih Instrumen Minang'}
                </span>
                {tracks.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={`flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer text-xs ${
                      selectedTrackIndex === idx
                        ? 'bg-red-50 text-red-700 font-bold border border-red-200'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Music className={`w-3.5 h-3.5 ${selectedTrackIndex === idx ? 'text-red-600' : 'text-slate-400'}`} />
                      <span className="truncate">{lang === 'en' ? track.titleEn : track.title}</span>
                    </div>
                    {selectedTrackIndex === idx && isPlaying && (
                      <span className="text-[10px] font-orbitron uppercase text-red-600 font-bold px-1.5 py-0.5 bg-red-100 rounded">
                        PLAYING
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
