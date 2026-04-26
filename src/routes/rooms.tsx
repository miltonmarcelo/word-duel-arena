import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { rooms } from "@/lib/mock-data";

export const Route = createFileRoute("/rooms")({
  head: () => ({ meta: [{ title: "Rooms — WordClash" }] }),
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Private leagues</p>
            <h1 className="font-display text-4xl sm:text-5xl">Your rooms.</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary"><KeyRound className="size-4" /> Join by code</Button>
            <Button><Plus className="size-4" /> New room</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rooms.map((r) => (
            <div key={r.id} className="surface-elevated p-6 transition-transform hover:-translate-y-0.5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{r.emoji}</span>
                <span className={`chip ${r.activity === "live" ? "" : "chip-muted"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${r.activity === "live" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                  {r.activity}
                </span>
              </div>
              <h3 className="font-display text-2xl">{r.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {r.members.slice(0, 5).map((m) => <Avatar key={m.id} player={m} size={32} />)}
                  <span className="ml-3 self-center text-xs text-muted-foreground">{r.members.length} members</span>
                </div>
                <Link to="/rooms/$roomId" params={{ roomId: r.id }}>
                  <Button size="sm" variant="ghost">Open</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
