import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Home, Swords, Trophy, Bell } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { players } from "@/lib/mock-data";

export const Route = createFileRoute("/play/challenge-sent")({
  head: () => ({
    meta: [
      { title: "Challenge sent — WordClash" },
      {
        name: "description",
        content:
          "Your WordClash duel is on its way. Wait for your opponent to take their turn.",
      },
      { property: "og:title", content: "Challenge sent — WordClash" },
      {
        property: "og:description",
        content: "Your secret word is locked in — the duel awaits.",
      },
    ],
  }),
  component: ChallengeSent,
});

function ChallengeSent() {
  // Visual prototype — pull the same default opponent + a sample chosen word.
  const opponent = players[0];
  const word = "CRANE";
  const tiles = word.split("");

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto flex max-w-xl flex-col">
        <section
          className="surface-elevated glow-mint relative overflow-hidden p-8 text-center sm:p-10"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          {/* Animated checkmark */}
          <div className="mx-auto mb-6 grid place-items-center">
            <span
              className="relative grid size-24 place-items-center rounded-full"
              style={{
                background:
                  "color-mix(in oklch, var(--primary) 20%, transparent)",
                boxShadow: "var(--shadow-glow-mint)",
              }}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "color-mix(in oklch, var(--primary) 30%, transparent)",
                  animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
                }}
                aria-hidden
              />
              <span
                className="relative grid size-16 place-items-center rounded-full text-[var(--primary-foreground)]"
                style={{
                  background: "var(--gradient-mint)",
                  animation: "tile-pop 0.45s ease-out",
                }}
              >
                <Check className="size-9" strokeWidth={3.2} />
              </span>
            </span>
          </div>

          <p className="page-eyebrow justify-center">
            <Swords className="size-3" /> Challenge locked in
          </p>
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            Challenge sent!
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Waiting for{" "}
            <span className="font-semibold text-foreground">
              {opponent.handle}
            </span>{" "}
            to play their first guess.
          </p>

          {/* Opponent card */}
          <div className="mt-6 inline-flex w-full items-center gap-3 rounded-2xl border border-border bg-background/60 p-3 text-left backdrop-blur">
            <Avatar player={opponent} size={52} ring="lilac" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg leading-tight">
                {opponent.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {opponent.handle}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-sm font-semibold">
                <Trophy className="size-3.5 text-[var(--primary)]" />{" "}
                {opponent.rating}
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Rating
              </p>
            </div>
          </div>

          {/* Word reminder (masked, visible only to challenger) */}
          <div className="mt-6">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Your secret word
            </p>
            <div className="flex justify-center gap-1.5 sm:gap-2">
              {tiles.map((letter, i) => (
                <div
                  key={i}
                  className="group relative grid h-12 w-12 place-items-center rounded-lg border-2 font-display text-xl font-bold uppercase sm:h-14 sm:w-14 sm:text-2xl"
                  style={{
                    background: "var(--absent)",
                    borderColor: "var(--absent)",
                    color: "var(--absent-foreground)",
                    opacity: 0.55,
                  }}
                  title={letter}
                  aria-label={`hidden letter ${i + 1}`}
                >
                  ?
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Only you can see the word — it stays hidden to {opponent.name.split(" ")[0]}.
            </p>
          </div>

          <div className="divider-soft mt-6" />

          <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Bell className="size-3.5" />
            You'll get a notification when it's their turn.
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/play/match-select" className="flex-1">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <Swords className="size-4" /> Challenge another player
              </Button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <Button size="lg" className="w-full gap-2">
                <Home className="size-4" /> Go to Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
