import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles, Swords, Trophy, Users, Zap, Check, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { players, type Player } from "@/lib/mock-data";

export const Route = createFileRoute("/play/match-select")({
  head: () => ({ meta: [{ title: "Direct challenge — WordClash" }] }),
  component: MatchSelect,
});

// Augment players with social/online metadata for the visual prototype.
type Social = Player & {
  online: boolean;
  winRate: number;
  streak: number;
  played: number;
  lastSeen?: string;
  group: "friends" | "recent" | "suggested";
};

const opponents: Social[] = players
  .filter((p) => p.id !== "u-0")
  .map((p, i) => ({
    ...p,
    online: i % 3 !== 0,
    winRate: 48 + ((i * 7) % 40),
    streak: (i * 2) % 7,
    played: 18 + i * 11,
    lastSeen: i % 3 === 0 ? `${(i + 1) * 4}m ago` : undefined,
    group: (["friends", "recent", "suggested"] as const)[i % 3],
  }));

const themes = [
  { id: "general", label: "General", emoji: "✨", desc: "Random 5-letter word" },
  { id: "nature", label: "Nature", emoji: "🌿", desc: "Plants, weather, animals" },
  { id: "tech", label: "Tech", emoji: "💻", desc: "Software & gadgets" },
  { id: "food", label: "Food", emoji: "🍜", desc: "Dishes & ingredients" },
  { id: "sports", label: "Sports", emoji: "🏅", desc: "Games & athletes" },
  { id: "custom", label: "Custom", emoji: "✍️", desc: "Pick your own word" },
];

