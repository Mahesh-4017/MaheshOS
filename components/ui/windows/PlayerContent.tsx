"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Rewind,
  Play,
  Pause,
  FastForward,
  Search,
  ListMusic,
  Disc3,
  SlidersHorizontal,
  Rss,
  Cloud,
  ChevronRight,
  User,
  Upload,
} from "lucide-react";
import { TRACKS, searchTracks, type SearchTrack } from "@/data/Data";

type Tab = "library" | "nowplaying" | "eq" | "stream" | "cloud";

const COVER_ACCENTS = [
  "from-orange-400 to-red-500",
  "from-sky-400 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-fuchsia-400 to-purple-600",
  "from-amber-300 to-orange-600",
];

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type AudioGraph = {
  ctx: AudioContext;
  bass: BiquadFilterNode;
  treble: BiquadFilterNode;
};

export function PlayerContent() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bassRef = useRef<BiquadFilterNode | null>(null);
  const trebleRef = useRef<BiquadFilterNode | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1, for the scrub bar
  const [tab, setTab] = useState<Tab>("nowplaying");
  const [source, setSource] = useState<"cloud" | "itunes">("cloud");
  const [showRecent, setShowRecent] = useState(true);
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);

  // ---- Search (Deezer via /api/music-search) ----
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchTrack[]>([]);
  const [searching, setSearching] = useState(false);

  // When a search result is chosen, it takes over "now playing" without
  // touching the TRACKS index. null means "playing from the TRACKS library".
  const [customTrack, setCustomTrack] = useState<SearchTrack | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setSearching(true);
      const results = await searchTracks(query);
      setSearchResults(results);
      setSearching(false);
    }, 400); // debounce so we don't hit the API on every keystroke

    return () => clearTimeout(handle);
  }, [query]);

  const libraryTrack = TRACKS[currentIndex];
  // Unified "now playing" — either a library track or an active search result.
  const current = customTrack ?? libraryTrack;

  const recent = TRACKS.slice(0, 1);
  const albums = TRACKS.slice(1);

  // Wire up a real (optional) bass/treble EQ via the Web Audio API.
  // If it fails (e.g. CORS on the demo audio host), playback still works
  // normally through the plain <audio> element — the EQ just won't apply.
  useEffect(() => {
    const audioEl = audioRef.current as
      | (HTMLAudioElement & { _voxGraph?: AudioGraph })
      | null;
    if (!audioEl) return;

    // Strict Mode (dev) mounts effects twice. createMediaElementSource()
    // can only ever be called once per <audio> element, so if we already
    // wired this element up, just reuse the existing graph instead of
    // trying (and failing) to build a second one.
    if (audioEl._voxGraph) {
      audioCtxRef.current = audioEl._voxGraph.ctx;
      bassRef.current = audioEl._voxGraph.bass;
      trebleRef.current = audioEl._voxGraph.treble;
      return;
    }

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const srcNode = ctx.createMediaElementSource(audioEl);
      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = "lowshelf";
      bassFilter.frequency.value = 200;
      const trebleFilter = ctx.createBiquadFilter();
      trebleFilter.type = "highshelf";
      trebleFilter.frequency.value = 3000;

      srcNode.connect(bassFilter);
      bassFilter.connect(trebleFilter);
      trebleFilter.connect(ctx.destination);

      audioEl._voxGraph = { ctx, bass: bassFilter, treble: trebleFilter };
      audioCtxRef.current = ctx;
      bassRef.current = bassFilter;
      trebleRef.current = trebleFilter;
    } catch {
      // CORS or unsupported — silently fall back to unmodified playback.
    }
    // Deliberately no cleanup that closes the context: doing so would
    // permanently break this <audio> element's audio output, and there's
    // only one instance of it for the app's lifetime.
  }, []);

  useEffect(() => {
    if (bassRef.current) bassRef.current.gain.value = bass;
  }, [bass]);

  useEffect(() => {
    if (trebleRef.current) trebleRef.current.gain.value = treble;
  }, [treble]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  const playIndex = (i: number) => {
    setCustomTrack(null); // switch back to library playback
    setCurrentIndex(i);
    requestAnimationFrame(() => audioRef.current?.play().catch(() => {}));
  };

  const playSearchResult = (t: SearchTrack) => {
    setCustomTrack(t);
    requestAnimationFrame(() => audioRef.current?.play().catch(() => {}));
  };

  const playNext = () => {
    if (customTrack) {
      // no natural "next" within search results yet — just replay it
      requestAnimationFrame(() => audioRef.current?.play().catch(() => {}));
      return;
    }
    playIndex((currentIndex + 1) % TRACKS.length);
  };

  const playPrev = () => {
    if (customTrack) {
      requestAnimationFrame(() => audioRef.current?.play().catch(() => {}));
      return;
    }
    playIndex((currentIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  const seekTo = (ratio: number) => {
    const el = audioRef.current;
    if (!el || !isFinite(el.duration)) return;
    el.currentTime = ratio * el.duration;
  };

  const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "library", label: "Library", icon: ListMusic },
    { id: "nowplaying", label: "Now Playing", icon: Disc3 },
    { id: "eq", label: "Equalizer", icon: SlidersHorizontal },
    { id: "stream", label: "Stream", icon: Rss },
    { id: "cloud", label: "Cloud", icon: Cloud },
  ];

  const accent = COVER_ACCENTS[currentIndex % COVER_ACCENTS.length];

  return (
    <div className="flex h-[640px] w-full max-w-5xl mx-auto overflow-hidden rounded-2xl bg-neutral-950 text-neutral-200 shadow-2xl ring-1 ring-white/5">
      <audio
        ref={audioRef}
        src={current.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={playNext}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setRemaining(el.duration - el.currentTime);
          setProgress(el.duration ? el.currentTime / el.duration : 0);
        }}
      />

      {/* ---------------- LEFT: library sidebar ---------------- */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-white/5 bg-neutral-900/60">
        {/* Source switch */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => setSource("cloud")}
              className={`pb-2 border-b-2 transition-colors ${
                source === "cloud"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              VOX Cloud
            </button>
            <button
              onClick={() => setSource("itunes")}
              className={`pb-2 border-b-2 transition-colors ${
                source === "itunes"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              iTunes
            </button>
          </div>
          <div className="flex items-center gap-3 pb-2 text-neutral-500">
            <button className="hover:text-white transition-colors">
              <User className="h-4 w-4" />
            </button>
            <button className="hover:text-white transition-colors">
              <Upload className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mx-4 mt-3 rounded-md bg-white/5 px-2.5 py-1.5 text-neutral-500">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search library"
            className="w-full bg-transparent text-xs text-neutral-300 placeholder:text-neutral-600 outline-none"
          />
        </div>

        {/* Scrollable list */}
        <div className="mt-2 flex-1 overflow-y-auto pb-3">
          {query.trim() ? (
            // ---- Search results (Deezer previews) ----
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-medium text-neutral-500">
                {searching ? "Searching…" : `Results for "${query}"`}
              </p>
              {!searching && searchResults.length === 0 && (
                <p className="px-4 py-2 text-xs text-neutral-600">No results</p>
              )}
              {searchResults.map((t, i) => (
                <button
                  key={t.n}
                  onClick={() => playSearchResult(t)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                    customTrack?.n === t.n ? "bg-white/5" : "hover:bg-white/[0.03]"
                  }`}
                >
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.title}
                      className="h-10 w-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div
                      className={`h-10 w-10 shrink-0 rounded-md bg-gradient-to-br ${
                        COVER_ACCENTS[i % COVER_ACCENTS.length]
                      }`}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white">{t.title}</p>
                    <p className="truncate text-xs text-neutral-500">{t.artist}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-600" />
                </button>
              ))}
              <p className="px-4 pt-3 pb-1 text-[10px] text-neutral-600">
                30-second previews via Deezer
              </p>
            </div>
          ) : (
            // ---- Regular library view ----
            <>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <p className="text-xs font-medium text-neutral-500">Recently Added</p>
                <button
                  onClick={() => setShowRecent((v) => !v)}
                  className="text-xs font-medium text-orange-500 hover:text-orange-400"
                >
                  {showRecent ? "Hide" : "Show"}
                </button>
              </div>
              {showRecent &&
                recent.map((t, i) => (
                  <TrackRow
                    key={t.n}
                    index={i}
                    track={t}
                    active={!customTrack && i === currentIndex}
                    onPlay={() => playIndex(i)}
                  />
                ))}

              <p className="px-4 pt-4 pb-1 text-xs font-medium text-neutral-500">Albums</p>
              <div className="px-4 py-1 text-[11px] font-semibold text-neutral-600">A</div>
              {albums.map((t, i) => (
                <TrackRow
                  key={t.n}
                  index={i + recent.length}
                  track={t}
                  active={!customTrack && i + recent.length === currentIndex}
                  onPlay={() => playIndex(i + recent.length)}
                />
              ))}
            </>
          )}
        </div>

        {/* Format bar pinned to sidebar bottom */}
        <div className="border-t border-white/5 px-4 py-2 text-[10px] uppercase tracking-wide text-neutral-600">
          FLAC | 1114kbps | 16bit | 44.1kHz | Stereo
        </div>
      </aside>

      {/* ---------------- RIGHT: now playing / eq panel ---------------- */}
      <section className="flex flex-1 flex-col">
        {/* Section tabs */}
        <div className="flex items-center justify-center gap-8 border-b border-white/5 py-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="relative flex flex-col items-center gap-1"
            >
              <Icon
                className={`h-4 w-4 ${tab === id ? "text-orange-500" : "text-neutral-500"}`}
              />
              <span
                className={`text-[10px] ${tab === id ? "text-orange-500" : "text-neutral-600"}`}
              >
                {label}
              </span>
              {tab === id && (
                <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-orange-500" />
              )}
            </button>
          ))}
        </div>

        {tab === "eq" ? (
          <div className="flex flex-1 flex-col justify-center gap-8 px-16">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Equalizer
            </p>
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-2">
                <span>Bass</span>
                <span>{bass > 0 ? `+${bass}` : bass} dB</span>
              </div>
              <input
                type="range"
                min={-15}
                max={15}
                value={bass}
                onChange={(e) => setBass(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-2">
                <span>Treble</span>
                <span>{treble > 0 ? `+${treble}` : treble} dB</span>
              </div>
              <input
                type="range"
                min={-15}
                max={15}
                value={treble}
                onChange={(e) => setTreble(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-10">
            {/* Big cover art */}
            {customTrack?.image ? (
              <img
                src={customTrack.image}
                alt={customTrack.title}
                className="h-52 w-52 rounded-xl object-cover shadow-lg shadow-black/40"
              />
            ) : (
              <div
                className={`h-52 w-52 rounded-xl bg-gradient-to-br ${accent} shadow-lg shadow-black/40 flex items-end justify-start p-3`}
              >
                <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-orange-400">
                  FLAC
                </span>
              </div>
            )}

            {/* Title / artist */}
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold text-white">{current.title}</p>
              <p className="mt-1 text-sm text-neutral-400">{current.artist}</p>
            </div>

            {/* Scrub bar */}
            <div className="mt-6 w-full max-w-md">
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={isFinite(progress) ? progress : 0}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="mt-1 flex justify-between text-[11px] text-neutral-500">
                <span>{formatTime(audioRef.current?.currentTime ?? 0)}</span>
                <span>-{formatTime(remaining)}</span>
              </div>
            </div>

            {/* Transport controls */}
            <div className="mt-6 flex items-center gap-8 text-neutral-300">
              <button className="hover:text-white transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
              <button onClick={playPrev} className="hover:text-white transition-colors">
                <Rewind className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlay}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>
              <button onClick={playNext} className="hover:text-white transition-colors">
                <FastForward className="h-5 w-5" />
              </button>
              <button className="hover:text-white transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function TrackRow({
  index,
  track,
  active,
  onPlay,
}: {
  index: number;
  track: (typeof TRACKS)[number];
  active: boolean;
  onPlay: () => void;
}) {
  const accent = COVER_ACCENTS[index % COVER_ACCENTS.length];
  return (
    <button
      onClick={onPlay}
      className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
        active ? "bg-white/5" : "hover:bg-white/[0.03]"
      }`}
    >
      <div className="relative shrink-0">
        <div className={`h-10 w-10 rounded-md bg-gradient-to-br ${accent}`} />
        <span className="absolute -bottom-1 -left-1 rounded bg-orange-500 px-1 text-[8px] font-bold text-black">
          FLAC
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white">{track.title}</p>
        <p className="truncate text-xs text-neutral-500">{track.artist}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-neutral-600" />
    </button>
  );
}