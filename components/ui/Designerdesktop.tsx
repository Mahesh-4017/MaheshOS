"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StickyNote,
  Camera,
  SlidersHorizontal,
  BookOpen,
  Newspaper,
  Clapperboard,
  Music2,
  IdCard,
  Play,
  SkipBack,
  SkipForward,
  Plus,
  MoreHorizontal,
  Award,
  Monitor,
  Trash2,
} from "lucide-react";
import { THEMES, useTheme, ThemeId } from "@/ui/Themecontext";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GiCactus, GiPalmTree } from "react-icons/gi";
import DragonGame from "./DragonGame";
import NowPlaying from "./NowPlaying";
import AppIcons from "./AppIcons";

const WEATHER = [
  { city: "New York", temp: 71, condition: "Light drizzle", icon: "🌦️" },
  { city: "San Francisco", temp: 59, condition: "Clear", icon: "☀️" },
];

const TRACKS = [
  { n: 1, title: "TERRITORY", artist: "T." },
  { n: 2, title: "Glue", artist: "BICEP" },
  { n: 3, title: "Moon (And It W...", artist: "" },
  { n: 4, title: "Oboe", artist: "Came..." },
];

const DOCK_APPS = [
  { id: "design", label: "Figma", image: "/images/Figma.jpg" },
  { id: "Antigravity", label: "Antigravity", image: "/images/Antigravity.jpg" },
  { id: "Framer", label: "Framer", image: "/images/Framer.jpg" },
  { id: "ChatGPT", label: "ChatGPT", image: "/images/ChatGPT.jpg" },
  { id: "Claude", label: "Claude", image: "/images/Claude.jpg" },
  { id: "Notion", label: "Notion", image: "/images/Notion.jpg" },
  { id: "Motion", label: "Motion", image: "/images/Motion.jpg" },
  { id: "Midjourney", label: "Midjourney", image: "/images/Midjourney.jpg" },
];

/* ------------------------------------------------------------------ */
/*  Theme switcher                                                     */
/* ------------------------------------------------------------------ */

