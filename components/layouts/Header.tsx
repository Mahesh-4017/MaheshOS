"use client";

import React from "react";
import { useTheme } from "@/ui/Themecontext";

interface HeaderProps {
  userName?: string;
  siteLabel?: string;
  date?: string;
  time?: string;
}

export default function Header({
  userName = "MAHESH",
  siteLabel = "jnpr.labs",
  date = "Jul 29",
  time = "1:33 AM",
}: HeaderProps) {
  const { active } = useTheme();

  return (
    <header
  className="w-full fixed top-0 left-0 right-0 z-50 text-neutral-300 text-sm transition-colors duration-500"
  style={{ backgroundColor: active.headerBg }}
>
      <div className="flex items-center justify-between px-4 py-2.5 max-w-screen-2xl mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-5">
          <button
            aria-label="Account"
            className="text-neutral-400 transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = active.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-5 h-5"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          <span className="font-semibold text-white">{userName}</span>

          <nav className="flex items-center gap-4 text-neutral-400">
            <a
              href="#"
              className="transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.color = active.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              Edit
            </a>
            <a
              href="#"
              className="transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.color = active.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              Help
            </a>
          </nav>

          <span className="text-neutral-500">{siteLabel}</span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 text-neutral-400">
          <a
            href="#"
            aria-label="Instagram"
            className="transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = active.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-[18px] h-[18px]"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>

          <a
            href="#"
            aria-label="LinkedIn"
            className="transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = active.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[18px] h-[18px]"
            >
              <path d="M4.98 3.5C4.98 4.88 3.94 6 2.5 6S0 4.88 0 3.5 1.06 1 2.5 1 4.98 2.12 4.98 3.5zM.24 8.25h4.5V23h-4.5V8.25zM8.5 8.25h4.3v2.01h.06c.6-1.13 2.06-2.32 4.24-2.32 4.54 0 5.38 2.99 5.38 6.87V23h-4.5v-6.94c0-1.66-.03-3.79-2.31-3.79-2.32 0-2.67 1.81-2.67 3.67V23h-4.5V8.25z" />
            </svg>
          </a>

          <a
            href="#"
            aria-label="X"
            className="transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = active.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[16px] h-[16px]"
            >
              <path d="M18.24 2h3.3l-7.2 8.23L23 22h-6.63l-5.2-6.8L4.9 22H1.6l7.7-8.8L1 2h6.8l4.7 6.2L18.24 2zm-1.16 18h1.83L7.02 4h-1.96l11.02 16z" />
            </svg>
          </a>

          <span className="text-neutral-500 ml-1">{date}</span>
          <span style={{ color: active.accent }}>{time}</span>
        </div>
      </div>
    </header>
  );
}