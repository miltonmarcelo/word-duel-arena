import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Dice5,
  Eye,
  Send,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { players } from "@/lib/mock-data";

type DirectWordSearch = {
  opp?: string;
  name?: string;
  handle?: string;
  rating?: number;
  mode?: string;
};

export const Route = createFileRoute("/play/direct-word")({
  validateSearch: (s: Record<string, unknown>): DirectWordSearch => ({
    opp: typeof s.opp === "string" ? s.opp : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
    handle: typeof s.handle === "string" ? s.handle : undefined,
    rating: typeof s.rating === "number" ? s.rating : Number(s.rating) || undefined,
    mode: typeof s.mode === "string" ? s.mode : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Choose your word — WordClash" },
      {
        name: "description",
        content:
          "Pick the secret 5-letter word your opponent will try to guess in your direct WordClash duel.",
      },
      { property: "og:title", content: "Choose your word — WordClash" },
      {
        property: "og:description",
        content:
          "Type, validate and send a custom 5-letter challenge to your opponent.",
      },
    ],
  }),
  component: DirectWord,
});

// ──────────────────────────────────────────────────────────────────────────────
// Word bank by category (visual prototype — not a real dictionary).
// ──────────────────────────────────────────────────────────────────────────────
type Category =
  | "general"
  | "cinema"
  | "sports"
  | "science"
  | "music"
  | "food";

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "general", label: "General", emoji: "✨" },
  { id: "cinema", label: "Cinema", emoji: "🎬" },
  { id: "sports", label: "Sports", emoji: "🏅" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "food", label: "Food", emoji: "🍜" },
];

const WORD_BANK: Record<Category, string[]> = {
  general: ["CRANE", "PLATE", "HOUSE", "LIGHT", "BREAD", "STORM", "RIVER", "CLOUD", "SHINE", "BRAVE", "DREAM", "EARTH"],
  cinema:  ["DRAMA", "ACTOR", "SCENE", "FRAME", "SCORE", "STARS", "SCRIPT".slice(0,5), "PLOTS", "FILMS", "REELS", "CREDS", "SHOTS"],
  sports:  ["MATCH", "SCORE", "COACH", "FIELD", "RALLY", "MEDAL", "TEAMS", "SPEED", "ARENA", "CLEAT", "SHOTS", "SLIDE"],
  science: ["ATOMS", "CELLS", "QUARK", "LIGHT", "ORBIT", "SOLAR", "PROTO".slice(0,5), "FORCE", "PRISM", "LASER", "PHASE", "GENES"],
  music:   ["CHORD", "NOTES", "DRUMS", "SCALE", "TEMPO", "PIANO", "STAGE", "VOCAL", "BLUES", "DISCO", "REMIX", "TUNES"],
  food:    ["BREAD", "PASTA", "SUSHI", "CURRY", "CREAM", "OLIVE", "MANGO", "PEACH", "HONEY", "BACON", "TACOS", "PIZZA"],
};

// Tiny "dictionary" check: word must be 5 letters and exist somewhere in the bank.
const FULL_DICT = new Set(Object.values(WORD_BANK).flat());

function isValidWord(w: string) {
  return /^[A-Z]{5}$/.test(w) && FULL_DICT.has(w);
}

