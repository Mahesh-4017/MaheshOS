/* ------------------------------------------------------------------ */
/*  Folder color palettes                                             */
/* ------------------------------------------------------------------ */

export type FolderPalette = {
  back: [string, string]; // gradient stops for the rear tab/body
  front: [string, string]; // gradient stops for the front flap
  badge: string; // tint used behind/around the icon image, if needed
};

export const PALETTES: Record<string, FolderPalette> = {
  amber: { back: ["#E8B23D", "#C4881A"], front: ["#FFDE7A", "#F0B93D"], badge: "#5B4A15" },
  slate: { back: ["#3a3a3d", "#1a1a1c"], front: ["#5c5c60", "#2c2c2f"], badge: "#F5F5F5" },
  steel: { back: ["#9aa4b1", "#6b7280"], front: ["#c7ced6", "#98a2ae"], badge: "#33393f" },
  paper: { back: ["#e4ddcb", "#c9bd9e"], front: ["#faf6ec", "#e3d9bd"], badge: "#5c4d33" },
  ocean: { back: ["#3b82c4", "#1f5f95"], front: ["#7dd3ec", "#3fa8dd"], badge: "#0b3a57" },
  cream: { back: ["#d9c7a3", "#b89f74"], front: ["#f5ead2", "#e2ceA4"], badge: "#4a3c22" },
};

export type AppId =
  | "note"
  | "camera"
  | "github"
  | "notebook"
  | "linkedin"
  | "music"
  | "portfolio"
  | "pixelmator"

export type AppIcon = {
  id: AppId;
  label: string;
  iconSrc: string; // path under /public, e.g. "/icons/note.png"
  palette: FolderPalette;
};

// Assumes files live at public/icons/<name>.png — rename here if yours differ.
export const APP_ICONS: AppIcon[] = [
  { id: "note", label: "Notes", iconSrc: "/icons/notes.png", palette: PALETTES.amber },
  { id: "camera", label: "Camera", iconSrc: "/icons/cameraa.png", palette: PALETTES.slate },
  { id: "github", label: "GitHub", iconSrc: "/icons/github.png", palette: PALETTES.steel },
  { id: "notebook", label: "Notebook", iconSrc: "/icons/books.png", palette: PALETTES.slate },
  { id: "linkedin", label: "LinkedIn", iconSrc: "/icons/linkdon.png", palette: PALETTES.paper },
  { id: "music", label: "Music", iconSrc: "/icons/music.png", palette: PALETTES.slate },
  { id: "portfolio", label: "Portfolio", iconSrc: "/icons/pdf.png", palette: PALETTES.ocean },
  { id: "pixelmator", label: "Pixelmator", iconSrc: "/icons/Pixelmator.png", palette: PALETTES.cream },
];

/* ------------------------------------------------------------------ */
/*  Default desktop layout (folder starting positions)                */
/*  Only real desktop icons need a position — "resume" isn't a        */
/*  standalone icon, so it's omitted here. If you ever want a desktop */
/*  icon for it too, add both an APP_ICONS entry and a layout entry.  */
/* ------------------------------------------------------------------ */

export const INITIAL_LAYOUT: Record<Exclude<AppId, "resume">, { x: number; y: number }> = {
  note: { x: 210, y: 80 },
  camera: { x: 210, y: 220 },
  github: { x: 210, y: 290 },
  notebook: { x: 210, y: 360 },
  linkedin: { x: 210, y: 150 },
  music: { x: 210, y: 220 },
  portfolio: { x: 210, y: 290 },
  pixelmator: { x: 210, y: 360 },
};

/* ------------------------------------------------------------------ */
/*  Window metadata (title + size per app). Window body content is    */
/*  JSX and lives in the windows/ components, since Data.ts stays     */
/*  JSX-free. Sizes bumped up so the window/title are easier to read. */
/*                                                                      */
/*  "resume" is wider (two-column layout) and taller than the other   */
/*  windows to fit the Experience/Leadership grid comfortably.        */
/* ------------------------------------------------------------------ */

