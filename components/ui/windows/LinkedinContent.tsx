import Image from "next/image";
import { PROFILE } from "@/data/Data";

export function LinkedinContent({
  profileUrl = "https://linkedin.com/in/mahesh-sain",
}: {
  profileUrl?: string;
}) {
  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group cursor-pointer"
    >
      <div className="relative w-full items-center h-130">
        <Image
          src="/linkedin.jpg"
          alt={`${PROFILE.name} on LinkedIn`}
          fill
          sizes="100vw"
          className="object-cover scale-104 object-left"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-lg bg-white/90 text-sm font-medium text-neutral-800">
            View on LinkedIn ↗
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="font-semibold text-neutral-800">{PROFILE.name}</p>
        <p className="text-sm text-neutral-500">{PROFILE.role}</p>
      </div>
    </a>
  );
}