function MatchSelect() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"friends" | "recent" | "suggested">("friends");
  const [target, setTarget] = useState<Social | null>(null);
  const [theme, setTheme] = useState("general");
  const [customWord, setCustomWord] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opponents.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.handle.toLowerCase().includes(q)) {
        return false;
      }
      return p.group === tab;
    });
  }, [query, tab]);

  const counts = useMemo(
    () => ({
      friends: opponents.filter((p) => p.group === "friends").length,
      recent: opponents.filter((p) => p.group === "recent").length,
      suggested: opponents.filter((p) => p.group === "suggested").length,
    }),
    [],
  );

  const onlineNow = opponents.filter((p) => p.online);

  function openChallenge(p: Social) {
    setTarget(p);
    setConfirmed(false);
    setTheme("general");
    setCustomWord("");
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Swords className="mr-1 inline size-3" /> Direct challenge
          </p>
          <h1 className="font-display text-4xl md:text-5xl">Pick your opponent.</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Challenge a friend, revisit a recent rival, or discover someone close to your rating.
          </p>
        </div>
        <div className="surface-elevated flex items-center gap-3 px-4 py-3">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--correct)] opacity-60" />
            <span className="relative size-2.5 rounded-full bg-[var(--correct)]" />
          </span>
          <div className="text-sm">
            <span className="font-semibold">{onlineNow.length} online</span>
            <span className="text-muted-foreground"> · ready to duel</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.45fr,1fr]">
        {/* LEFT — search + list */}
        <div className="space-y-5">
          <div className="surface-elevated p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-11"
                placeholder="Search by name or @handle..."
              />
            </div>
            <div className="mt-3 flex gap-1.5">
              {(["friends", "recent", "suggested"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition",
                    tab === t
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  {t} <span className="opacity-60">· {counts[t]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {filtered.length === 0 && (
              <div className="surface-elevated p-8 text-center text-sm text-muted-foreground">
                No players match your search.
              </div>
            )}
            {filtered.map((p) => (
              <PlayerRow key={p.id} player={p} onChallenge={() => openChallenge(p)} />
            ))}
          </div>
        </div>

        {/* RIGHT — featured cards */}
        <div className="space-y-5">
          <FeaturedSection
            title="Online friends"
            icon={<Users className="size-3.5" />}
            tone="mint"
            players={opponents.filter((p) => p.group === "friends" && p.online).slice(0, 4)}
            onChallenge={openChallenge}
          />
          <FeaturedSection
            title="Recent rivals"
            icon={<Swords className="size-3.5" />}
            tone="lilac"
            players={opponents.filter((p) => p.group === "recent").slice(0, 4)}
            onChallenge={openChallenge}
          />
          <FeaturedSection
            title="Suggested · near your rating"
            icon={<Sparkles className="size-3.5" />}
            tone="mint"
            players={opponents.filter((p) => p.group === "suggested").slice(0, 4)}
            onChallenge={openChallenge}
          />
        </div>
      </div>

      {/* Challenge modal */}
      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent className="max-w-lg surface-elevated border-border p-0 overflow-hidden">
          {target && !confirmed && (
            <>
              <div
                className="relative px-6 pt-6 pb-5"
                style={{ background: "var(--gradient-hero)" }}
              >
                <DialogHeader className="text-left">
                  <DialogTitle className="font-display text-2xl">
                    Challenge {target.name.split(" ")[0]}
                  </DialogTitle>
                  <DialogDescription>
                    Pick a theme. They'll get a notification to accept your duel.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-background/60 p-3 backdrop-blur">
                  <div className="relative">
                    <Avatar player={target} size={48} ring="lilac" />
                    <OnlineDot online={target.online} className="absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{target.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {target.handle} · {target.rating} rating
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-foreground">{target.winRate}% wins</p>
                    <p className="text-muted-foreground">{target.played} played</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Theme
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          "rounded-xl border p-3 text-left transition",
                          theme === t.id
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border hover:border-primary/40 hover:bg-muted/40",
                        )}
                      >
                        <div className="text-lg leading-none">{t.emoji}</div>
                        <div className="mt-1.5 text-sm font-semibold">{t.label}</div>
                        <div className="text-[11px] text-muted-foreground">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {theme === "custom" && (
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Your secret 5-letter word
                    </p>
                    <Input
                      maxLength={5}
                      value={customWord}
                      onChange={(e) => setCustomWord(e.target.value.toUpperCase())}
                      className="font-mono tracking-[0.4em] uppercase text-center"
                      placeholder="• • • • •"
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="border-t border-border bg-background/50 p-4">
                <Button variant="ghost" onClick={() => setTarget(null)}>
                  <X className="size-4" /> Cancel
                </Button>
                <Button onClick={() => setConfirmed(true)} className="gap-2">
                  <Zap className="size-4" /> Send challenge
                </Button>
              </DialogFooter>
            </>
          )}

          {target && confirmed && (
            <div className="flex flex-col items-center px-8 py-10 text-center">
              <div className="grid size-16 place-items-center rounded-full bg-[var(--correct)]/20 text-[var(--correct)]">
                <Check className="size-8" strokeWidth={3} />
              </div>
              <h3 className="mt-4 font-display text-2xl">Challenge sent!</h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                {target.name} will be notified. We'll ping you the moment they accept.
              </p>
              <div className="mt-5 flex w-full gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setTarget(null)}>
                  Challenge another
                </Button>
                <Link to="/dashboard" className="flex-1">
                  <Button className="w-full">Back to home</Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function OnlineDot({ online, className }: { online: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "block size-3 rounded-full border-2 border-background",
        online ? "bg-[var(--correct)]" : "bg-muted-foreground/50",
        className,
      )}
      aria-label={online ? "Online" : "Offline"}
    />
  );
}

function PlayerRow({ player, onChallenge }: { player: Social; onChallenge: () => void }) {
  return (
    <div className="surface-elevated group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <Avatar player={player} size={48} />
        <OnlineDot online={player.online} className="absolute -bottom-0.5 -right-0.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{player.name}</p>
          <span className="text-xs text-muted-foreground">{player.handle}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Trophy className="size-3" /> {player.rating}
          </span>
          <span>{player.winRate}% W</span>
          <span>{player.played} matches</span>
          {player.streak > 0 && (
            <span className="text-[var(--warning)]">🔥 {player.streak}</span>
          )}
          {!player.online && player.lastSeen && (
            <span className="opacity-70">· seen {player.lastSeen}</span>
          )}
        </div>
      </div>
      <Button size="sm" onClick={onChallenge} className="gap-1.5">
        <Swords className="size-3.5" /> Challenge
      </Button>
    </div>
  );
}

function FeaturedSection({
  title,
  icon,
  tone,
  players,
  onChallenge,
}: {
  title: string;
  icon: React.ReactNode;
  tone: "mint" | "lilac";
  players: Social[];
  onChallenge: (p: Social) => void;
}) {
  if (players.length === 0) return null;
  return (
    <div className="surface-elevated p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className={cn("chip", tone === "lilac" && "chip-lilac")}>
          {icon} {title}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {players.map((p) => (
          <button
            key={p.id}
            onClick={() => onChallenge(p)}
            className="group flex flex-col items-start gap-2 rounded-xl border border-border p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/40"
          >
            <div className="flex w-full items-start justify-between">
              <div className="relative">
                <Avatar player={p} size={36} />
                <OnlineDot online={p.online} className="absolute -bottom-0.5 -right-0.5" />
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">{p.rating}</span>
            </div>
            <div className="w-full min-w-0">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {p.winRate}% W · {p.played} matches
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
