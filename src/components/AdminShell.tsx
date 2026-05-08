import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookText,
  Swords,
  Users2,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { currentAdmin } from "@/lib/admin-mock-data";

const groups: Array<{
  label: string;
  items: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}> = [
  {
    label: "Operations",
    items: [
      { to: "/admin/overview", label: "Overview", icon: LayoutDashboard },
      { to: "/admin/words", label: "Word Management", icon: BookText },
      { to: "/admin/matches", label: "Matches", icon: Swords },
      { to: "/admin/rooms", label: "Rooms", icon: Users2 },
    ],
  },
  {
    label: "Players",
    items: [
      { to: "/admin/players", label: "All Players", icon: Users },
      { to: "/admin/reports", label: "Reports", icon: ShieldAlert },
    ],
  },
  {
    label: "System",
    items: [{ to: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="dark min-h-screen bg-background text-foreground" style={{ colorScheme: "dark" }}>
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center gap-2 px-6 pb-5 pt-7">
          <Logo />
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-[10px] uppercase tracking-wider text-primary">
            Admin
          </Badge>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {g.label}
              </p>
              <div className="space-y-1">
                {g.items.map(({ to, label, icon: Icon }) => {
                  const active = pathname === to || pathname.startsWith(to + "/");
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/12 text-primary"
                          : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Link
            to="/dashboard"
            className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <LogOut className="size-4" />
            Exit Admin
          </Link>
          <div className="flex items-center gap-3 rounded-lg bg-surface-soft p-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {currentAdmin.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{currentAdmin.name}</p>
              <p className="truncate text-xs text-muted-foreground">{currentAdmin.role}</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="pl-60">
        <div className="min-h-screen p-8">{children}</div>
      </main>
    </div>
  );
}
