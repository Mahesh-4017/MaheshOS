import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing q param" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=15`
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Deezer request failed" }, { status: 502 });
  }

  const json = await res.json();

  const tracks = json.data.map((t: any) => ({
    n: t.id,
    title: t.title,
    artist: t.artist?.name ?? "Unknown",
    album: t.album?.title ?? "",
    image: t.album?.cover_medium ?? "",
    src: t.preview,
  }));

  return NextResponse.json({ tracks });
}