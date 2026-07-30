import { useState } from "react";
import { NOTES_DATA } from "@/data/Data";

export function NotesContent() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = NOTES_DATA[activeIdx];

  return (
    <div className="flex h-full font-mono text-[13px]">
      <div className="w-44 shrink-0 border-r border-black/5 py-3">
        <p className="px-4 text-[11px] tracking-widest text-neutral-400 mb-2">notes</p>
        <div>
          {NOTES_DATA.map((n, i) => (
            <button
              key={n.filename}
              onClick={() => setActiveIdx(i)}
              className={`w-full text-left px-4 py-1.5 border-l-2 transition-colors ${
                i === activeIdx
                  ? "border-black font-semibold text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {n.filename}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="text-neutral-400 mb-1">Note &nbsp;·&nbsp; {active.date}</p>
        <p className="text-neutral-800 mb-4">{active.filename}</p>
        <div className="whitespace-pre-line leading-relaxed text-neutral-700">{active.body}</div>
      </div>
    </div>
  );
}