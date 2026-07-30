import Image from "next/image";
import type { FolderPalette } from "@/data/Data";

export function FolderIcon({
  palette,
  size = 64,
  iconSrc,
}: {
  palette: FolderPalette;
  size?: number;
  iconSrc: string;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-x-0 flex items-center justify-center" style={{ top: "10%" }}>
        <div className="relative w-14 h-14">
          <Image src={iconSrc} alt="" fill sizes="54px" className="object-cover drop-shadow-sm" />
        </div>
      </div>
    </div>
  );
}