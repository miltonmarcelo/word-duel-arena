import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { adminPlayers, type AdminPlayer, type PlayerStatus } from "@/lib/admin-mock-data";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/players")({
  component: PlayersPage,
});

const PAGE_SIZE = 10;

function PlayersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return adminPlayers.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.handle.toLowerCase().includes(q) && !p.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl">All Players</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} players</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Export started")}>
          <Download className="mr-2 size-4" /> Export
        </Button>
      </header>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search name, handle or email" className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-surface-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead>Last seen</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((p, idx) => (
              <TableRow key={p.id} className={idx % 2 === 0 ? "bg-surface-soft/40" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar player={p} size={32} />
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.handle}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{p.level}</TableCell>
                <TableCell className="tabular-nums">{p.rating}</TableCell>
                <TableCell>{p.region}</TableCell>
                <TableCell><PlayerStatusBadge status={p.status} /></TableCell>
                <TableCell className="tabular-nums">{p.reportCount}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.lastSeen}</TableCell>
                <TableCell className="text-right">
                  <Link to="/admin/players/$id" params={{ id: p.id }} className="mr-2 text-xs font-medium text-primary hover:underline">View</Link>
                  <ConfirmAction
                    label="Suspend"
                    title={`Suspend ${p.name}?`}
                    desc="They will lose access immediately."
                    onConfirm={() => toast.success(`${p.name} suspended`)}
                  />
                  <ConfirmAction
                    label="Ban"
                    variant="destructive"
                    title={`Ban ${p.name}?`}
                    desc="This action is severe. The player can appeal."
                    onConfirm={() => toast.error(`${p.name} banned`)}
                  />
                </TableCell>
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

export function PlayerStatusBadge({ status }: { status: PlayerStatus }) {
  const map = {
    active: "bg-[color:var(--correct)]/15 text-[color:var(--correct)]",
    suspended: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    banned: "bg-destructive/15 text-destructive",
  } as const;
  return <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", map[status])}>{status}</span>;
}

function ConfirmAction({
  label, title, desc, onConfirm, variant,
}: { label: string; title: string; desc: string; onConfirm: () => void; variant?: "destructive" }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className={cn("text-xs", variant === "destructive" && "text-destructive hover:text-destructive")}>{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant={variant === "destructive" ? "destructive" : "default"} onClick={() => { onConfirm(); setOpen(false); }}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { AdminPlayer };
