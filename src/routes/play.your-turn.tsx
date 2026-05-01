import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Flame, Palette, Play, Swords, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { players } from "@/lib/mock-data";

export const Route = createFileRoute("/play/your-turn")({
  head: () => ({
    meta: [
      { title: "Your turn! — WordClash" },
      {
        name: "description",
        content: "Your opponent has played. Jump in and crack their word before time runs out.",
      },
      { property: "og:title", content: "Your turn! — WordClash" },
      {
        property: "og:description",
        content: "It's your move in WordClash. Points and pride on the line.",
      },
    ],
  }),
  component: YourTurn,
});

function YourTurn() {
  const challenger = players[0];
  const [seconds, setSeconds] = useState(180);

  useEffect(() => {
    const id = setInterval(
      () => setSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto max-w-xl">
        <section
          className="surface-elevated glow-mint relative overflow-hidden p-8 text-center sm:p-12"
          style={{
            background:
              "var(--gradient-hero), linear-gradient(180deg, color-mix(in oklch, var(--primary) 8%, var(--surface-elevated)), var(--surface-elevated))",
          }}
        >
          {/* Challenger */}
          <div className="mx-auto mb-5 grid place-items-center">
            <Avatar player={challenger} size={72} ring="lilac" />
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{challenger.name}</span> sent you a
            challenge
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="chip">
              <Palette className="size-3" /> Cinema
            </span>
            <span className="chip chip-lilac">Direct Challenge</span>
          </div>

          {/* Hero headline */}
          <div className="mt-6">
            <p className="page-eyebrow justify-center text-[var(--primary)]">
              <Flame className="size-3" /> Hot challenge
            </p>
            <h1 className="font-display text-5xl leading-[1.02] sm:text-6xl">
              <span className="inline-flex items-center gap-3">
                <Swords className="size-10 text-[var(--primary)] sm:size-12" />
                Your turn!
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              {challenger.handle} has sent their word.{" "}
              <span className="font-semibold text-foreground">Can you guess it?</span>
            </p>
          </div>

          {/* Stakes */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="surface-soft rounded-2xl p-4">
              <p className="stat-label">Points at stake</p>
              <p className="stat-value mt-1 inline-flex items-center gap-1.5">
                <Trophy className="size-5 text-[var(--primary)]" /> 120
              </p>
            </div>
            <div className="surface-soft rounded-2xl p-4">
              <p className="stat-label">Time left</p>
              <p className="stat-value mt-1 inline-flex items-center gap-1.5 font-mono tabular-nums">
                <Clock className="size-5 text-[var(--accent)]" />
                {mm}:{ss}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/match" search={{ word: "CRANE", opponent: challenger.name, mode: "direct" }}>
              <Button
                size="lg"
                className="hover-lift h-14 w-full gap-2 px-8 text-base font-semibold sm:w-auto"
              >
                <Play className="size-5" /> Play Now
              </Button>
            </Link>
          </div>

          <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Tap to enter the match
          </p>
        </section>
      </div>
    </AppShell>
  );
}
