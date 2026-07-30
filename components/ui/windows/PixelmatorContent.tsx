"use client";

import { useEffect, useRef, useState } from "react";
// Painterro is a vanilla-JS image editor: it ships its own toolbar with
// brush, eraser, shapes (line/rect/ellipse/arrow), text (with font size,
// bold/italic/underline), crop, resize, zoom, bucket fill, and save —
// so we mount it directly instead of hand-building those tools.

export function PixelmatorContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mod: any = await import("painterro");
        const PainterroModule = mod.default ?? mod;
        if (cancelled || !containerRef.current) return;

        if (typeof PainterroModule !== "function") {
          throw new Error(
            "painterro import did not resolve to a callable function — check the package installed correctly."
          );
        }

        // Assign the id only after mount (client-side only) to avoid any
        // server/client id mismatch during hydration.
        const id = `painterro-${Math.random().toString(36).slice(2)}`;
        containerRef.current.id = id;

        instanceRef.current = PainterroModule({
          id,
          defaultSize: "fill",
          defaultTool: "brush",
          toolbarPosition: "top",
          hiddenTools: ["close"],
          saveHandler: (image: any, done: (ok: boolean) => void) => {
            // Hook this up to your own save/upload/export logic.
            const dataUrl = image.asDataURL("image/png");
            console.log("Exported drawing:", dataUrl);
            done(true);
          },
        });

        instanceRef.current.show();
      } catch (e) {
        console.error(e);
        setError(
          "Couldn't load the drawing editor. Make sure `painterro` is installed (npm install painterro)."
        );
      }
    })();

    return () => {
      cancelled = true;
      instanceRef.current = null;
    };
  }, []);

  return (
    <div className="flex h-[560px] w-full flex-col bg-neutral-50">
      {error ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-neutral-500">
          {error}
        </div>
      ) : (
        <div ref={containerRef} className="relative h-full w-full" />
      )}
    </div>
  );
}