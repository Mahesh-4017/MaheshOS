"use client";

import { useRef, useState } from "react";
import { APP_ICONS, INITIAL_LAYOUT, type AppId } from "@/data/Data";
import { DraggableIcon } from "./desktop/DraggableIcon";
import { WindowFrame, type OpenWindow } from "./desktop/WindowFrame";
import { ContextMenu } from "./desktop/ContextMenu";

export default function AppIcons({
  initialPositions,
}: {
  initialPositions: Record<AppId, { x: number; y: number }>;
}) {
  const [positions, setPositions] = useState({ ...INITIAL_LAYOUT, ...initialPositions });
  const [selected, setSelected] = useState<AppId | null>(null);
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const zCounter = useRef(200);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasOpenWindow = windows.length > 0;

  const GRID = { originX: 370, originY: 80, colGap: 120, rowGap: 70, rows: 2 };

  const arrangeIcons = (order: "name-asc" | "name-desc") => {
    const sorted = [...APP_ICONS].sort((a, b) =>
      order === "name-asc" ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label)
    );
    const next: Record<AppId, { x: number; y: number }> = { ...positions };
    sorted.forEach((app, i) => {
      const col = Math.floor(i / GRID.rows);
      const row = i % GRID.rows;
      next[app.id] = { x: GRID.originX + col * GRID.colGap, y: GRID.originY + row * GRID.rowGap };
    });
    setPositions(next);
    setContextMenu(null);
  };

  const resetLayout = () => {
    setPositions({ ...INITIAL_LAYOUT });
    setContextMenu(null);
  };

  const handleMove = (id: AppId, x: number, y: number) => {
    setPositions((prev) => ({ ...prev, [id]: { x, y } }));
  };

  const openWindow = (appId: AppId) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId);
      zCounter.current += 1;
      if (existing) {
        return [{ ...existing, z: zCounter.current }];
      }
      const base = positions[appId] ?? { x: 200, y: 150 };
      return [{ appId, x: base.x + 40, y: base.y + 70, z: zCounter.current }];
    });
  };

  const closeWindow = (appId: AppId) => {
    setWindows((prev) => prev.filter((w) => w.appId !== appId));
  };

  const focusWindow = (appId: AppId) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((prev) => prev.map((w) => (w.appId === appId ? { ...w, z } : w)));
  };

  const dragWindow = (appId: AppId, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.appId === appId ? { ...w, x, y } : w)));
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => {
        if (hasOpenWindow) return;
        if (e.target === containerRef.current) setSelected(null);
        setContextMenu(null);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (hasOpenWindow) return;
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
      className="absolute z-0 inset-0"
    >
      <div
        className={`contents transition-[filter] duration-300 ${hasOpenWindow ? "blur-md" : ""}`}
        style={{ pointerEvents: hasOpenWindow ? "none" : "auto" }}
      >
        {APP_ICONS.map((app) => (
          <DraggableIcon
            key={app.id}
            app={app}
            pos={positions[app.id] ?? { x: 200, y: 150 }}
            selected={selected === app.id}
            onMove={handleMove}
            onSelect={setSelected}
            onOpen={openWindow}
          />
        ))}
      </div>

      {hasOpenWindow && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[100] transition-opacity duration-300" />
      )}

      {windows.map((w) => (
        <WindowFrame
          key={w.appId}
          win={w}
          openWindow={openWindow}
          onClose={() => closeWindow(w.appId)}
          onFocus={() => focusWindow(w.appId)}
          onDrag={(x, y) => dragWindow(w.appId, x, y)}
        />
      ))}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onSortAsc={() => arrangeIcons("name-asc")}
          onSortDesc={() => arrangeIcons("name-desc")}
          onReset={resetLayout}
          onStop={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}