import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Search, Swords, Trophy, Users, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { players, type Player } from "@/lib/mock-data";

export const Route = createFileRoute("/play/match-select")({
  head: () => ({
    meta: [
      { title: "Choose a friend — WordClash" },
      {
        name: "description",
        content:
          "Pick a friend, send a duel, and settle the score in five letters.",
      },
    ],
  }),
  component: MatchSelect,
});

type Filter = "online" | "recent" | "all";

type Friend = Player & {
  online: boolean;
  recent: boolean;
  winRate: number;
  streak: number;
  played: number;
  lastSeen?: string;
};

const friends: Friend[] = players
  .filter((p) => p.id !== "u-0")
  .map((p, i) => ({
    ...p,
    online: i % 3 !== 0,
    recent: i % 2 === 0,
    winRate: 48 + ((i * 7) % 40),
    streak: (i * 2) % 7,
    played: 18 + i * 11,
    lastSeen: i % 3 === 0 ? `${(i + 1) * 4}m ago` : undefined,
  }));

function MatchSelect() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("online");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      online: friends.filter((p) => p.online).length,
      recent: friends.filter((p) => p.recent).length,
      all: friends.length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return friends.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.handle.toLowerCase().includes(q)) {
        return false;
      }
      if (filter === "online") return p.online;
      if (filter === "recent") return p.recent;
      return true;
    });
  }, [query, filter]);

  const selected = friends.find((p) => p.id === selectedId) ?? null;

  function confirmChallenge() {
    if (!selected) return;
    navigate({
      to: "/play/direct-word",
      search: {
        opp: selected.id,
        name: selected.name,
        handle: selected.handle,
        rating: selected.rating,
      } as never,
    });
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <Swords className="mr-1 inline size-3" /> Step 1 of 3 · Choose a friend
        </p>
        <h1 className="mt-1 font-display text-4xl leading-tight md:text-5xl">
          Who's getting the duel?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a friend below. You'll choose the secret 5-letter word for them in the
          next step.
        </p>
      </div>

      {/* Search + filters */}
      <div className="surface-elevated mb-5 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 pl-9"
            placeholder="Search friends by name or @handle…"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(["online", "recent", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition",
                filter === f
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50",
              )}
            >
              {f === "online" && (
                <span className="mr-1.5 inline-block size-1.5 translate-y-[-1px] rounded-full bg-[var(--correct)]" />
              )}
              {f}
              <span className="ml-1 opacity-60">· {counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Friends grid — leaves room for sticky action bar */}
      <div className="pb-32 sm:pb-28">
        {filtered.length === 0 ? (
          <div className="surface-elevated p-10 text-center">
            <p className="text-sm font-medium">No friends match your search.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different name or switch to "All".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <FriendCard
                key={p.id}
                friend={p}
                selected={selectedId === p.id}
                onSelect={() => setSelectedId(p.id === selectedId ? null : p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/85 backdrop-blur-md transition sm:bottom-0 sm:left-[var(--sidebar-w,18rem)] sm:right-0",
          "px-4 py-3 sm:px-8 sm:py-4",
        )}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          {/* Selected preview */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {selected ? (
              <>
                <Avatar player={selected} size={40} ring="lilac" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{selected.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {selected.handle} ·{" "}
                    <span className="inline-flex items-center gap-0.5">
                      <Trophy className="size-3" /> {selected.rating}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="grid size-10 place-items-center rounded-full border border-dashed border-border">
                  <Users className="size-4 opacity-60" />
                </div>
                <span className="hidden sm:inline">Select a friend to continue</span>
                <span className="sm:hidden">Select a friend</span>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link to="/play">
              <Button variant="ghost" size="lg" className="gap-1.5">
                <X className="size-4" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={confirmChallenge}
              disabled={!selected}
              className="gap-2"
            >
              <span className="hidden sm:inline">Confirm Challenge</span>
              <span className="sm:hidden">Confirm</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
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

function FriendCard({
  friend,
  selected,
  onSelect,
}: {
  friend: Friend;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "surface-elevated group relative overflow-hidden p-4 text-left transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "ring-0 ring-transparent",
      )}
    >
      {/* Selected accent bar */}
      {selected && (
        <span
          className="absolute inset-x-0 top-0 h-1 bg-primary"
          aria-hidden
        />
      )}

      {/* Selected check badge */}
      {selected && (
        <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground shadow">
          <Check className="size-3.5" />
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Avatar player={friend} size={52} ring={selected ? "mint" : undefined} />
          <OnlineDot
            online={friend.online}
            className="absolute -bottom-0.5 -right-0.5"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{friend.name}</p>
          <p className="truncate text-xs text-muted-foreground">{friend.handle}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {friend.online ? (
              <span className="text-[var(--correct)]">● Online now</span>
            ) : (
              <span>Last seen {friend.lastSeen ?? "recently"}</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
        <Stat label="Rating" value={String(friend.rating)} icon={<Trophy className="size-3" />} />
        <Stat label="Win rate" value={`${friend.winRate}%`} />
        <Stat
          label="Streak"
          value={friend.streak > 0 ? `🔥 ${friend.streak}` : "—"}
        />
      </div>
    </button>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold">
        {icon}
        {value}
      </p>
    </div>
  );
}
