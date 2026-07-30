import { useRef } from "react";
import { WINDOW_META, type AppId } from "@/data/Data";
import { getWindowRenderer } from "../windows/windowRenderers";

export type OpenWindow = {
  appId: AppId;
  x: number;
  y: number;
  z: number;
};

export function WindowFrame({
  win,
  onClose,
  onFocus,
  onDrag,
  openWindow,
}: {
  win: OpenWindow;
  onClose: () => void;
  onFocus: () => void;
  onDrag: (x: number, y: number) => void;
  openWindow: (id: AppId) => void;
}) {
  const meta = WINDOW_META[win.appId];
  const render = getWindowRenderer(win.appId, openWindow);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onBarPointerDown = (e: React.PointerEvent) => {
    onFocus();
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    offset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
  };

  const onBarPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    onDrag(e.clientX - offset.current.x, e.clientY - offset.current.y);
  };

  const onBarPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      onPointerDown={onFocus}
      style={{ left: win.x, top: win.y, width: meta.w, zIndex: win.z }}
      className="fixed rounded-xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl border border-black/10"
    >
      <div
        onPointerDown={onBarPointerDown}
        onPointerMove={onBarPointerMove}
        onPointerUp={onBarPointerUp}
        className="h-11 flex items-center px-3 gap-2 bg-neutral-100/90 border-b border-black/5 cursor-grab active:cursor-grabbing touch-none select-none relative"
      >
        <button
          onClick={onClose}
          className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:brightness-90 z-10"
          aria-label="Close"
        />
        <span className="w-3.5 h-3.5 rounded-full bg-[#febc2e]" />
        <span className="w-3.5 h-3.5 rounded-full bg-[#28c840]" />
        <span className="absolute inset-x-0 text-center text-[15px] font-semibold text-neutral-800 pointer-events-none">
          {meta.title}
        </span>
      </div>

      <div style={{ maxHeight: meta.h }} className="overflow-y-auto">
        {render()}
      </div>
    </div>
  );
}