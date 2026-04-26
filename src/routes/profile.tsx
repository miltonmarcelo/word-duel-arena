import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { achievements, currentUser, recentMatches } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — WordClash" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const xpPct = Math.round((currentUser.xp / currentUser.xpToNext) * 100);
  return (
    <AppShell>
      <div className="space-y-8">
        {/* Cover */}
        <div className="surface-elevated relative overflow-hidden">
          <div className="h-32 sm:h-40" style={{ background: "var(--gradient-hero), var(--gradient-mint)" }} />
          <div className="-mt-12 flex flex-col items-start gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="rounded-full border-4 border-surface-elevated">
                <Avatar player={currentUser} size={96} ring="mint" />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl">{currentUser.name}</h1>
                <p className="text-sm text-muted-foreground">{currentUser.handle} · {currentUser.country}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary">Share profile</Button>
              <Button>Edit profile</Button>
            </div>
          </div>
        </div>

        {/* Level + XP */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="surface-elevated p-5 md:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Level {currentUser.level}</p>
              <p className="text-xs text-muted-foreground">{currentUser.xp} / {currentUser.xpToNext} XP</p>
            </div>
            <Progress value={xpPct} className="h-3" />
            <p className="mt-2 text-xs text-muted-foreground">{currentUser.xpToNext - currentUser.xp} XP to level {currentUser.level + 1}</p>
          </div>
          <div className="surface-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Rating</p>
            <p className="font-display text-4xl text-gradient-mint">{currentUser.rating}</p>
            <p className="mt-1 text-xs text-primary">+82 this week</p>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="mb-3 font-display text-2xl">Achievements</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {achievements.map((a) => (
              <div key={a.id} className={`surface-elevated relative p-5 text-center ${!a.unlocked ? "opacity-50" : ""}`}>
                <div className="text-3xl">{a.icon}</div>
                <p className="mt-2 text-sm font-semibold">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
                {!a.unlocked && <Lock className="absolute right-2 top-2 size-3 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="mb-3 font-display text-2xl">Match history</h2>
          <div className="surface-elevated divide-y divide-border">
            {recentMatches.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-4">
                <Avatar player={m.opponent} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">vs {m.opponent.name}</p>
                  <p className="text-xs text-muted-foreground">{m.word} · {m.guesses} guesses · {m.date}</p>
                </div>
                <span className={`chip ${m.result === "win" ? "" : m.result === "loss" ? "chip-muted" : "chip-lilac"}`}>{m.result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
