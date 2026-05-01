import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Filter,
  Library,
  Lock,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { players } from "@/lib/mock-data";

type WordPickSearch = {
  opp?: string;
  name?: string;
  handle?: string;
  rating?: number;
};

export const Route = createFileRoute("/play/word-pick")({
  validateSearch: (s: Record<string, unknown>): WordPickSearch => ({
    opp: typeof s.opp === "string" ? s.opp : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
    handle: typeof s.handle === "string" ? s.handle : undefined,
    rating: typeof s.rating === "number" ? s.rating : Number(s.rating) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pick a word — WordClash" },
      {
        name: "description",
        content:
          "Browse the WordClash curated word library. Filter by theme, length and difficulty, then lock in your secret word.",
      },
    ],
  }),
  component: WordPick,
});

// ── Types ────────────────────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard";
type Length = 4 | 5 | 6;

type Theme =
  | "general"
  | "cinema"
  | "sports"
  | "science"
  | "music"
  | "food"
  | "nature";

type WordEntry = { word: string; theme: Theme; difficulty: Difficulty };

const THEMES: { id: Theme; label: string; emoji: string }[] = [
  { id: "general", label: "General", emoji: "✨" },
  { id: "cinema", label: "Cinema", emoji: "🎬" },
  { id: "sports", label: "Sports", emoji: "🏅" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "nature", label: "Nature", emoji: "🌿" },
];

const LENGTHS: Length[] = [4, 5, 6];
const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

// Curated mock library
const LIBRARY: WordEntry[] = [
  // general
  { word: "HOUSE", theme: "general", difficulty: "easy" },
  { word: "LIGHT", theme: "general", difficulty: "easy" },
  { word: "PLATE", theme: "general", difficulty: "easy" },
  { word: "DREAM", theme: "general", difficulty: "medium" },
  { word: "BRAVE", theme: "general", difficulty: "medium" },
  { word: "CRYPT", theme: "general", difficulty: "hard" },
  { word: "GLYPH", theme: "general", difficulty: "hard" },
  { word: "FJORD", theme: "general", difficulty: "hard" },
  { word: "LOVE", theme: "general", difficulty: "easy" },
  { word: "CLOUDY", theme: "general", difficulty: "medium" },
  { word: "BRIGHT", theme: "general", difficulty: "medium" },
  // cinema
  { word: "ACTOR", theme: "cinema", difficulty: "easy" },
  { word: "SCENE", theme: "cinema", difficulty: "easy" },
  { word: "FRAME", theme: "cinema", difficulty: "medium" },
  { word: "SCORE", theme: "cinema", difficulty: "medium" },
  { word: "DRAMA", theme: "cinema", difficulty: "easy" },
  { word: "CAMEO", theme: "cinema", difficulty: "hard" },
  { word: "FILM", theme: "cinema", difficulty: "easy" },
  { word: "DIRECT", theme: "cinema", difficulty: "hard" },
  // sports
  { word: "MATCH", theme: "sports", difficulty: "easy" },
  { word: "COACH", theme: "sports", difficulty: "easy" },
  { word: "FIELD", theme: "sports", difficulty: "easy" },
  { word: "RALLY", theme: "sports", difficulty: "medium" },
  { word: "MEDAL", theme: "sports", difficulty: "medium" },
  { word: "ARENA", theme: "sports", difficulty: "medium" },
  { word: "GOAL", theme: "sports", difficulty: "easy" },
  { word: "REFEREE".slice(0, 6), theme: "sports", difficulty: "hard" },
  // science
  { word: "ATOMS", theme: "science", difficulty: "medium" },
  { word: "QUARK", theme: "science", difficulty: "hard" },
  { word: "ORBIT", theme: "science", difficulty: "medium" },
  { word: "SOLAR", theme: "science", difficulty: "easy" },
  { word: "PRISM", theme: "science", difficulty: "hard" },
  { word: "LASER", theme: "science", difficulty: "medium" },
  { word: "GENE", theme: "science", difficulty: "easy" },
  { word: "PHOTON", theme: "science", difficulty: "hard" },
  // music
  { word: "CHORD", theme: "music", difficulty: "medium" },
  { word: "NOTES", theme: "music", difficulty: "easy" },
  { word: "DRUMS", theme: "music", difficulty: "easy" },
  { word: "TEMPO", theme: "music", difficulty: "medium" },
  { word: "PIANO", theme: "music", difficulty: "easy" },
  { word: "VOCAL", theme: "music", difficulty: "medium" },
  { word: "BLUES", theme: "music", difficulty: "medium" },
  { word: "REMIX", theme: "music", difficulty: "hard" },
  { word: "JAZZ", theme: "music", difficulty: "easy" },
  { word: "ENCORE", theme: "music", difficulty: "hard" },
  // food
  { word: "BREAD", theme: "food", difficulty: "easy" },
  { word: "PASTA", theme: "food", difficulty: "easy" },
  { word: "SUSHI", theme: "food", difficulty: "medium" },
  { word: "CURRY", theme: "food", difficulty: "medium" },
  { word: "MANGO", theme: "food", difficulty: "easy" },
  { word: "OLIVE", theme: "food", difficulty: "medium" },
  { word: "TOFU", theme: "food", difficulty: "easy" },
  { word: "PAELLA".slice(0, 6), theme: "food", difficulty: "hard" },
  // nature
  { word: "RIVER", theme: "nature", difficulty: "easy" },
  { word: "STORM", theme: "nature", difficulty: "easy" },
  { word: "EARTH", theme: "nature", difficulty: "medium" },
  { word: "OCEAN", theme: "nature", difficulty: "easy" },
  { word: "TIDE", theme: "nature", difficulty: "easy" },
  { word: "AURORA".slice(0, 6), theme: "nature", difficulty: "hard" },
];

