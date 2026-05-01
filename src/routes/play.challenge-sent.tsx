import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Check, Hourglass, Sparkles, Swords, Trophy } from "lucide-react";
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
          "Your WordClash duel is on its way. Track it from your matches in progress.",
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
  // Visual prototype — pull a sample opponent (Player B).
  const opponent = players[0];
  const firstName = opponent.name.split(" ")[0];

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto flex max-w-xl flex-col">
        <section
          className="surface-elevated glow-mint relative overflow-hidden p-8 text-center sm:p-12"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          {/* Floating sparkles */}
          <Sparkles
            className="pointer-events-none absolute left-6 top-6 size-4 text-[var(--primary)] opacity-60"
            style={{ animation: "tile-pop 0.6s ease-out 0.3s both" }}
            aria-hidden
          />
          <Sparkles
            className="pointer-events-none absolute right-8 top-10 size-3 text-[var(--accent)] opacity-70"
            style={{ animation: "tile-pop 0.6s ease-out 0.5s both" }}
            aria-hidden
          />
          <Sparkles
            className="pointer-events-none absolute bottom-24 left-10 size-3 text-[var(--accent)] opacity-50"
            style={{ animation: "tile-pop 0.6s ease-out 0.7s both" }}
            aria-hidden
          />

          {/* Animated checkmark */}
          <div className="mx-auto mb-6 grid place-items-center">
            <span
              className="relative grid size-28 place-items-center rounded-full"
              style={{
                background: "color-mix(in oklch, var(--primary) 18%, transparent)",
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
                className="absolute inset-2 rounded-full"
                style={{
                  background:
                    "color-mix(in oklch, var(--primary) 22%, transparent)",
                  animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
                  animationDelay: "0.4s",
                }}
                aria-hidden
              />
              <span
                className="relative grid size-20 place-items-center rounded-full text-[var(--primary-foreground)]"
                style={{
                  background: "var(--gradient-mint)",
                  animation: "tile-pop 0.5s ease-out",
                }}
              >
                <Check className="size-10" strokeWidth={3.2} />
              </span>
            </span>
          </div>

          <p className="page-eyebrow justify-center">
            <Swords className="size-3" /> Challenge locked in
          </p>
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            Challenge sent to {firstName}!
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            We've sent {firstName} a notification. Once they take their turn, you'll
            be pinged to play yours.
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

          {/* Status hints */}
          <div className="mt-5 flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Bell className="size-3.5" />
              {firstName} just received a "New challenge" notification.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Hourglass className="size-3.5" />
              Average response time: ~12 min.
            </span>
          </div>

          <div className="divider-soft mt-6" />

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/play/matches" className="flex-1">
              <Button size="lg" className="w-full gap-2">
                <Hourglass className="size-4" /> Matches in progress
              </Button>
            </Link>
            <Link to="/play" className="flex-1">
              <Button variant="outline" size="lg" className="w-full gap-2">
                Back to Play
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
