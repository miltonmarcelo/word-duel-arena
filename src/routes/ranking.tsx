import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Crown, Minus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { players } from "@/lib/mock-data";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — WordClash" }] }),
  component: RankingPage,
});

function RankingPage() {
  const sorted = [...players].sort((a, b) => b.rating - a.rating);
  const [first, second, third, ...rest] = sorted;
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Season 4</p>
            <h1 className="font-display text-4xl sm:text-5xl">Global ranking.</h1>
            <p className="mt-1 text-muted-foreground">Resets in 2 days · Top 100 earn season trophy.</p>
          </div>
          <Tabs defaultValue="global">
            <TabsList>
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="region">Region</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 items-end gap-3 sm:gap-6">
          <PodiumCard player={second} place={2} height="h-32" />
          <PodiumCard player={first} place={1} height="h-44" highlight />
          <PodiumCard player={third} place={3} height="h-28" />
        </div>

        {/* List */}
        <div className="surface-elevated divide-y divide-border">
          {rest.map((p, idx) => {
            const place = idx + 4;
            const delta = idx % 3 === 0 ? "up" : idx % 3 === 1 ? "down" : "same";
            return (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <span className="w-6 text-sm font-semibold text-muted-foreground tabular-nums">{place}</span>
                <Avatar player={p} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.handle} · {p.country}</p>
                </div>
                <span className="chip chip-muted">Lvl {p.level}</span>
                <span className="font-display text-base tabular-nums">{p.rating}</span>
                <span className={`inline-flex w-16 items-center justify-end gap-1 text-xs font-semibold ${delta === "up" ? "text-success" : delta === "down" ? "text-danger" : "text-muted-foreground"}`}>
                  {delta === "up" && <><ArrowUp className="size-3" />+{idx + 2}</>}
                  {delta === "down" && <><ArrowDown className="size-3" />-{idx + 1}</>}
                  {delta === "same" && <><Minus className="size-3" />0</>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function PodiumCard({
  player,
  place,
  height,
  highlight,
}: {
  player: (typeof players)[number];
  place: number;
  height: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar player={player} size={highlight ? 80 : 56} ring={place === 1 ? "mint" : place === 2 ? "lilac" : "none"} />
      <p className="text-center text-sm font-semibold leading-tight">{player.name}</p>
      <p className="font-display text-base">{player.rating}</p>
      <div className={`flex w-full items-center justify-center rounded-t-xl border border-border bg-surface-elevated ${height} ${highlight ? "animate-podium" : ""}`}>
        <div className="flex flex-col items-center">
          {place === 1 && <Crown className="mb-1 size-5 text-primary" />}
          <span className="font-display text-3xl">{place}</span>
        </div>
      </div>
    </div>
  );
}
