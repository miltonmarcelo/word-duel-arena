import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { adminMatches, type AdminMatch } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/matches")({
  component: MatchesPage,
});

const PAGE_SIZE = 10;

function MatchesPage() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");
  const [status, setStatus] = useState("all");
  const [flagged, setFlagged] = useState(false);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return adminMatches.filter((m) => {
      if (mode !== "all" && m.mode !== mode) return false;
      if (status !== "all" && m.status !== status) return false;
      if (flagged && !m.flagged) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!m.word.toLowerCase().includes(q) && !m.playerA.name.toLowerCase().includes(q) && !m.playerB.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, mode, status, flagged]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Match Explorer</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} matches</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by player or word" className="pl-9" />
        </div>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modes</SelectItem>
            <SelectItem value="direct">Direct</SelectItem>
            <SelectItem value="random">Random</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="themed">Themed</SelectItem>
            <SelectItem value="rooms">Rooms</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
            <SelectItem value="void">Void</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="7d">
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last day</SelectItem>
            <SelectItem value="7d">Last 7d</SelectItem>
            <SelectItem value="30d">Last 30d</SelectItem>
          </SelectContent>
        </Select>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <Switch checked={flagged} onCheckedChange={setFlagged} />
          Flagged only
        </label>
      </div>

      <div className="rounded-xl border border-border bg-surface-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match ID</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Word</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Flag</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((m) => (
              <TableRow key={m.id} className={m.flagged ? "bg-[color:var(--warning)]/8" : ""}>
                <TableCell className="font-mono text-xs">{m.id}</TableCell>
                <TableCell className="text-sm">{m.playerA.name} <span className="text-muted-foreground">vs</span> {m.playerB.name}</TableCell>
                <TableCell className="font-display tracking-widest">{m.word}</TableCell>
                <TableCell className="capitalize">{m.mode}</TableCell>
                <TableCell><MatchStatusBadge status={m.status} /></TableCell>
                <TableCell className="tabular-nums">{Math.floor(m.durationSeconds / 60)}:{String(m.durationSeconds % 60).padStart(2, "0")}</TableCell>
                <TableCell className="text-xs">{m.result === "draw" ? "Draw" : m.result === "a_wins" ? "A wins" : "B wins"}</TableCell>
                <TableCell className="text-xs tabular-nums">+{m.xpA}/+{m.xpB}</TableCell>
                <TableCell>{m.flagged ? <span className="text-[color:var(--warning)]">⚑</span> : ""}</TableCell>
                <TableCell className="text-right"><MatchSheet match={m} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Page {page + 1} of {pages}</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}

function MatchStatusBadge({ status }: { status: AdminMatch["status"] }) {
  const map = {
    completed: "bg-[color:var(--correct)]/15 text-[color:var(--correct)]",
    abandoned: "bg-muted text-muted-foreground",
    disputed: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    void: "bg-destructive/15 text-destructive",
  } as const;
  return <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", map[status])}>{status}</span>;
}

function MatchSheet({ match }: { match: AdminMatch }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><Button size="sm" variant="ghost">View</Button></SheetTrigger>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Match {match.id}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Word" value={<span className="font-display tracking-widest text-primary">{match.word}</span>} />
            <DetailField label="Mode" value={<span className="capitalize">{match.mode}</span>} />
            <DetailField label="Theme" value={match.theme} />
            <DetailField label="Status" value={<MatchStatusBadge status={match.status} />} />
            <DetailField label="Started" value={new Date(match.startedAt).toLocaleString()} />
            <DetailField label="Duration" value={`${Math.floor(match.durationSeconds / 60)}m ${match.durationSeconds % 60}s`} />
          </div>
          <div className="rounded-lg border border-border bg-surface-soft p-4">
            <h3 className="mb-2 text-xs font-bold uppercase text-muted-foreground">Players</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-medium">{match.playerA.name}</p>
                <p className="text-xs text-muted-foreground">Guesses: {match.playerAGuesses} · +{match.xpA} XP</p>
              </div>
              <div>
                <p className="font-medium">{match.playerB.name}</p>
                <p className="text-xs text-muted-foreground">Guesses: {match.playerBGuesses} · +{match.xpB} XP</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase text-muted-foreground">Score breakdown</h3>
            <p className="text-sm">Result: {match.result === "draw" ? "Draw" : match.result === "a_wins" ? `${match.playerA.name} wins` : `${match.playerB.name} wins`}</p>
          </div>
        </div>
        <SheetFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
          <Button variant="destructive" onClick={() => { toast.error(`Match ${match.id} voided`); setOpen(false); }}>Void match</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <div className="mt-0.5">{value}</div>
    </div>
  );
}
