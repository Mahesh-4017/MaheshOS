"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export const THEMES = [
  {
    id: "ocean",
    from: "#0F172A",
    via: "#1D4ED8",
    to: "#38BDF8",
    dot: "linear-gradient(135deg,#60A5FA,#2563EB)",
    headerBg: "#020617",
    accent: "#7DD3FC",
  },
  {
    id: "royal",
    from: "#2E1065",
    via: "#7C3AED",
    to: "#C084FC",
    dot: "linear-gradient(135deg,#C084FC,#7C3AED)",
    headerBg: "#1E1B4B",
    accent: "#DDD6FE",
  },
  {
    id: "emerald",
    from: "#052E2B",
    via: "#059669",
    to: "#34D399",
    dot: "linear-gradient(135deg,#6EE7B7,#10B981)",
    headerBg: "#022C22",
    accent: "#A7F3D0",
  },
  {
    id: "sunset",
    from: "#7C2D12",
    via: "#EA580C",
    to: "#FDBA74",
    dot: "linear-gradient(135deg,#FDBA74,#EA580C)",
    headerBg: "#431407",
    accent: "#FED7AA",
  },
  {
    id: "rose",
    from: "#4A044E",
    via: "#DB2777",
    to: "#FDA4AF",
    dot: "linear-gradient(135deg,#FDA4AF,#DB2777)",
    headerBg: "#3B0764",
    accent: "#FBCFE8",
  },
  {
    id: "gold",
    from: "#3F2A00",
    via: "#D97706",
    to: "#FCD34D",
    dot: "linear-gradient(135deg,#FCD34D,#D97706)",
    headerBg: "#422006",
    accent: "#FDE68A",
  },
  {
    id: "crimson",
    from: "#450A0A",
    via: "#DC2626",
    to: "#F87171",
    dot: "linear-gradient(135deg,#FCA5A5,#DC2626)",
    headerBg: "#2B0606",
    accent: "#FECACA",
  },
  {
    id: "midnight",
    from: "#020617",
    via: "#1E293B",
    to: "#475569",
    dot: "linear-gradient(135deg,#94A3B8,#334155)",
    headerBg: "#000000",
    accent: "#E2E8F0",
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  active: (typeof THEMES)[number];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeId>("ocean");

  const active = THEMES.find((t) => t.id === theme)!;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        active,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return ctx;
}