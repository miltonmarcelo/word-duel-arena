import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Dice5, Swords, Users2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/play")({
  head: () => ({ meta: [{ title: "Play — WordClash" }] }),
  component: PlayPage,
});

const modes = [
  { id: "daily", title: "Daily Puzzle", desc: "One word a day. Solve to keep your streak.", icon: Calendar, accent: "mint", to: "/match" },
  { id: "direct", title: "Direct Challenge", desc: "Pick a friend, send a duel.", icon: Swords, accent: "lilac", to: "/play/match-select" },
  { id: "random", title: "Random Match", desc: "Auto-match by skill, ready in seconds.", icon: Dice5, accent: "mint", to: "/play/match-select" },
  { id: "group", title: "Group Room", desc: "Play in a private league with friends.", icon: Users2, accent: "lilac", to: "/rooms" },
] as const;

function PlayPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Game modes</p>
          <h1 className="font-display text-4xl sm:text-5xl">Choose your battle.</h1>
          <p className="mt-2 max-w-md text-muted-foreground">Four ways to play, all in 5 letters.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {modes.map((m) => (
            <Link key={m.id} to={m.to} className="surface-elevated group relative overflow-hidden p-6 transition-transform hover:-translate-y-1">
              <div className={`absolute inset-x-0 top-0 h-1 ${m.accent === "mint" ? "bg-primary" : "bg-accent"}`} />
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${m.accent === "mint" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                <m.icon className="size-5" />
              </div>
              <h3 className="font-display text-2xl">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Start <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
