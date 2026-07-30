import { useRef } from "react";
import { FolderIcon } from "./FolderIcon";
import type { AppIcon, AppId } from "@/data/Data";

export function DraggableIcon({
  app,
  pos,
  selected,
  onMove,
  onSelect,
  onOpen,
}: {
  app: AppIcon;
  pos: { x: number; y: number };
  selected: boolean;
  onMove: (id: AppId, x: number, y: number) => void;
  onSelect: (id: AppId) => void;
  onOpen: (id: AppId) => void;
}) {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    (e.target as Element).setPointerCapture(e.pointerId);
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    onSelect(app.id);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    if (e.movementX !== 0 || e.movementY !== 0) moved.current = true;
    onMove(app.id, e.clientX - offset.current.x, e.clientY - offset.current.y);
  };

  const onPointerUp = () => {
    dragging.current = false;
    if (!moved.current) onOpen(app.id);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ left: pos.x, top: pos.y }}
      className="absolute flex flex-col items-center gap-1 w-40 cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <FolderIcon palette={app.palette} size={60} iconSrc={app.iconSrc} />
    </div>
  );
}