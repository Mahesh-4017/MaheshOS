"use client";

import React from "react";
import {
  SkipBack,
  SkipForward,
  Plus,
  MoreHorizontal,
  Play,
} from "lucide-react";
import Image from "next/image";
// Update this path to wherever ThemeProvider.tsx actually lives
import { useTheme } from "@/ui/Themecontext";

// Swap these out for your own tracks.
// `href` is the Spotify link for that specific track (optional —
// falls back to the playlist link below if omitted).
const TRACKS = [
  { n: 1, title: "Ascend", artist: "parinaz", href: "https://open.spotify.com/track/REPLACE_ME_1" },
  { n: 2, title: "Neon Drift", artist: "wave.exe", href: "https://open.spotify.com/track/REPLACE_ME_2" },
  { n: 3, title: "Glass Horizon", artist: "Kelo", href: "https://open.spotify.com/track/REPLACE_ME_3" },
  { n: 4, title: "Static Bloom", artist: "Marrow", href: "https://open.spotify.com/track/REPLACE_ME_4" },
  { n: 5, title: "Low Tide", artist: "Ori", href: "https://open.spotify.com/track/REPLACE_ME_5" },
  { n: 6, title: "Echo Chamber", artist: "Vantablk", href: "https://open.spotify.com/track/REPLACE_ME_6" },
];

// Fallback link used by "View Playlist →" and the play button.
const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF";

// How many tracks to preview in the footer list before "View Playlist →"
const PREVIEW_COUNT = 3;

export default function NowPlaying() {
  const { active } = useTheme();

  const current = 1;
  const currentTrack = TRACKS.find((t) => t.n === current) ?? TRACKS[0];
  const previewTracks = TRACKS.slice(0, PREVIEW_COUNT);

  return (
    <div
      className="rounded-2xl z-10 h-41 border backdrop-blur-xl shadow-2xl flex flex-col justify-between p-4"
      style={{
        borderColor: `${active.accent}40`,
        background: `linear-gradient(135deg, ${active.from}CC, ${active.via}99, ${active.to}66)`,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-[10px] tracking-[3px] text-white">
          NOW PLAYING
        </p>
        <span className="text-[9px] text-white flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: active.dot }}
          />
          LIVE
        </span>
      </div>

      {/* Song */}
      <div className="flex gap-3 mt-1">
        <a
          href={currentTrack.href ?? SPOTIFY_PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-lg overflow-hidden shadow-md flex-shrink-0"
        >
          <Image
            src="/images/images.jpeg"
            alt={currentTrack.title}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </a>

        <div className="flex-1 overflow-hidden">
          <a
            href={currentTrack.href ?? SPOTIFY_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white truncate block hover:underline"
          >
            {currentTrack.title}
          </a>
          <p className="text-xs text-white/80 truncate">
            {currentTrack.artist}
          </p>

          <div className="mt-2 h-1 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full w-1/3"
              style={{ background: active.accent }}
            />
          </div>

          <div className="flex justify-between text-[9px] text-white/60 mt-1">
            <span>1:12</span>
            <span>3:45</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 text-white/80">
        <button aria-label="Previous track">
          <SkipBack size={16} />
        </button>
        <a
          href={currentTrack.href ?? SPOTIFY_PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Play on Spotify"
          className="hover:scale-110 transition rounded-full p-2 text-black flex items-center justify-center"
          style={{ backgroundColor: active.accent }}
        >
          <Play fill="currentColor" size={16} />
        </a>
        <button aria-label="Next track">
          <SkipForward size={16} />
        </button>
        <button aria-label="Add to library">
          <Plus size={16} />
        </button>
        <button aria-label="More options">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Playlist preview */}
      <div className="flex items-center justify-between text-[10px] text-white/80 mt-1">
        <div className="flex gap-2 overflow-hidden">
          {previewTracks.map((t, i) => (
            <React.Fragment key={t.n}>
              <a
                href={t.href ?? SPOTIFY_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-white"
                style={t.n === current ? { color: "white", fontWeight: 600 } : undefined}
              >
                {t.n}. {t.title}
              </a>
              {i < previewTracks.length - 1 && (
                <span className="text-white/40">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <a
          href={SPOTIFY_PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 ml-2 hover:opacity-80"
          style={{ color: active.accent }}
        >
          View Playlist →
        </a>
      </div>
    </div>
  );
}