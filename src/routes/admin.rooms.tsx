import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { adminRooms, type AdminRoom } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/rooms")({
  component: RoomsPage,
});

function RoomsPage() {
  const [status, setStatus] = useState("all");
  const filtered = useMemo(() => adminRooms.filter((r) => status === "all" || r.status === status), [status]);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl">Rooms</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} rooms</p>
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <div className="rounded-xl border border-border bg-surface-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active word</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id} className={r.status === "active" ? "bg-primary/5" : ""}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.host.name}</TableCell>
                <TableCell className="tabular-nums">{r.members.length}</TableCell>
                <TableCell><RoomStatusBadge status={r.status} /></TableCell>
                <TableCell className="font-display tracking-widest">{r.activeWord ?? <span className="text-muted-foreground font-sans text-xs">—</span>}</TableCell>
                <TableCell>{r.theme}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.createdAt}</TableCell>
                <TableCell className="tabular-nums">{r.reportCount}</TableCell>
                <TableCell className="text-right"><RoomSheet room={r} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RoomStatusBadge({ status }: { status: AdminRoom["status"] }) {
  const map = {
    active: "bg-primary/15 text-primary",
    waiting: "bg-accent/15 text-accent",
    closed: "bg-muted text-muted-foreground",
  } as const;
  return <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", map[status])}>{status}</span>;
}

function RoomSheet({ room }: { room: AdminRoom }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><Button size="sm" variant="ghost">View</Button></SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader><SheetTitle>{room.name}</SheetTitle></SheetHeader>
        <div className="space-y-4 px-4 py-4 text-sm">
          <p><span className="text-muted-foreground">Host:</span> {room.host.name}</p>
          <p><span className="text-muted-foreground">Theme:</span> {room.theme}</p>
          <p><span className="text-muted-foreground">Active word:</span> <span className="font-display tracking-widest">{room.activeWord ?? "—"}</span></p>
          <p><span className="text-muted-foreground">Total matches:</span> {room.totalMatches}</p>
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Members ({room.members.length})</p>
            <ul className="space-y-1">
              {room.members.map((m) => (
                <li key={m.id} className="rounded-md bg-surface-soft px-3 py-2 text-sm">{m.name} <span className="text-xs text-muted-foreground">{m.handle}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Reports on this room</p>
            <p className="text-sm tabular-nums">{room.reportCount} report(s)</p>
          </div>
        </div>
        <SheetFooter className="flex-col gap-2">
          <Button variant="outline" onClick={() => toast.success("Host transfer initiated")}>Transfer host</Button>
          <Button variant="destructive" onClick={() => { toast.error(`${room.name} closed`); setOpen(false); }}>Force close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