export const WINDOW_META: Record<AppId, { title: string; w: number; h: number }> = {
  note: { title: "Notes", w: 750, h: 450 },
  camera: { title: "Photos", w: 660, h: 540 },
  github: { title: "GitHub", w: 720, h: 440 },
  notebook: { title: "Notebook", w: 740, h: 440 },
  linkedin: { title: "LinkedIn", w: 760, h: 440 },
  music: { title: "Player", w: 760, h: 440 },
  portfolio: { title: "Portfolio", w: 760, h: 460 },
  pixelmator: { title: "Pixelmator", w: 760, h: 440 },
};

/* ------------------------------------------------------------------ */
/*  Sample content data (swap for real data/API calls later)          */
/* ------------------------------------------------------------------ */

// Data.ts
export const NOTES_DATA = [
  {
    filename: "artificial_intelligence.md",
    date: "30/07",
    body: `— thoughts on ai

Design is one of the few functions that ends up touching almost every other function.

The job changes because of that.

Visual craft is the baseline. The rest is communication, alignment, judgment, and making decisions under ambiguity.

A lot of the work is translation.

Business goals into product decisions.
Engineering constraints into tradeoffs.
Research into something a team can act on.
Different opinions into a direction.

This is why the role keeps expanding. Designers get pulled toward the parts of an organization that are unclear, unresolved, or moving.`,
  },
  {
    filename: "philosophy.md",
    date: "28/07",
    body: `Some scattered notes on philosophy — to expand later.`,
  },
  {
    filename: "values.md",
    date: "25/07",
    body: `What I optimize for, roughly in order.`,
  },
];
export const PORTFOLIO_FILES = ["resume.pdf"];


export const TRACKS = [
  {
    n: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    country: "UK",
    src: "/music1/song1.mp3", 
  },
  {
    n: 2,
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    country: "Puerto Rico",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    n: 3,
    title: "Shape of You",
    artist: "Ed Sheeran",
    country: "UK",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    n: 4,
    title: "Gangnam Style",
    artist: "PSY",
    country: "South Korea",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    n: 5,
    title: "Blinding Lights",
    artist: "The Weeknd",
    country: "Canada",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    n: 6,
    title: "Bad Guy",
    artist: "Billie Eilish",
    country: "USA",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    n: 7,
    title: "La Vie en Rose",
    artist: "Édith Piaf",
    country: "France",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    n: 8,
    title: "Waka Waka (This Time for Africa)",
    artist: "Shakira",
    country: "Colombia",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    n: 9,
    title: "Jai Ho",
    artist: "A. R. Rahman",
    country: "India",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
  {
    n: 10,
    title: "Imagine",
    artist: "John Lennon",
    country: "UK",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  },
];
export type SearchTrack = {
  n: number;
  title: string;
  artist: string;
  album: string;
  image: string;
  src: string;
};

export async function searchTracks(query: string): Promise<SearchTrack[]> {
  const res = await fetch(`/api/music-search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const json = await res.json();
  return json.tracks as SearchTrack[];
}

export const GITHUB_REPOS = [
  { name: "portfolio-site", desc: "Personal site built with Next.js", stars: 12, lang: "TypeScript" },
  { name: "design-tokens", desc: "Shared design token library", stars: 5, lang: "CSS" },
  { name: "figma-plugin", desc: "Utility plugin for Figma exports", stars: 8, lang: "JavaScript" },
];

export const LINKEDIN_POST = {
  name: "Mahesh",
  role: "Product Designer",
  post: "Excited to share a new case study on redesigning onboarding flows!",
};

export const PIXELMATOR_LAYERS = ["Background", "Shadow", "Icon", "Text", "Highlight"];

export const PROFILE = {
  name: "Mahesh",
  role: "Developer",
  location: "India",
  website: "https://mahesh-portfolio-01.netlify.app",
  email: "sain903481@gmail.com",
};

export const RESUME_URL = "/Mahesh-Sain-Resume.pdf"; // file goes in /public
export const PORTFOLIO_URL = "https://mahesh-portfolio-01.netlify.app";
export const RESUME_PHOTO = "/portfolio.jpg";