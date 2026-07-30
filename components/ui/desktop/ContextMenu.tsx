export function ContextMenu({
  x,
  y,
  onSortAsc,
  onSortDesc,
  onReset,
  onStop,
}: {
  x: number;
  y: number;
  onSortAsc: () => void;
  onSortDesc: () => void;
  onReset: () => void;
  onStop: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      onPointerDown={onStop}
      style={{ left: x, top: y, zIndex: 9999 }}
      className="absolute w-48 rounded-lg bg-white/95 backdrop-blur-xl border border-black/10 shadow-2xl py-1 text-sm text-neutral-700 overflow-hidden"
    >
      <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
        Sort by
      </div>
      <button onClick={onSortAsc} className="w-full text-left px-3 py-1.5 hover:bg-black/5">
        Name (A → Z)
      </button>
      <button onClick={onSortDesc} className="w-full text-left px-3 py-1.5 hover:bg-black/5">
        Name (Z → A)
      </button>
      <div className="my-1 border-t border-black/5" />
      <button onClick={onReset} className="w-full text-left px-3 py-1.5 hover:bg-black/5">
        Clean Up (Reset Layout)
      </button>
    </div>
  );
}