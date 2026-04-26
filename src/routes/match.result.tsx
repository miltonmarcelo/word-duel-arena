import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, Share2, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { WordBoard } from "@/components/WordBoard";
import { currentUser, opponentGuesses, players, sampleGuesses } from "@/lib/mock-data";

export const Route = createFileRoute("/match/result")({
  head: () => ({ meta: [{ title: "Match result — WordClash" }] }),
  component: ResultPage,
});

function ResultPage() {
  const opponent = players[0];
  return (
    <AppShell>
      <div className="space-y-8">
        {/* Banner */}
        <div className="surface-elevated glow-mint relative overflow-hidden p-8 text-center animate-count-up">
          <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <Trophy className="mx-auto size-10 text-primary" />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Victory</p>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl">You won the duel.</h1>
            <p className="mt-2 text-muted-foreground">Solved <span className="font-semibold text-foreground">PLATE</span> in 3 guesses.</p>
            <div className="mt-6 inline-flex items-center gap-6">
              <Stat label="XP gained" value="+128" highlight />
              <Stat label="Rating" value="+18" />
              <Stat label="Streak" value="13d" />
            </div>
          </div>
        </div>

        {/* Boards comparison */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="player-card">
            <div className="mb-4 flex items-center gap-3">
              <Avatar player={currentUser} size={36} ring="mint" />
              <div className="flex-1"><p className="text-sm font-semibold">{currentUser.name}</p><p className="text-xs text-primary">3 guesses</p></div>
            </div>
            <div className="mx-auto w-fit"><WordBoard guesses={sampleGuesses} rows={6} size="sm" /></div>
          </div>
          <div className="player-card player-b">
            <div className="mb-4 flex items-center gap-3">
              <Avatar player={opponent} size={36} ring="lilac" />
              <div className="flex-1"><p className="text-sm font-semibold">{opponent.name}</p><p className="text-xs text-accent">4 guesses</p></div>
            </div>
            <div className="mx-auto w-fit"><WordBoard guesses={opponentGuesses} rows={6} size="sm" /></div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/match"><Button size="lg"><RotateCcw className="size-4" /> Rematch</Button></Link>
          <Button size="lg" variant="secondary"><Share2 className="size-4" /> Share result</Button>
          <Link to="/dashboard"><Button size="lg" variant="ghost">Back to dashboard</Button></Link>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className={`font-display text-3xl ${highlight ? "text-primary" : ""}`}>{value}</p>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
