import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Shuffle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { players } from "@/lib/mock-data";

export const Route = createFileRoute("/play/match-select")({
  head: () => ({ meta: [{ title: "Find an opponent — WordClash" }] }),
  component: MatchSelect,
});

function MatchSelect() {
  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr,1fr]">
        {/* Friends list */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Direct duel</p>
            <h1 className="font-display text-4xl">Challenge a friend.</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search players..." />
          </div>
          <div className="surface-elevated divide-y divide-border">
            {players.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3">
                <Avatar player={p} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.handle} · {p.rating}</p>
                </div>
                <Link to="/match"><Button size="sm">Duel</Button></Link>
              </div>
            ))}
          </div>
        </div>

        {/* Random roulette */}
        <div className="surface-elevated relative flex flex-col items-center overflow-hidden p-8 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <span className="chip chip-lilac"><Shuffle className="size-3" /> Random match</span>
            <h2 className="mt-3 font-display text-3xl">Spinning the roulette…</h2>
            <p className="mt-1 text-sm text-muted-foreground">Matching you with a player near your rating.</p>

            <div className="relative mx-auto mt-8 grid h-40 w-40 place-items-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-accent/30 animate-[spin_12s_linear_infinite_reverse]" />
              <Avatar player={players[0]} size={88} ring="lilac" />
            </div>

            <div className="mt-6 flex justify-center -space-x-3">
              {players.slice(0, 5).map((p) => (
                <Avatar key={p.id} player={p} size={36} />
              ))}
            </div>

            <Link to="/match" className="mt-8 inline-block"><Button size="lg" variant="accent">Start match</Button></Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