function ThemeSwitcher({
  active,
  onChange,
}: {
  active: ThemeId;
  onChange: (id: ThemeId) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -50 : 50,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-[24px]
        border
        border-white/20
        bg-white/15
        backdrop-blur-3xl
        px-5
        py-3
        shadow-[0_20px_50px_rgba(0,0,0,.25),inset_0_1px_1px_rgba(255,255,255,.25)]
      "
    >
      {/* Title */}
      <div className="shrink-0">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/70">
          Appearance
        </p>
        <p className="text-xs text-white/50">Choose your theme</p>
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="
          shrink-0
          w-5.2
          h-5
          rounded-full
          bg-white/10
          border
          border-white/15
          backdrop-blur-xl
          flex
          items-center
          justify-center
          transition-all
          hover:bg-white/20
          hover:scale-110
        "
      >
        <ChevronLeft className="w-3 h-3 text-white" />
      </button>

      {/* Theme List */}
      <div
        ref={scrollRef}
        className="
          w-[350px]
          h-12
          overflow-x-auto
          overflow-y-hidden
          scrollbar-hide
          scroll-smooth
          px-1
        "
      >
        <div className="flex items-center gap-2 min-w-max h-full px-0.5">
          {THEMES.map((t) => (
            <button
              key={t.id}
              aria-label={t.id}
              onClick={() => onChange(t.id)}
              className={`
                relative
                shrink-0
                w-6
                h-6
                rounded-full
                transition-all
                duration-300
                hover:scale-125
                hover:-translate-y-1
                ${
                  active === t.id
                    ? "scale-110 ring-1 ring-white shadow-[0_0_0_4px_rgba(255,255,255,.15)]"
                    : "ring-1 ring-white/20"
                }
              `}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{ background: t.dot }}
              />

              {/* Gloss */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-transparent to-black/10" />

              {/* Active indicator */}
              {active === t.id && (
                <span className="absolute inset-[7px] rounded-full border border-white/80" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="
          shrink-0
          w-5.2
          h-5
          rounded-full
          bg-white/10
          border
          border-white/15
          backdrop-blur-xl
          flex
          items-center
          justify-center
          transition-all
          hover:bg-white/20
          hover:scale-110
        "
      >
        <ChevronRight className="w-3 h-3 text-white" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Weather card                                                       */
/* ------------------------------------------------------------------ */

function WeatherCard({
  city,
  temp,
  condition,
  icon,
}: {
  city: string;
  temp: number;
  condition: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur-md px-5 py-4 w-full shadow-lg">
      <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wide text-white/80">
        {city.toUpperCase()} <span className="text-white/50">▾</span>
      </div>
      <div className="text-4xl font-semibold text-white mt-2">{temp}°</div>
      <div className="flex items-center gap-1.5 text-xs text-white/80 mt-3">
        <span>{icon}</span> {condition}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dock                                                                */
/* ------------------------------------------------------------------ */

function Dock() {
  return (
    <div>
      <div className="text-center text-[10px] font-semibold tracking-widest text-white/70 mb-2">
        TECH STACK
      </div>
      <div className="flex items-end gap-2.5 rounded-2xl bg-white/20 backdrop-blur-md px-3 py-2.5 shadow-lg">
        {DOCK_APPS.map((a) => (
          <motion.button
            key={a.id}
            whileHover={{
              y: -18,
              scale: 1.45,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 18,
              },
            }}
            whileTap={{ scale: 1.1 }}
            className="group relative w-14 h-14 flex items-end justify-center"
          >
            <motion.div
              className="
        relative
        w-12
        h-12
        rounded-[24%]
        overflow-hidden
        bg-white/10
        backdrop-blur-xl
        shadow-[0_15px_30px_rgba(0,0,0,.35)]
      "
            >
              <Image
                src={a.image}
                alt={a.label}
                fill
                className="object-cover scale-125"
              />

              {/* Gloss */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/10" />
            </motion.div>

            {/* Reflection */}
            <div className="absolute top-full mt-1 h-5 w-10 overflow-hidden opacity-30 blur-[2px]">
              <Image
                src={a.image}
                alt=""
                fill
                className="object-cover scale-y-[-1]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
            </div>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="
        absolute
        -top-10
        rounded-lg
        bg-neutral-900/90
        px-2
        py-1
        text-[11px]
        text-white
        whitespace-nowrap
        pointer-events-none
      "
            >
              {a.label}
            </motion.div>
          </motion.button>
        ))}
        <div className="w-px h-9 bg-white/60 self-center" />
        {/* Separator */}
        <div className="flex items-center">
          <div className="bg-gradient-to-b from-white/60 via-white/20 to-white/60 rounded-full" />
        </div>

        {/* Trash */}
        <motion.button
          aria-label="Trash"
          whileHover={{
            y: -15,
            scale: 1.4,
            transition: {
              type: "spring",
              stiffness: 450,
              damping: 18,
            },
          }}
          whileTap={{ scale: 1.15 }}
          className="group relative flex items-end justify-center w-14 h-14"
        >
          <div
            className="
      relative
      w-12
      h-12
      rounded-[24%]
      overflow-hidden
      border
      border-white/20
      bg-white/15
      backdrop-blur-3xl
      shadow-[0_12px_30px_rgba(0,0,0,.35),inset_0_2px_2px_rgba(255,255,255,.35)]
      flex
      items-center
      justify-center
    "
          >
            <Trash2 className="w-6 h-6 text-neutral-700" />

            {/* Gloss */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/10" />
          </div>

          {/* Reflection */}
          <div className="absolute top-full mt-1 w-10 h-5 opacity-25 blur-[2px] overflow-hidden">
            <Trash2 className="w-6 h-6 text-neutral-700 scale-y-[-1] mx-auto" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
          </div>

          {/* Tooltip */}
          <div
            className="
      pointer-events-none
      absolute
      -top-10
      left-1/2
      -translate-x-1/2
      rounded-lg
      bg-neutral-900/95
      px-2
      py-1
      text-[11px]
      font-medium
      text-white
      opacity-0
      transition-all
      duration-150
      group-hover:opacity-100
      group-hover:-translate-y-1
      whitespace-nowrap
    "
          >
            Trash
          </div>
        </motion.button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                         */
/* ------------------------------------------------------------------ */

const INITIAL_LAYOUT: Record<string, { x: number; y: number }> = {
  note: { x: 340, y: 150 },
  camera: { x: 465, y: 155 },
  mixer: { x: 585, y: 150 },
  book: { x: 705, y: 145 },
  news: { x: 350, y: 300 },
  clap: { x: 470, y: 305 },
  music: { x: 590, y: 305 },
  card: { x: 710, y: 295 },
};

export default function DesignerDesktop() {
  const { theme, setTheme, active } = useTheme();

  return (
    <div
      className="relative w-full h-screen overflow-hidden transition-colors duration-500"
      style={{
        background: `linear-gradient(135deg, ${active.from}, ${active.via}, ${active.to})`,
      }}
    >
      {/* Top-left intro */}
      <div className="absolute top-12 left-6 max-w-xs text-white">
        <div className="text-[11px] font-bold tracking-[0.15em]">
          PRODUCT DESIGNER
        </div>
        <p className="text-sm mt-1 text-white/90">
          I help people understand complex systems.
        </p>
        <p className="text-sm mt-3 text-white/75 leading-relaxed">
          Through product design, information architecture, and visual craft, I
          transform complexity into experiences that feel intuitive.
        </p>
      </div>

      {/* Top-right controls */}
      <div className="absolute top-12 right-6 w-[300px] z-1 flex flex-col gap-4">
        <ThemeSwitcher active={theme} onChange={setTheme} />
        <div className="flex gap-3">
          <WeatherCard {...WEATHER[0]} />
          <WeatherCard {...WEATHER[1]} />
        </div>
        <DragonGame />
        <NowPlaying />
      </div>

      {/* Left badge */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-14 h-28 rounded-md bg-blue-600/90 text-white flex flex-col items-center justify-between py-3 shadow-lg">
          <span className="font-bold">W.</span>
          <span
            className="text-[11px] font-semibold tracking-widest"
            style={{ writingMode: "vertical-rl" }}
          >
            Nominee
          </span>
        </div>
        <div className="flex flex-col gap-3 mt-4">
          <button className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md">
            <Award className="w-5 h-5 text-neutral-700" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md">
            <Award className="w-5 h-5 text-neutral-700" />
          </button>
        </div>
      </div>

      {/* Retro computer, bottom left */}
      <div className="absolute bottom-14 left-6">
        <div className="w-14 h-12 rounded-md bg-[#c9c2ab] shadow-lg flex items-center justify-center">
          <div className="w-8 h-6 rounded-sm bg-[#2a2470]" />
        </div>
      </div>
      <div className="absolute bottom-4 left-6 text-[10px] text-white/70">
        © 2026 PARINAZ KASSEMI
      </div>

      {/* Draggable app icons */}
      <AppIcons initialPositions={INITIAL_LAYOUT} />

      {/* Dock */}
      <div className="absolute bottom-5 z-0 left-1/2 -translate-x-1/2">
        <Dock />
      </div>
    </div>
  );
}
