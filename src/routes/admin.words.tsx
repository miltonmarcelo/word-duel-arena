import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminWords, dailySchedule, type AdminWord } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/words")({
  component: WordsPage,
});

function WordsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Word Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Schedule daily words and curate the bank.</p>
      </header>
      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Daily Schedule</TabsTrigger>
          <TabsTrigger value="bank">Word Bank</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule" className="mt-6">
          <ScheduleView />
        </TabsContent>
        <TabsContent value="bank" className="mt-6">
          <BankView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScheduleView() {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated">
      <ul className="divide-y divide-border">
        {dailySchedule.map((d, idx) => {
          const isToday = idx === 0;
          const date = new Date(d.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
          return (
            <li
              key={d.date}
              className={cn(
                "flex items-center justify-between gap-4 px-5 py-4",
                isToday && "bg-primary/5",
              )}
            >
              <div className="flex w-40 items-center gap-3">
                <span className={cn("text-sm font-medium", isToday && "text-primary")}>{date}</span>
                {isToday && <Badge className="bg-primary/15 text-[10px] uppercase text-primary">Today</Badge>}
              </div>
              <div className="flex-1">
                {d.word ? (
                  <span className="font-display text-xl tracking-widest">{d.word}</span>
                ) : (
                  <span className="text-sm text-[color:var(--warning)]">Not scheduled</span>
                )}
              </div>
              <div className="w-32">
                {d.status === "live" && <Badge className="bg-primary/15 text-primary">Live</Badge>}
                {d.status === "scheduled" && <Badge variant="secondary">Scheduled</Badge>}
                {d.status === "empty" && <Badge variant="outline" className="text-[color:var(--warning)]">Empty</Badge>}
              </div>
              <ScheduleDialog date={d.date} hasWord={!!d.word} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ScheduleDialog({ date, hasWord }: { date: string; hasWord: boolean }) {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={hasWord ? "ghost" : "outline"}>
          {hasWord ? "Reschedule" : "Schedule word"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule word for {date}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="5-letter word"
          value={word}
          maxLength={5}
          onChange={(e) => setWord(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={word.length !== 5}
            onClick={() => {
              toast.success(`${word} scheduled for ${date}`);
              setOpen(false);
              setWord("");
            }}
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BankView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [diffFilter, setDiffFilter] = useState<string>("all");
  const [words, setWords] = useState<AdminWord[]>(adminWords);

  const filtered = useMemo(() => {
    return words.filter((w) => {
      if (search && !w.word.toLowerCase().includes(search.toLowerCase()) && !w.theme.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && w.status !== statusFilter) return false;
      if (diffFilter !== "all" && w.difficulty !== diffFilter) return false;
      return true;
    });
  }, [words, search, statusFilter, diffFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search words or themes" className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
          {(["all","easy","medium","hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                diffFilter === d ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <AddWordSheet onAdd={(w) => setWords((prev) => [w, ...prev])} />
      </div>

      <div className="rounded-xl border border-border bg-surface-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Avg Attempts</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((w, idx) => (
              <TableRow key={w.id} className={idx % 2 === 0 ? "bg-surface-soft/40" : ""}>
                <TableCell className="font-display tracking-widest">{w.word}</TableCell>
                <TableCell>{w.theme}</TableCell>
                <TableCell className="capitalize">{w.difficulty}</TableCell>
                <TableCell><StatusBadge status={w.status} /></TableCell>
                <TableCell className="tabular-nums">{Math.round(w.completionRate * 100)}%</TableCell>
                <TableCell className="tabular-nums">{w.avgAttempts.toFixed(1)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{w.addedAt}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => toast.success(`${w.word} scheduled`)}>Schedule</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast(`${w.word} archived`)}>Archive</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.error(`${w.word} removed`)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AdminWord["status"] }) {
  const map = {
    active: "bg-primary/15 text-primary",
    scheduled: "bg-accent/15 text-accent",
    archived: "bg-muted text-muted-foreground",
    pending: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  } as const;
  return <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", map[status])}>{status}</span>;
}

function AddWordSheet({ onAdd }: { onAdd: (w: AdminWord) => void }) {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const [theme, setTheme] = useState("General");
  const [difficulty, setDifficulty] = useState<AdminWord["difficulty"]>("medium");
  const [status, setStatus] = useState<AdminWord["status"]>("pending");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="ml-auto"><Plus className="mr-1 size-4" /> Add word</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add word</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Word</label>
            <Input
              maxLength={5}
              value={word}
              onChange={(e) => setWord(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
              placeholder="5 letters"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Theme</label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["General","Food","Nature","Sports","Travel","Tech","Music","Animals"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Difficulty</label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as AdminWord["difficulty"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as AdminWord["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={word.length !== 5}
            onClick={() => {
              onAdd({
                id: `w-new-${Date.now()}`,
                word, theme, difficulty, status,
                completionRate: 0, avgAttempts: 0, totalPlayers: 0,
                addedBy: "you@wordclash.io",
                addedAt: new Date().toISOString().slice(0, 10),
              });
              toast.success(`${word} added to bank`);
              setOpen(false);
              setWord("");
            }}
          >
            Add word
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
