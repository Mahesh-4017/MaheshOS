import {
  Search,
  Home,
  BookOpen,
  Headphones,
  Library,
  Clock,
  CheckCircle2,
  Book,
  FileText,
  Layers,
  Baby,
  Heart,
  Landmark,
  Star,
  Plus,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

type BookItem = {
  title: string;
  author: string;
  image: string;
  status:
    | { type: "new" }
    | { type: "progress"; percent: number }
    | { type: "finished" };
};

const BOOKS: BookItem[] = [
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    image: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
    status: { type: "new" },
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    image: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
    status: { type: "new" },
  },
  {
    title: "Superintelligence",
    author: "Nick Bostrom",
    image: "https://covers.openlibrary.org/b/isbn/9780198739838-L.jpg",
    status: { type: "new" },
  },
  {
    title: "Life 3.0",
    author: "Max Tegmark",
    image: "https://covers.openlibrary.org/b/isbn/9781101946596-L.jpg",
    status: { type: "progress", percent: 18 },
  },
  {
    title: "The Alignment Problem",
    author: "Brian Christian",
    image: "https://covers.openlibrary.org/b/isbn/9780393868333-L.jpg",
    status: { type: "progress", percent: 62 },
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    image: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    status: { type: "finished" },
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    image: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg",
    status: { type: "finished" },
  },
  {
    title: "Design Patterns",
    author: "Erich Gamma et al.",
    image: "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg",
    status: { type: "finished" },
  },
];

const LIBRARY_ITEMS = [
  { icon: Layers, label: "All" },
  { icon: Clock, label: "Want to Read" },
  { icon: CheckCircle2, label: "Finished" },
  { icon: Book, label: "Books" },
  { icon: Headphones, label: "Audiobooks" },
  { icon: FileText, label: "PDFs" },
  { icon: Layers, label: "My Samples" },
];

const COLLECTIONS = [
  { icon: Layers, label: "My Books", active: true },
  { icon: Baby, label: "Kids Books" },
  { icon: Heart, label: "Memoirs" },
  { icon: Book, label: "Book Club" },
  { icon: Landmark, label: "Historical Fiction" },
  { icon: Star, label: "Favorites" },
];


function Cover({ book }: { book: BookItem }) {
  return (
    <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
      <img
        src={book.image}
        alt={book.title}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
  );
}

export function NotebookContent() {
  return (
    <div className="flex h-[640px] w-full overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900">

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-white px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold">My Books</h1>
          <button className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-neutral-500 hover:bg-neutral-50">
            <MoreHorizontal className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-x-6 gap-y-8">
          {BOOKS.map((book) => (
            <div key={book.title} className="group">
              <Cover book={book} />
              <div className="mt-2 flex items-center justify-between">
                <MoreHorizontal className="h-4 w-4 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
