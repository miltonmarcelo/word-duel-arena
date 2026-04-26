import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Flag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { WordBoard } from "@/components/WordBoard";
import { currentUser, opponentGuesses, players, sampleGuesses } from "@/lib/mock-data";

export const Route = createFileRoute("/match")({
  head: () => ({ meta: [{ title: "Live duel — WordClash" }] }),
  component: MatchPage,
});

function MatchPage() {
  const opponent = players[0];
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="chip"><span className="player-dot player-a" /> You</span>
            <span className="text-xs text-muted-foreground">vs</span>
            <span className="chip chip-lilac"><span className="player-dot player-b" /> {opponent.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1 text-sm font-semibold tabular-nums">
              <Clock className="size-3.5 text-primary" /> 01:42
            </span>
            <Link to="/match/result"><Button size="sm" variant="ghost"><Flag className="size-4" /> Forfeit</Button></Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,260px]">
          {/* Main board */}
          <div className="flex flex-col items-center gap-6">
            <div className="player-card w-full max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar player={currentUser} size={36} ring="mint" />
                  <div>
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">Lvl {currentUser.level}</p>
                  </div>
                </div>
                <p className="font-display text-xl">3 / 6</p>
              </div>
            </div>

            <WordBoard guesses={sampleGuesses} rows={6} />
            <VirtualKeyboard />
          </div>

          {/* Opponent mini */}
          <div className="player-card player-b">
            <div className="mb-4 flex items-center gap-3">
              <Avatar player={opponent} size={36} ring="lilac" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold">{opponent.name}</p>
                <p className="text-xs text-muted-foreground">Typing...</p>
              </div>
              <p className="font-display text-lg">4 / 6</p>
            </div>
            <div className="mx-auto w-fit"><WordBoard guesses={opponentGuesses} rows={6} size="sm" /></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
