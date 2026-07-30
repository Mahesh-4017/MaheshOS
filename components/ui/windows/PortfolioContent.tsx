"use client";

import Image from "next/image";
import { PROFILE, RESUME_URL, PORTFOLIO_URL, RESUME_PHOTO } from "@/data/Data";

export function PortfolioContent() {
  return (
    <div className="bg-[#f2efe9] text-neutral-800">
      <div className="flex items-center justify-between px-8 py-3 text-[11px] tracking-wide text-neutral-500 border-b border-black/5">
        <span>{PROFILE.location}</span>
        <span>{PROFILE.website}</span>
        <span>{PROFILE.email}</span>
      </div>

      <div className="relative w-full h-[350px] overflow-y-auto">
        <div className="relative w-full h-[1100px]">
          <Image
            src={RESUME_PHOTO}
            alt={PROFILE.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="border-t border-black/10 px-8 py-4 flex justify-end gap-3 bg-[#ece8e0]">
        
          <a href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/10 bg-white text-neutral-700 text-xs font-medium hover:bg-black/[0.03] transition-colors"
        >
          Download PDF
        </a>
        
          <a href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
        >
          View Full Portfolio ↗
        </a>
      </div>
    </div>
  );
}