import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Swords, Trophy, UserPlus, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — WordClash" }] }),
  component: NotificationsPage,
});

const iconFor = {
  challenge: Swords,
  win: Trophy,
  friend: UserPlus,
  system: Bell,
} as const;

function NotificationsPage() {
  const today = notifications.filter((n) => n.time.includes("m") || n.time.includes("h"));
  const earlier = notifications.filter((n) => !today.includes(n));
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Inbox</p>
          <h1 className="font-display text-4xl sm:text-5xl">Notifications.</h1>
        </div>

        <Section title="Today" items={today} />
        <Section title="Earlier" items={earlier} />
      </div>
    </AppShell>
  );
}

function Section({ title, items }: { title: string; items: typeof notifications }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="surface-elevated divide-y divide-border">
        {items.map((n) => {
          const Icon = iconFor[n.type];
          const tone =
            n.type === "challenge" ? "text-accent bg-accent/15" :
            n.type === "win" ? "text-primary bg-primary/15" :
            n.type === "friend" ? "text-warning bg-warning/15" :
            "text-muted-foreground bg-muted";
          return (
            <div key={n.id} className="flex items-start gap-3 p-4">
              {n.actor ? <Avatar player={n.actor} size={40} /> : (
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tone}`}><Icon className="size-4" /></div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{n.body} · {n.time}</p>
                {n.type === "challenge" && (
                  <div className="mt-2 flex gap-2">
                    <Button size="sm"><Check className="size-3" /> Accept</Button>
                    <Button size="sm" variant="ghost"><X className="size-3" /> Decline</Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
