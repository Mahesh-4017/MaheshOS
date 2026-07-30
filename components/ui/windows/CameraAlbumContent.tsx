import { useState } from "react";

// Photos app style grid.
// Expects files at: public/album/image1.jpeg, public/album/image2.jpeg, ... public/album/image12.jpeg
// Change TOTAL_IMAGES / EXT if your files are named or numbered differently.

const TOTAL_IMAGES = 6;
const EXT = "jpeg";

export function CameraAlbumContent() {
  const [selected, setSelected] = useState<number | null>(null);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  const images = Array.from({ length: TOTAL_IMAGES }, (_, i) => ({
    id: i + 1,
    src: `/album/images${i + 1}.${EXT}`,
  }));

  return (
    <div className="w-full p-1">
      <div className="grid grid-cols-4 gap-[3px] sm:grid-cols-5 md:grid-cols-4">
        {images.map((img) => {
          const isSelected = selected === img.id;
          const hasFailed = failed[img.id];

          return (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(img.id)}
              className={`
                relative aspect-square overflow-hidden bg-neutral-900
                transition-transform duration-150 ease-out
                focus:outline-none
                ${isSelected ? "ring-2 ring-inset ring-blue-500 z-10" : ""}
              `}
            >
              {!hasFailed ? (
                <img
                  src={img.src}
                  alt={`Photo ${img.id}`}
                  loading="lazy"
                  draggable={false}
                  onError={() =>
                    setFailed((prev) => ({ ...prev, [img.id]: true }))
                  }
                  className="h-full min-w-full object-cover select-none
                             transition-transform duration-200 ease-out
                             hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-700 to-neutral-900 text-[10px] text-neutral-400">
                  image{img.id}.{EXT}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}