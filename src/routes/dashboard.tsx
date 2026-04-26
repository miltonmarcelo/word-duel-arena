import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Sparkles, Swords, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { WordRow } from "@/components/WordBoard";
import { currentUser, recentMatches } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — WordClash" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-8">
        {/* Greeting */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Welcome back</p>
            <h1 className="font-display text-4xl sm:text-5xl">Good evening, {currentUser.name.split(" ")[0]}.</h1>
            <p className="mt-1 text-muted-foreground">3 unread challenges · 1 daily puzzle remaining</p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Avatar player={currentUser} size={56} ring="mint" />
          </div>
        </div>

        {/* Hero row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Daily challenge */}
          <div className="surface-elevated relative col-span-1 overflow-hidden p-6 lg:col-span-2">
            <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "var(--gradient-hero)" }} />
            <div className="relative grid gap-6 sm:grid-cols-2 sm:items-center">
              <div>
                <span className="chip"><Sparkles className="size-3" /> Daily #482</span>
                <h2 className="mt-3 font-display text-3xl">Today's puzzle is live.</h2>
                <p className="mt-1 text-sm text-muted-foreground">Solve it before midnight to keep your 12-day streak alive.</p>
                <Link to="/match" className="mt-5 inline-block">
                  <Button size="lg">Play daily <ArrowRight className="size-4" /></Button>
                </Link>
              </div>
              <div className="flex justify-center sm:justify-end">
                <div className="flex flex-col gap-1.5">
                  <WordRow guess={{ letters: ["P","L","A","T","E"], states: ["correct","correct","correct","correct","correct"] }} size="sm" />
                  <WordRow size="sm" empty />
                  <WordRow size="sm" empty />
                </div>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="surface-elevated p-6">
            <div className="flex items-center justify-between">
              <span className="chip chip-lilac"><Flame className="size-3" /> Streak</span>
              <span className="text-xs text-muted-foreground">Best: 27</span>
            </div>
            <p className="mt-4 font-display text-6xl text-gradient-mint">12</p>
            <p className="text-sm text-muted-foreground">days in a row</p>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`h-8 rounded-md ${i < 5 ? "bg-primary" : "bg-surface"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Quick match", to: "/play/match-select", icon: Swords },
            { label: "Daily puzzle", to: "/match", icon: Sparkles },
            { label: "Climb ranks", to: "/ranking", icon: Trophy },
            { label: "Streak boost", to: "/play", icon: Flame },
          ].map(({ label, to, icon: Icon }) => (
            <Link key={label} to={to} className="surface-elevated flex flex-col items-start gap-3 p-4 transition-transform hover:-translate-y-0.5">
              <Icon className="size-5 text-primary" />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent matches */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent matches</h2>
            <Link to="/stats" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="surface-elevated divide-y divide-border">
            {recentMatches.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-4">
                <Avatar player={m.opponent} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">vs {m.opponent.name}</p>
                  <p className="text-xs text-muted-foreground">{m.word} · {m.guesses} guesses · {m.date}</p>
                </div>
                <span className={`chip ${m.result === "win" ? "" : m.result === "loss" ? "chip-muted" : "chip-lilac"}`}>
                  {m.result}
                </span>
                <span className="hidden text-sm font-semibold sm:inline">+{m.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
