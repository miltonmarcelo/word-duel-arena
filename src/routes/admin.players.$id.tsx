import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/Avatar";
import { adminPlayers, adminMatches, adminReports } from "@/lib/admin-mock-data";
import { PlayerStatusBadge } from "./admin.players";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/players/$id")({
  loader: ({ params }) => {
    const player = adminPlayers.find((p) => p.id === params.id);
    if (!player) throw notFound();
    return { player };
  },
  notFoundComponent: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Player not found.</p>
      <Link to="/admin/players" className="text-sm text-primary hover:underline">Back to players</Link>
    </div>
  ),
  errorComponent: ({ error }) => <p className="text-sm text-destructive">{error.message}</p>,
  component: PlayerDetail,
});

const TAGS = ["VIP", "Suspicious", "Under Review"] as const;

function PlayerDetail() {
  const { player } = Route.useLoaderData();
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const playerMatches = adminMatches.filter((m) => m.playerA.id === player.id || m.playerB.id === player.id).slice(0, 10);
  const playerReports = adminReports.filter((r) => r.target === player.name);

  const wins = playerMatches.filter((m) => (m.playerA.id === player.id ? m.result === "a_wins" : m.result === "b_wins")).length;
  const losses = playerMatches.filter((m) => (m.playerA.id === player.id ? m.result === "b_wins" : m.result === "a_wins")).length;
  const draws = playerMatches.filter((m) => m.result === "draw").length;
  const wr = playerMatches.length ? Math.round((wins / playerMatches.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/players" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to players
        </Link>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toast(`Warning sent to ${player.name}`)}>Warn</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success(`${player.name} suspended`)}>Suspend</Button>
          <Button size="sm" variant="destructive" onClick={() => toast.error(`${player.name} banned`)}>Ban</Button>
          <Button size="sm" variant="ghost" onClick={() => toast(`Stats reset for ${player.name}`)}>Reset stats</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="space-y-5 rounded-xl border border-border bg-surface-elevated p-5">
          <div className="flex items-center gap-3">
            <Avatar player={player} size={56} ring="mint" />
            <div>
              <h2 className="font-display text-2xl">{player.name}</h2>
              <p className="text-sm text-muted-foreground">{player.handle}</p>
            </div>
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="Email" value={player.email} />
            <Row label="Region" value={player.region} />
            <Row label="Level" value={String(player.level)} />
            <Row label="Rating" value={String(player.rating)} />
            <Row label="Joined" value={player.joinedAt} />
            <Row label="Last seen" value={player.lastSeen} />
          </dl>
          <div className="flex items-center justify-between pt-2">
            <PlayerStatusBadge status={player.status} />
            <Button size="sm" variant="ghost" onClick={() => toast("Status change opened")}>Change status</Button>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => {
                const on = tags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      on ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Internal note</p>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note about this player…" rows={4} />
          </div>
          <div className="grid grid-cols-4 gap-2 rounded-lg border border-border bg-surface-soft p-3 text-center">
            <Stat label="Total" value={player.totalMatches} />
            <Stat label="Wins" value={wins} />
            <Stat label="Losses" value={losses} />
            <Stat label="WR%" value={`${wr}%`} />
          </div>
        </aside>

        <div className="space-y-4 lg:col-span-2">
          <Tabs defaultValue="matches">
            <TabsList>
              <TabsTrigger value="matches">Recent Matches</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="matches" className="mt-4 rounded-xl border border-border bg-surface-elevated">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Word</TableHead>
                    <TableHead>Opponent</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Guesses</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerMatches.map((m) => {
                    const isA = m.playerA.id === player.id;
                    const opp = isA ? m.playerB : m.playerA;
                    const result = m.result === "draw" ? "draw" : (isA ? m.result === "a_wins" : m.result === "b_wins") ? "win" : "loss";
                    return (
                      <TableRow key={m.id}>
                        <TableCell className="font-display tracking-widest">{m.word}</TableCell>
                        <TableCell>{opp.name}</TableCell>
                        <TableCell className="capitalize">
                          <span className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                            result === "win" && "bg-[color:var(--correct)]/15 text-[color:var(--correct)]",
                            result === "loss" && "bg-destructive/15 text-destructive",
                            result === "draw" && "bg-muted text-muted-foreground",
                          )}>{result}</span>
                        </TableCell>
                        <TableCell className="tabular-nums">{isA ? m.playerAGuesses : m.playerBGuesses}</TableCell>
                        <TableCell className="tabular-nums">+{isA ? m.xpA : m.xpB}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(m.startedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="reports" className="mt-4 rounded-xl border border-border bg-surface-elevated">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerReports.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No reports.</TableCell></TableRow>
                  ) : playerReports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell>{r.reason}</TableCell>
                      <TableCell>{r.reportedBy.name}</TableCell>
                      <TableCell className="capitalize">{r.status}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="timeline" className="mt-4 rounded-xl border border-border bg-surface-elevated p-5">
              <ol className="relative space-y-4 border-l border-border pl-5">
                <Event date={player.joinedAt} title="Account created" />
                <Event date="3 months ago" title="First ranked match" />
                {player.reportCount > 0 && <Event date="1 month ago" title={`First report received (${player.reportCount} total)`} accent="warning" />}
                {player.warnings > 0 && <Event date="2 weeks ago" title={`Warning issued (${player.warnings})`} accent="warning" />}
                {player.status !== "active" && <Event date="Recently" title={`Account ${player.status}`} accent="destructive" />}
              </ol>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="font-display text-lg tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Event({ date, title, accent }: { date: string; title: string; accent?: "warning" | "destructive" }) {
  return (
    <li>
      <span className={cn(
        "absolute -left-[5px] mt-1.5 size-2.5 rounded-full",
        accent === "warning" ? "bg-[color:var(--warning)]" : accent === "destructive" ? "bg-destructive" : "bg-primary",
      )} />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{date}</p>
    </li>
  );
}
