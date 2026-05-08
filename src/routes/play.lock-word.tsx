import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, EyeOff, Lock, Pencil, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { players } from "@/lib/mock-data";

type LockWordSearch = {
  opp?: string;
  name?: string;
  handle?: string;
  rating?: number;
  word?: string;
  /** Where to return to when the player taps "Edit Word". Defaults to /play/choose-word */
  from?: "manual" | "list";
};

export const Route = createFileRoute("/play/lock-word")({
  validateSearch: (s: Record<string, unknown>): LockWordSearch => ({
    opp: typeof s.opp === "string" ? s.opp : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
    handle: typeof s.handle === "string" ? s.handle : undefined,
    rating: typeof s.rating === "number" ? s.rating : Number(s.rating) || undefined,
    word: typeof s.word === "string" ? s.word.toUpperCase() : undefined,
    from: s.from === "manual" || s.from === "list" ? s.from : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Lock your word — WordClash" },
      {
        name: "description",
        content:
          "Confirm and lock the secret word for your duel. Once locked, it stays hidden from your opponent.",
      },
    ],
  }),
  component: LockWord,
});

function LockWord() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const word = (search.word ?? "PLATE").toUpperCase();
  const tiles = word.split("");

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

  const passthrough = {
    opp: search.opp,
    name: search.name,
    handle: search.handle,
    rating: search.rating,
  };

  function handleConfirm() {
    navigate({
      to: "/play/challenge-sent",
      search: { ...passthrough, word } as never,
    });
  }

  function handleEdit() {
    if (search.from === "manual") {
      navigate({ to: "/play/direct-word", search: passthrough as never });
    } else {
      navigate({ to: "/play/word-pick", search: passthrough as never });
    }
  }

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto flex max-w-xl flex-col">
        <section
          className="surface-elevated glow-mint relative overflow-hidden p-8 text-center sm:p-10"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          {/* Lock icon with pulse */}
          <div className="mx-auto mb-6 grid place-items-center">
            <span
              className="relative grid size-24 place-items-center rounded-full"
              style={{
                background: "color-mix(in oklch, var(--primary) 18%, transparent)",
                boxShadow: "var(--shadow-glow-mint)",
              }}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--primary) 30%, transparent)",
                  animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
                }}
                aria-hidden
              />
              <span
                className="relative grid size-16 place-items-center rounded-full text-[var(--primary-foreground)]"
                style={{
                  background: "var(--gradient-mint)",
                  animation: "tile-pop 0.5s ease-out",
                }}
              >
                <Lock className="size-8" strokeWidth={2.6} />
              </span>
            </span>
          </div>

          <p className="page-eyebrow justify-center">
            <Sparkles className="size-3" /> Final step · Lock your word
          </p>
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            Ready to lock it in?
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Once you confirm, this word becomes the official secret for the duel.
            You won't be able to change it after sending.
          </p>

          {/* Opponent strip */}
          <div className="mt-6 inline-flex w-full items-center gap-3 rounded-2xl border border-border bg-background/60 p-3 text-left backdrop-blur">
            <Avatar player={opponent} size={44} ring="lilac" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Challenging
              </p>
              <p className="truncate text-sm font-semibold">{opponent.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {opponent.handle}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-sm font-semibold">
                <Trophy className="size-3.5 text-[var(--primary)]" /> {opponent.rating}
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Rating
              </p>
            </div>
          </div>

          {/* Secret word — masked tiles with reveal-on-hover */}
          <div className="mt-7">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Your secret word
            </p>
            <div className="group flex justify-center gap-1.5 sm:gap-2">
              {tiles.map((letter: string, i: number) => (
                <div
                  key={i}
                  className="relative grid h-14 w-14 cursor-default place-items-center overflow-hidden rounded-lg border-2 font-display text-2xl font-bold uppercase shadow-sm sm:h-16 sm:w-16 sm:text-3xl"
                  style={{
                    background: "color-mix(in oklch, var(--primary) 14%, var(--surface-elevated))",
                    borderColor: "color-mix(in oklch, var(--primary) 45%, transparent)",
                    color: "var(--primary)",
                    animation: `tile-pop 0.4s ease-out ${i * 70}ms both`,
                  }}
                  aria-label={`Locked letter ${i + 1}`}
                  title="Hover to peek"
                >
                  {/* Mask layer */}
                  <span
                    className="absolute inset-0 grid place-items-center text-base text-muted-foreground transition-opacity duration-200 group-hover:opacity-0"
                    style={{
                      background:
                        "color-mix(in oklch, var(--surface-elevated) 92%, transparent)",
                    }}
                  >
                    <Lock className="size-4 opacity-70" />
                  </span>
                  {/* Letter underneath */}
                  <span className="relative">{letter}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Hover to peek — only you can see the word.
            </p>
          </div>

          {/* Warning / hidden-from-opponent note */}
          <div
            className="mt-6 flex items-start gap-3 rounded-xl border p-3 text-left text-xs"
            style={{
              borderColor: "color-mix(in oklch, var(--warning) 40%, transparent)",
              background: "color-mix(in oklch, var(--warning) 10%, transparent)",
            }}
          >
            <EyeOff
              className="mt-0.5 size-4 shrink-0"
              style={{ color: "var(--warning)" }}
            />
            <div>
              <p className="font-semibold" style={{ color: "var(--warning)" }}>
                This stays hidden from {opponent.name.split(" ")[0]}.
              </p>
              <p className="mt-0.5 text-muted-foreground">
                After locking, the word can't be edited. Make sure it's the one you
                want to send.
              </p>
            </div>
          </div>

          {/* Reassurance row */}
          <div className="mt-4 inline-flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-[var(--correct)]" />
            Validated · {word.length} letters · ready to send
          </div>

          <div className="divider-soft mt-6" />

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              size="lg"
              onClick={handleEdit}
              className="flex-1 gap-2"
            >
              <Pencil className="size-4" /> Edit Word
            </Button>
            <Button size="lg" onClick={handleConfirm} className="flex-1 gap-2">
              <Lock className="size-4" /> Confirm Lock
            </Button>
          </div>

          <button
            type="button"
            onClick={handleEdit}
            className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> Back to selection
          </button>
        </section>
      </div>
    </AppShell>
  );
}
