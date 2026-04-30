import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Clock, Home, Hourglass, Palette, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { players } from "@/lib/mock-data";

export const Route = createFileRoute("/play/waiting")({
  head: () => ({
    meta: [
      { title: "Waiting for opponent — WordClash" },
      {
        name: "description",
        content: "Your challenge is in. Hang tight while your opponent plays their move.",
      },
      { property: "og:title", content: "Waiting for opponent — WordClash" },
      {
        property: "og:description",
        content: "Your secret word is locked in. We'll ping you when it's your turn.",
      },
    ],
  }),
  component: Waiting,
});

function Waiting() {
  const opponent = players[0];
  const word = "CRANE";
  const tiles = word.split("");

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto flex max-w-xl flex-col">
        <section
          className="surface-elevated glow-lilac relative overflow-hidden p-8 text-center sm:p-10"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          {/* Pulsing avatar */}
          <div className="mx-auto mb-6 grid place-items-center">
            <span className="relative grid size-28 place-items-center">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--accent) 30%, transparent)",
                  animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
                }}
                aria-hidden
              />
              <span
                className="absolute inset-2 rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--accent) 20%, transparent)",
                  animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
                  animationDelay: "0.4s",
                }}
                aria-hidden
              />
              <span className="relative">
                <Avatar player={opponent} size={84} ring="lilac" />
              </span>
            </span>
          </div>

          <p className="page-eyebrow justify-center">
            <Hourglass className="size-3" /> Waiting for opponent
          </p>
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            {opponent.name.split(" ")[0]} is up next.
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Waiting for{" "}
            <span className="font-semibold text-foreground">{opponent.handle}</span> to make their
            move…
          </p>

          {/* Opponent meta */}
          <div className="mt-6 inline-flex w-full items-center gap-3 rounded-2xl border border-border bg-background/60 p-3 text-left backdrop-blur">
            <Avatar player={opponent} size={44} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{opponent.name}</p>
              <p className="truncate text-xs text-muted-foreground">{opponent.handle}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-sm font-semibold">
                <Trophy className="size-3.5 text-[var(--primary)]" /> {opponent.rating}
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rating</p>
            </div>
          </div>

          {/* Match metadata */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px]">
            <span className="chip">
              <Palette className="size-3" /> Cinema
            </span>
            <span className="chip chip-lilac">Direct Challenge</span>
            <span className="chip chip-muted">
              <Trophy className="size-3" /> 80 pts at stake
            </span>
          </div>

          {/* Word reminder */}
          <div className="mt-6">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Your secret word
            </p>
            <div className="flex justify-center gap-1.5 sm:gap-2">
              {tiles.map((letter, i) => (
                <div
                  key={i}
                  className="grid h-12 w-12 place-items-center rounded-lg border-2 font-display text-xl font-bold uppercase sm:h-14 sm:w-14 sm:text-2xl"
                  style={{
                    background: "var(--absent)",
                    borderColor: "var(--absent)",
                    color: "var(--absent-foreground)",
                    opacity: 0.55,
                  }}
                  aria-label={`hidden letter ${i + 1}`}
                  title={letter}
                >
                  ?
                </div>
              ))}
            </div>
          </div>

          <div className="divider-soft mt-6" />

          <div className="mt-4 flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" /> Average response time: ~12 min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bell className="size-3.5" /> You'll be notified when it's your turn.
            </span>
          </div>

          <div className="mt-6">
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="gap-2">
                <Home className="size-4" /> Go to Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
