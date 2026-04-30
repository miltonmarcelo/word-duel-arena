import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Home,
  LayoutDashboard,
  Settings,
  Swords,
  Trophy,
  User,
  Users2,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "./Avatar";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { to: "/play",          label: "Play",          icon: Swords },
  { to: "/ranking",       label: "Ranking",       icon: Trophy },
  { to: "/stats",         label: "Stats",         icon: BarChart3 },
  { to: "/rooms",         label: "Rooms",         icon: Users2 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/rules",         label: "How to play",   icon: BookOpen },
  { to: "/profile",       label: "Profile",       icon: User },
  { to: "/settings",      label: "Settings",      icon: Settings },
] as const;

const mobileTabs = [
  { to: "/dashboard", label: "Home",    icon: Home },
  { to: "/play",      label: "Play",    icon: Swords },
  { to: "/ranking",   label: "Ranks",   icon: Trophy },
  { to: "/rooms",     label: "Rooms",   icon: Users2 },
  { to: "/profile",   label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar md:flex">
        <div className="px-6 pt-6 pb-4">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span>{label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <Avatar player={currentUser} size={40} ring="mint" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{currentUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">Lvl {currentUser.level} · {currentUser.rating}</p>
            </div>
          </div>
          <ThemeToggle className="w-full !rounded-lg" />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-elevated"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-8">{children}</div>
      </main>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-sidebar/95 backdrop-blur md:hidden">
        {mobileTabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {label}
              {active && <span className="h-0.5 w-6 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
