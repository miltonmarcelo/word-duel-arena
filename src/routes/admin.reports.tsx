import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { adminReports, type AdminReport } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [priority, setPriority] = useState("all");

  const filtered = useMemo(() => {
    return adminReports
      .filter((r) =>
        (status === "all" || r.status === status) &&
        (type === "all" || r.type === type) &&
        (priority === "all" || r.priority === priority),
      )
      .sort((a, b) => {
        const order = { open: 0, reviewing: 1, resolved: 2, dismissed: 3 } as const;
        return order[a.status] - order[b.status];
      });
  }, [status, type, priority]);

  const counts = {
    open: adminReports.filter((r) => r.status === "open").length,
    reviewing: adminReports.filter((r) => r.status === "reviewing").length,
    resolved: adminReports.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Moderation queue</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="player">Player</SelectItem>
            <SelectItem value="room">Room</SelectItem>
            <SelectItem value="message">Message</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
          <SummaryChip label="Open" count={counts.open} accent="warning" />
          <SummaryChip label="Reviewing" count={counts.reviewing} accent="primary" />
          <SummaryChip label="Resolved" count={counts.resolved} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reported by</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => {
              const dim = r.status === "resolved" || r.status === "dismissed";
              return (
                <TableRow key={r.id} className={cn(dim && "opacity-50")}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="capitalize">{r.type}</TableCell>
                  <TableCell>{r.reportedBy.name}</TableCell>
                  <TableCell>{r.target}</TableCell>
                  <TableCell className="max-w-xs truncate">{r.reason}</TableCell>
                  <TableCell><PriorityBadge priority={r.priority} /></TableCell>
                  <TableCell><ReportStatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right"><ReportSheet report={r} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SummaryChip({ label, count, accent }: { label: string; count: number; accent?: "warning" | "primary" }) {
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs",
      accent === "warning" && "border-[color:var(--warning)]/30 text-[color:var(--warning)]",
      accent === "primary" && "border-primary/30 text-primary",
    )}>
      <span className="font-medium">{label}</span>
      <span className="font-display tabular-nums">{count}</span>
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: AdminReport["priority"] }) {
  const map = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    high: "bg-destructive/15 text-destructive",
  } as const;
  return <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", map[priority])}>{priority}</span>;
}

function ReportStatusBadge({ status }: { status: AdminReport["status"] }) {
  const map = {
    open: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    reviewing: "bg-primary/15 text-primary",
    resolved: "bg-[color:var(--correct)]/15 text-[color:var(--correct)]",
    dismissed: "bg-muted text-muted-foreground",
  } as const;
  return <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", map[status])}>{status}</span>;
}

function ReportSheet({ report }: { report: AdminReport }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const act = (msg: string) => { toast.success(msg); setOpen(false); };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><Button size="sm" variant="ghost">Review</Button></SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader><SheetTitle>Report {report.id}</SheetTitle></SheetHeader>
        <div className="space-y-4 px-4 py-4 text-sm">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={report.priority} />
            <ReportStatusBadge status={report.status} />
          </div>
          <div className="rounded-lg border border-border bg-surface-soft p-4">
            <p><span className="text-muted-foreground">Reporter:</span> {report.reportedBy.name}</p>
            <p><span className="text-muted-foreground">Target:</span> {report.target}</p>
            <p><span className="text-muted-foreground">Type:</span> <span className="capitalize">{report.type}</span></p>
            <p><span className="text-muted-foreground">Created:</span> {new Date(report.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-muted-foreground">Reason</p>
            <p className="font-medium">{report.reason}</p>
            <p className="mt-2 text-sm text-muted-foreground">{report.detail}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-muted-foreground">Internal note</p>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add a note for the team…" />
          </div>
        </div>
        <SheetFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => act("Marked resolved")}>Mark resolved</Button>
          <Button variant="ghost" onClick={() => act("Dismissed")}>Dismiss</Button>
          <Button variant="outline" onClick={() => act("Escalated")}>Escalate</Button>
          <Button variant="outline" onClick={() => act(`Warning sent to ${report.target}`)}>Warn player</Button>
          <Button variant="destructive" className="col-span-2" onClick={() => act(`${report.target} suspended`)}>Suspend player</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
