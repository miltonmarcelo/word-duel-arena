import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Radar, Users, Zap, Trophy, Globe2, Check, X, Shuffle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { players, currentUser, type Player } from "@/lib/mock-data";

export const Route = createFileRoute("/play/random")({
  head: () => ({ meta: [{ title: "Random match — WordClash" }] }),
  component: RandomMatch,
});

type Pair = { a: Player; b: Player; status: "matching" | "ready" };

function RandomMatch() {
  const [inQueue, setInQueue] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [eta, setEta] = useState(14);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [queueCount, setQueueCount] = useState(1247);

  // Tick clock + drift queue size while in queue
  useEffect(() => {
    if (!inQueue) return;
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
      setEta((e) => Math.max(3, e - 1));
      setQueueCount((c) => c + Math.round((Math.random() - 0.4) * 6));
    }, 1000);
    return () => clearInterval(id);
  }, [inQueue]);

  // Lock in opponent after a few seconds
  useEffect(() => {
    if (!inQueue || opponent) return;
    if (seconds >= 6) {
      setOpponent(players[1]);
    }
  }, [seconds, inQueue, opponent]);

  // Other live pairings (visual only)
  const livePairs = useMemo<Pair[]>(
    () => [
      { a: players[2], b: players[5], status: "ready" },
      { a: players[6], b: players[3], status: "ready" },
      { a: players[0], b: players[4], status: "matching" },
      { a: players[8], b: players[7], status: "matching" },
    ],
    [],
  );

  // Floating avatars in radar (around the user)
  const radarPlayers = players.filter((p) => p.id !== currentUser.id).slice(0, 6);

  function joinQueue() {
    setInQueue(true);
    setSeconds(0);
    setEta(14);
    setOpponent(null);
  }
  function leaveQueue() {
    setInQueue(false);
    setOpponent(null);
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <Shuffle className="mr-1 inline size-3" /> Random match
        </p>
        <h1 className="font-display text-3xl md:text-5xl">Find your rival.</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          We're pairing you with someone close to your rating. Stay sharp.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr,1fr]">
        {/* Radar / matchmaking visual */}
        <div className="surface-elevated relative overflow-hidden p-5 md:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{ background: "var(--gradient-hero)" }}
          />

          {/* Live stats row */}
          <div className="relative flex flex-wrap items-center gap-2">
            <span className="chip">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--correct)] opacity-70" />
                <span className="relative size-2 rounded-full bg-[var(--correct)]" />
              </span>
              {queueCount.toLocaleString()} in queue
            </span>
            <span className="chip chip-lilac">
              <Globe2 className="size-3" /> Global pool
            </span>
            <span className="ml-auto text-xs font-mono text-muted-foreground">
              {formatTime(seconds)}
            </span>
          </div>

          {/* Radar */}
          <div className="relative mx-auto my-6 grid aspect-square w-full max-w-[340px] place-items-center">
            {/* Concentric rings */}
            <div className="absolute inset-0 rounded-full border border-primary/20" />
            <div className="absolute inset-[12%] rounded-full border border-primary/25" />
            <div className="absolute inset-[26%] rounded-full border border-primary/30" />
            <div className="absolute inset-[40%] rounded-full border border-primary/40" />

            {/* Sweeping arc */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklch, var(--primary) 35%, transparent) 60deg, transparent 90deg)",
                animation: "spin 3s linear infinite",
                maskImage: "radial-gradient(circle, black 0%, black 70%, transparent 72%)",
                WebkitMaskImage:
                  "radial-gradient(circle, black 0%, black 70%, transparent 72%)",
              }}
            />

            {/* Pulse */}
            <div className="absolute inset-[42%] animate-ping rounded-full bg-primary/30" />

            {/* Floating opponent avatars */}
            {radarPlayers.map((p, i) => {
              const angle = (i / radarPlayers.length) * Math.PI * 2;
              const radius = 38 + (i % 2) * 8; // % from center
              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius;
              return (
                <div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    animation: `float-soft ${3 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
                  }}
                >
                  <Avatar player={p} size={32} />
                </div>
              );
            })}

            {/* Center: you */}
            <div className="relative z-10 grid place-items-center">
              <Avatar player={currentUser} size={72} ring="lilac" />
              <span className="mt-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                You
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="relative text-center">
            {!inQueue && (
              <>
                <h2 className="font-display text-2xl">Ready to duel?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tap below to enter the matchmaking queue.
                </p>
                <Button size="lg" className="mt-5 gap-2" onClick={joinQueue}>
                  <Zap className="size-4" /> Enter queue
                </Button>
              </>
            )}

            {inQueue && !opponent && (
              <>
                <span className="chip">
                  <Radar className="size-3 animate-pulse" /> Searching opponent…
                </span>
                <h2 className="mt-3 font-display text-2xl">Scanning the pool</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Estimated wait · <span className="font-semibold text-foreground">~{eta}s</span>
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-4 gap-1.5"
                  onClick={leaveQueue}
                >
                  <X className="size-4" /> Leave queue
                </Button>
              </>
            )}

            {inQueue && opponent && !confirmed && (
              <>
                <span className="chip" style={{ color: "var(--correct)" }}>
                  <Check className="size-3" /> Match found
                </span>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <Avatar player={currentUser} size={56} ring="lilac" />
                    <p className="mt-1 text-xs font-semibold">You</p>
                    <p className="text-[10px] text-muted-foreground">{currentUser.rating}</p>
                  </div>
                  <span className="font-display text-3xl text-primary">VS</span>
                  <div className="text-center">
                    <Avatar player={opponent} size={56} ring="lilac" />
                    <p className="mt-1 text-xs font-semibold">{opponent.name.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground">{opponent.rating}</p>
                  </div>
                </div>
                <div className="mt-5 flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={leaveQueue}>
                    Decline
                  </Button>
                  <Link to="/match">
                    <Button size="sm" className="gap-1.5" onClick={() => setConfirmed(true)}>
                      <Zap className="size-4" /> Accept duel
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Side: live pool & pairings */}
        <div className="space-y-5">
          {/* Pool stats */}
          <div className="grid grid-cols-3 gap-2">
            <Stat label="In queue" value={queueCount.toLocaleString()} icon={<Users className="size-3.5" />} />
            <Stat label="Avg wait" value={`${eta}s`} icon={<Radar className="size-3.5" />} />
            <Stat label="Your rating" value={`${currentUser.rating}`} icon={<Trophy className="size-3.5" />} />
          </div>

          {/* Live pairings */}
          <div className="surface-elevated p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="chip">
                <Zap className="size-3" /> Live pairings
              </span>
              <span className="text-[11px] text-muted-foreground">Updating…</span>
            </div>
            <div className="space-y-2">
              {livePairs.map((pair, i) => (
                <PairRow key={i} pair={pair} />
              ))}
            </div>
          </div>

          {/* Tip card */}
          <div
            className="rounded-2xl border border-border p-4 text-sm"
            style={{ background: "var(--gradient-card-soft)" }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-accent-foreground/80">
              Pro tip
            </p>
            <p className="mt-1 text-foreground/90">
              Wins against higher-rated players give bonus XP. Don't shy away from a tough match.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="surface-elevated p-3 text-center">
      <div className="mx-auto mb-1 flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="font-display text-lg leading-tight">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function PairRow({ pair }: { pair: Pair }) {
  const ready = pair.status === "ready";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-2.5">
      <div className="flex items-center -space-x-2">
        <Avatar player={pair.a} size={32} />
        <Avatar player={pair.b} size={32} />
      </div>
      <div className="flex-1 min-w-0 text-xs">
        <p className="truncate font-semibold">
          {pair.a.name.split(" ")[0]} <span className="text-muted-foreground">vs</span>{" "}
          {pair.b.name.split(" ")[0]}
        </p>
        <p className="truncate text-muted-foreground">
          {pair.a.rating} · {pair.b.rating}
        </p>
      </div>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
          ready
            ? "bg-[var(--correct)]/15 text-[var(--correct)]"
            : "bg-primary/10 text-primary",
        )}
      >
        {ready ? "Ready" : "Matching"}
      </span>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}