function difficultyMeta(d: Difficulty) {
  switch (d) {
    case "easy":
      return {
        label: "Easy",
        color: "var(--correct)",
        bg: "color-mix(in oklch, var(--correct) 18%, transparent)",
      };
    case "medium":
      return {
        label: "Medium",
        color: "var(--warning)",
        bg: "color-mix(in oklch, var(--warning) 22%, transparent)",
      };
    case "hard":
      return {
        label: "Hard",
        color: "var(--accent)",
        bg: "color-mix(in oklch, var(--accent) 22%, transparent)",
      };
  }
}

// ── Component ────────────────────────────────────────────────────────────────
function WordPick() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const opponent = (() => {
    const found = search.opp ? players.find((p) => p.id === search.opp) : undefined;
    if (found) return found;
    if (search.name) {
      return {
        ...players[0],
        name: search.name,
        handle: search.handle ?? players[0].handle,
        rating: search.rating ?? players[0].rating,
      };
    }
    return players[0];
  })();

  const [query, setQuery] = useState("");
  const [length, setLength] = useState<Length | "any">(5);
  const [theme, setTheme] = useState<Theme | "any">("any");
  const [difficulty, setDifficulty] = useState<Difficulty | "any">("any");
  const [selected, setSelected] = useState<WordEntry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    return LIBRARY.filter((w) => {
      if (q && !w.word.includes(q)) return false;
      if (length !== "any" && w.word.length !== length) return false;
      if (theme !== "any" && w.theme !== theme) return false;
      if (difficulty !== "any" && w.difficulty !== difficulty) return false;
      return true;
    });
  }, [query, length, theme, difficulty]);

  function clearFilters() {
    setQuery("");
    setLength("any");
    setTheme("any");
    setDifficulty("any");
  }

  function handleLock() {
    if (!selected) return;
    navigate({
      to: "/play/lock-word",
      search: {
        opp: search.opp,
        name: search.name,
        handle: search.handle,
        rating: search.rating,
        word: selected.word,
        from: "list",
      } as never,
    });
  }

  const activeFilterCount =
    (length !== "any" ? 1 : 0) +
    (theme !== "any" ? 1 : 0) +
    (difficulty !== "any" ? 1 : 0);

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto max-w-6xl">
        {/* Header */}
        <header className="page-header">
          <p className="page-eyebrow">
            <Library className="size-3" /> Step 3 of 3 · Pick a word
          </p>
          <h1 className="page-title">Browse the word library.</h1>
          <p className="page-subtitle">
            Filter by length, theme and difficulty. Tap a word to preview it, then
            lock it in for {opponent.name.split(" ")[0]} to crack.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr,1fr]">
          {/* LEFT — search, filters, grid */}
          <div className="space-y-5 pb-32 lg:pb-6">
            {/* Search */}
            <div className="surface-elevated p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value.replace(/[^a-zA-Z]/g, ""))}
                  className="h-11 pl-9 uppercase tracking-[0.2em]"
                  placeholder="Search words…"
                />
              </div>

              {/* Filters */}
              <div className="mt-4 space-y-3">
                <FilterRow label="Length">
                  <Chip
                    active={length === "any"}
                    onClick={() => setLength("any")}
                  >
                    Any
                  </Chip>
                  {LENGTHS.map((n) => (
                    <Chip
                      key={n}
                      active={length === n}
                      onClick={() => setLength(n)}
                    >
                      {n} letters
                    </Chip>
                  ))}
                </FilterRow>

                <FilterRow label="Theme">
                  <Chip active={theme === "any"} onClick={() => setTheme("any")}>
                    All themes
                  </Chip>
                  {THEMES.map((t) => (
                    <Chip
                      key={t.id}
                      active={theme === t.id}
                      onClick={() => setTheme(t.id)}
                    >
                      <span className="mr-1 leading-none">{t.emoji}</span>
                      {t.label}
                    </Chip>
                  ))}
                </FilterRow>

                <FilterRow label="Difficulty">
                  <Chip
                    active={difficulty === "any"}
                    onClick={() => setDifficulty("any")}
                  >
                    Any
                  </Chip>
                  {DIFFS.map((d) => {
                    const meta = difficultyMeta(d);
                    return (
                      <Chip
                        key={d}
                        active={difficulty === d}
                        onClick={() => setDifficulty(d)}
                        accentColor={meta.color}
                      >
                        <span
                          className="mr-1.5 inline-block size-1.5 rounded-full"
                          style={{ background: meta.color }}
                        />
                        {meta.label}
                      </Chip>
                    );
                  })}
                </FilterRow>
              </div>

              {(activeFilterCount > 0 || query) && (
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Filter className="size-3" />
                    {filtered.length} result{filtered.length === 1 ? "" : "s"}
                    {activeFilterCount > 0 &&
                      ` · ${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} active`}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="font-semibold uppercase tracking-wider text-primary hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Word grid */}
            {filtered.length === 0 ? (
              <div className="surface-elevated p-10 text-center">
                <p className="text-sm font-medium">No words match your filters.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try widening the search.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {filtered.map((entry) => (
                  <WordCard
                    key={entry.word + entry.theme}
                    entry={entry}
                    selected={selected?.word === entry.word && selected?.theme === entry.theme}
                    onClick={() => setSelected(entry)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — preview panel (sticky on desktop) */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <PreviewPanel
              entry={selected}
              opponent={opponent}
              onLock={handleLock}
              onBack={() =>
                navigate({
                  to: "/play/choose-word",
                  search: {
                    opp: search.opp,
                    name: search.name,
                    handle: search.handle,
                    rating: search.rating,
                  } as never,
                })
              }
            />
          </aside>
        </div>

        {/* Mobile sticky action bar */}
        <div
          className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/85 px-4 py-3 backdrop-blur-md sm:bottom-0 lg:hidden"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
        >
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Selected
              </p>
              <p className="truncate font-mono text-sm font-bold tracking-[0.3em]">
                {selected?.word ?? "—"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="lg"
              onClick={() =>
                navigate({
                  to: "/play/choose-word",
                  search: {
                    opp: search.opp,
                    name: search.name,
                    handle: search.handle,
                    rating: search.rating,
                  } as never,
                })
              }
              className="gap-1.5"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button size="lg" onClick={handleLock} disabled={!selected} className="gap-2">
              <Lock className="size-4" /> Lock Word
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────────

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  accentColor,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition",
        active
          ? "border-transparent text-primary-foreground shadow-sm"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
      style={
        active
          ? {
              background: accentColor ?? "var(--primary)",
              color: "var(--primary-foreground)",
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}

function WordCard({
  entry,
  selected,
  onClick,
}: {
  entry: WordEntry;
  selected: boolean;
  onClick: () => void;
}) {
  const meta = difficultyMeta(entry.difficulty);
  const themeMeta = THEMES.find((t) => t.id === entry.theme)!;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "surface-elevated group relative overflow-hidden p-3 text-center transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      {selected && (
        <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}

      <p className="font-mono text-base font-bold uppercase tracking-[0.2em]">
        {entry.word}
      </p>

      <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px]">
        <span className="text-muted-foreground" title={themeMeta.label}>
          {themeMeta.emoji}
        </span>
        <span
          className="rounded-full px-1.5 py-0.5 font-bold uppercase tracking-wider"
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.label}
        </span>
        <span className="text-muted-foreground">{entry.word.length}L</span>
      </div>
    </button>
  );
}

function PreviewPanel({
  entry,
  opponent,
  onLock,
  onBack,
}: {
  entry: WordEntry | null;
  opponent: (typeof players)[number];
  onLock: () => void;
  onBack: () => void;
}) {
  const tiles = entry ? entry.word.split("") : Array.from({ length: 5 }, () => "");
  const meta = entry ? difficultyMeta(entry.difficulty) : null;
  const themeMeta = entry ? THEMES.find((t) => t.id === entry.theme)! : null;

  return (
    <div
      className="surface-elevated overflow-hidden p-6"
      style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
    >
      <p className="page-eyebrow">
        <Sparkles className="size-3" /> Selection preview
      </p>

      {/* Opponent mini */}
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3 backdrop-blur">
        <Avatar player={opponent} size={40} ring="lilac" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">For {opponent.name}</p>
          <p className="truncate text-xs text-muted-foreground">{opponent.handle}</p>
        </div>
        <div className="inline-flex items-center gap-1 text-xs font-semibold">
          <Trophy className="size-3 text-[var(--primary)]" /> {opponent.rating}
        </div>
      </div>

      {/* Tiles */}
      <div className="mt-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Word preview
        </p>
        <div className="flex justify-center gap-1.5 sm:gap-2">
          {tiles.map((letter, i) => (
            <div
              key={i}
              className={cn(
                "grid h-12 w-12 place-items-center rounded-lg border-2 font-display text-xl font-bold uppercase transition-all duration-300 sm:h-14 sm:w-14 sm:text-2xl",
                entry
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-foreground"
                  : "border-border bg-muted/30 text-muted-foreground/40",
              )}
              style={entry ? { animationDelay: `${i * 60}ms` } : undefined}
            >
              {letter || "?"}
            </div>
          ))}
        </div>
      </div>

      {/* Meta */}
      {entry && meta && themeMeta ? (
        <div className="mt-5 grid grid-cols-3 gap-2">
          <MetaTile label="Length" value={`${entry.word.length}L`} />
          <MetaTile
            label="Theme"
            value={
              <span className="inline-flex items-center gap-1">
                {themeMeta.emoji} {themeMeta.label}
              </span>
            }
          />
          <MetaTile
            label="Difficulty"
            value={
              <span style={{ color: meta.color }} className="font-bold">
                {meta.label}
              </span>
            }
          />
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          Select a word from the library to preview it here.
        </div>
      )}

      <div className="divider-soft mt-6" />

      <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <Eye className="size-3" /> Stays hidden to {opponent.name.split(" ")[0]}{" "}
        until they start guessing.
      </p>

      {/* Actions (desktop only — mobile uses sticky bar) */}
      <div className="mt-5 hidden flex-col gap-2 lg:flex">
        <Button
          size="lg"
          onClick={onLock}
          disabled={!entry}
          className="w-full gap-2"
        >
          <Lock className="size-4" /> Lock Word
          <ArrowRight className="size-4" />
        </Button>
        <Button variant="ghost" size="lg" onClick={onBack} className="w-full gap-1.5">
          <ArrowLeft className="size-4" /> Back
        </Button>
      </div>
    </div>
  );
}

function MetaTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="surface-soft rounded-xl p-2.5 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