// ──────────────────────────────────────────────────────────────────────────────
function DirectWord() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  // Visual prototype: prefer opponent passed via search params, else default.
  const opponent = useMemo(() => {
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
  }, [search.opp, search.name, search.handle, search.rating]);

  const [category, setCategory] = useState<Category>("general");
  const [word, setWord] = useState("");

  const trimmed = word.toUpperCase();
  const length = trimmed.length;
  const valid = isValidWord(trimmed);
  const tooShort = length < 5;
  const invalid = length === 5 && !valid;

  const suggestions = useMemo(() => WORD_BANK[category], [category]);

  function handlePick(w: string) {
    setWord(w);
  }

  function handleSurprise() {
    const list = WORD_BANK[category];
    const next = list[Math.floor(Math.random() * list.length)];
    setWord(next);
  }

  function handleSend() {
    if (!valid) return;
    toast.success("Challenge sent!", {
      description: `${opponent.name} will be notified to play "${trimmed}".`,
    });
    setTimeout(
      () => navigate({ to: "/play/challenge-sent" }),
      600,
    );
  }

  // Build 5 tiles for live preview (filled = letter typed, empty otherwise).
  const tiles = Array.from({ length: 5 }, (_, i) => trimmed[i] ?? "");

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto max-w-3xl">
        {/* Back link */}
        <button
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
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back
        </button>

        {/* Header */}
        <header className="page-header">
          <p className="page-eyebrow">
            <Sparkles className="size-3" /> Step 2 of 2 · Choose your word
          </p>
          <h1 className="page-title">Pick the secret word.</h1>
          <p className="page-subtitle">
            This is the 5-letter word {opponent.name.split(" ")[0]} will try to crack. Make
            it tricky — but fair.
          </p>
        </header>

        {/* Opponent strip */}
        <section
          className="surface-elevated relative mb-6 flex items-center gap-4 overflow-hidden p-4"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          <Avatar player={opponent} size={56} ring="lilac" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Challenging
            </p>
            <p className="truncate font-display text-xl leading-tight">
              {opponent.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {opponent.handle}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-sm font-semibold">
              <Trophy className="size-3.5 text-[var(--primary)]" /> {opponent.rating}
            </div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Rating
            </p>
          </div>
        </section>

        {/* Word input + validation */}
        <section className="surface-elevated mb-6 p-5">
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="word-input"
              className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Your secret word
            </label>
            <span
              className={cn(
                "text-xs font-mono tabular-nums",
                length === 5 ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {length}/5
            </span>
          </div>

          <div className="relative">
            <Input
              id="word-input"
              value={word}
              maxLength={5}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) =>
                setWord(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
              }
              placeholder="• • • • •"
              className={cn(
                "h-14 pr-12 text-center font-mono text-2xl uppercase tracking-[0.5em]",
                valid && "border-[var(--correct)] focus-visible:ring-[var(--correct)]",
                invalid && "border-[var(--destructive)] focus-visible:ring-[var(--destructive)]",
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {valid && (
                <span className="grid size-7 place-items-center rounded-full bg-[var(--correct)]/15 text-[var(--correct)]">
                  <Check className="size-4" strokeWidth={3} />
                </span>
              )}
              {invalid && (
                <span className="grid size-7 place-items-center rounded-full bg-[var(--destructive)]/15 text-[var(--destructive)]">
                  <X className="size-4" strokeWidth={3} />
                </span>
              )}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p
              className={cn(
                "text-xs",
                valid && "text-[var(--correct)]",
                invalid && "text-[var(--destructive)]",
                tooShort && "text-muted-foreground",
              )}
            >
              {tooShort && "Type a 5-letter English word."}
              {valid && "✓ Valid word — ready to send."}
              {invalid && "Not in our dictionary. Try another word."}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSurprise}
              className="gap-1.5"
            >
              <Dice5 className="size-3.5" /> Surprise me
            </Button>
          </div>
        </section>

        {/* Category chips */}
        <section className="mb-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Theme
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition",
                  category === c.id
                    ? "border-primary bg-primary/15 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <span className="text-sm leading-none">{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </section>

        {/* Suggestions grid */}
        <section className="surface-elevated mb-6 p-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Suggested words
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {suggestions.map((w) => {
              const active = w === trimmed;
              return (
                <button
                  key={w}
                  onClick={() => handlePick(w)}
                  className={cn(
                    "rounded-xl border px-2 py-2.5 text-center font-mono text-sm font-bold uppercase tracking-[0.18em] transition hover-lift",
                    active
                      ? "border-primary bg-primary/15 text-primary shadow-sm"
                      : "border-border bg-surface hover:border-primary/40",
                  )}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </section>

        {/* Opponent preview */}
        <section className="surface-elevated mb-6 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Eye className="size-4 text-muted-foreground" />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              How {opponent.name.split(" ")[0]} will see it
            </p>
          </div>
          <div className="flex justify-center gap-2">
            {tiles.map((_, i) => (
              <div
                key={i}
                className="grid h-14 w-14 place-items-center rounded-lg border-2 font-display text-2xl font-bold uppercase"
                style={{
                  background: "var(--absent)",
                  borderColor: "var(--absent)",
                  color: "var(--absent-foreground)",
                  opacity: 0.55,
                }}
                aria-label={`hidden letter ${i + 1}`}
              >
                ?
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Your word stays hidden until they start guessing.
          </p>
        </section>

        {/* CTA */}
        <div className="sticky bottom-4 z-10">
          <div className="surface-elevated flex items-center justify-between gap-3 p-3">
            <div className="min-w-0 px-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Selected word
              </p>
              <p className="font-mono text-sm font-bold tracking-[0.4em] text-foreground">
                {trimmed || "—————"}
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleSend}
              disabled={!valid}
              className="gap-2"
            >
              <Send className="size-4" /> Send Challenge
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
