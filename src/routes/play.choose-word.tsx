import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Keyboard,
  ListChecks,
  Sparkles,
  Trophy,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { players } from "@/lib/mock-data";

type ChooseWordSearch = {
  opp?: string;
  name?: string;
  handle?: string;
  rating?: number;
};

export const Route = createFileRoute("/play/choose-word")({
  validateSearch: (s: Record<string, unknown>): ChooseWordSearch => ({
    opp: typeof s.opp === "string" ? s.opp : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
    handle: typeof s.handle === "string" ? s.handle : undefined,
    rating: typeof s.rating === "number" ? s.rating : Number(s.rating) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Choose your word — WordClash" },
      {
        name: "description",
        content:
          "Pick how you want to set the secret word for your duel — type it yourself or pick from a curated list.",
      },
    ],
  }),
  component: ChooseWord,
});

type Mode = "manual" | "list";

function ChooseWord() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<Mode | null>(null);

  // Visual prototype: prefer opponent passed via search params, else default.
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

  function handleContinue() {
    if (!mode) return;
    const passthrough = {
      opp: search.opp,
      name: search.name,
      handle: search.handle,
      rating: search.rating,
    } as never;
    if (mode === "manual") {
      navigate({ to: "/play/direct-word", search: passthrough });
    } else {
      navigate({ to: "/play/word-pick", search: passthrough });
    }
  }

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto max-w-3xl">
        {/* Header */}
        <header className="page-header">
          <p className="page-eyebrow">
            <Sparkles className="size-3" /> Step 2 of 3 · Choose your word
          </p>
          <h1 className="page-title">How do you want to set the word?</h1>
          <p className="page-subtitle">
            Pick the secret 5-letter word {opponent.name.split(" ")[0]} will try to
            crack — type your own or grab one from a curated list.
          </p>
        </header>

        {/* Opponent strip */}
        <section
          className="surface-elevated relative mb-6 flex items-center gap-4 overflow-hidden p-4"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          <Avatar player={opponent} size={56} ring="lilac" />
          <div className="min-w-0 flex-1">
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

        {/* Two main options */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <OptionCard
            id="manual"
            selected={mode === "manual"}
            onSelect={() => setMode("manual")}
            accent="mint"
            icon={<Keyboard className="size-6" />}
            tag="Free choice"
            title="Type a word"
            desc="Bring your own twist. Type any 5-letter English word and we'll validate it for you."
            bullets={["Full creative control", "Live dictionary check", "Sneaky picks welcome"]}
          />
          <OptionCard
            id="list"
            selected={mode === "list"}
            onSelect={() => setMode("list")}
            accent="lilac"
            icon={<ListChecks className="size-6" />}
            tag="Curated"
            title="Pick from a list"
            desc="Browse a curated set of words by theme — Cinema, Sports, Music, Food and more."
            bullets={["6 themed categories", "Difficulty hints", "Tap and go"]}
          />
        </section>

        {/* Sticky bottom CTAs */}
        <div className="sticky bottom-4 z-10 mt-6">
          <div className="surface-elevated flex items-center justify-between gap-3 p-3">
            <div className="min-w-0 px-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Selected
              </p>
              <p className="text-sm font-semibold">
                {mode === "manual" && "Type a word"}
                {mode === "list" && "Pick from a list"}
                {!mode && (
                  <span className="text-muted-foreground">Choose an option above</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/play/match-select">
                <Button variant="ghost" size="lg" className="gap-1.5">
                  <ArrowLeft className="size-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </Link>
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!mode}
                className="gap-2"
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function OptionCard({
  id,
  selected,
  onSelect,
  accent,
  icon,
  tag,
  title,
  desc,
  bullets,
}: {
  id: Mode;
  selected: boolean;
  onSelect: () => void;
  accent: "mint" | "lilac";
  icon: React.ReactNode;
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
}) {
  const isMint = accent === "mint";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-option={id}
      className={cn(
        "surface-elevated group relative flex h-full flex-col overflow-hidden p-6 text-left transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg",
        selected
          ? "ring-2 ring-offset-2 ring-offset-background"
          : "ring-0 ring-transparent",
      )}
      style={
        selected
          ? ({
              ["--tw-ring-color" as string]: isMint ? "var(--primary)" : "var(--accent)",
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Accent bar */}
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: isMint ? "var(--primary)" : "var(--accent)" }}
        aria-hidden
      />
      {/* Glow on hover/selected */}
      <span
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl transition-opacity duration-500",
          selected ? "opacity-60" : "opacity-0 group-hover:opacity-50",
        )}
        style={{
          background: isMint
            ? "color-mix(in oklch, var(--primary) 35%, transparent)"
            : "color-mix(in oklch, var(--accent) 35%, transparent)",
        }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "grid size-14 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
            isMint ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent",
          )}
        >
          {icon}
        </div>
        <span className={cn("chip", !isMint && "chip-lilac")}>{tag}</span>
      </div>

      <h3 className="mt-5 font-display text-2xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>

      <ul className="mt-5 space-y-1.5">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{
                background: isMint ? "var(--primary)" : "var(--accent)",
              }}
            />
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] transition",
            selected
              ? isMint
                ? "text-primary"
                : "text-accent"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {selected ? "Selected" : "Tap to select"} <ArrowRight className="size-3.5" />
        </span>
      </div>
    </button>
  );
}
