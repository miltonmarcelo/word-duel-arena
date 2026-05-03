import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Home,
  LayoutDashboard,
  Settings,
  Swords,
  Trophy,
  User,
  Users,
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
  { to: "/friends",       label: "Friends",       icon: Users },
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
  { to: "/friends",   label: "Friends", icon: Users },
  { to: "/ranking",   label: "Ranks",   icon: Trophy },
  { to: "/profile",   label: "Profile", icon: User },
] as const;

// Mock pending friend requests indicator
const hasPendingFriendRequests = true;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="glass fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border md:flex">
        <div className="px-6 pt-7 pb-5">
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
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--primary)_28%,transparent)]"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground hover:translate-x-0.5",
                )}
              >
                <Icon className={cn("size-4 transition-transform", active && "scale-110")} />
                <span>{label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_18%,transparent)]" />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-surface-soft p-2.5">
            <Avatar player={currentUser} size={40} ring="mint" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{currentUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">Lvl {currentUser.level} · {currentUser.rating}</p>
            </div>
          </div>
          <ThemeToggle className="w-full !rounded-xl" />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="glass sticky top-0 z-20 flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/friends"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-elevated transition-all hover:-translate-y-0.5 hover:border-primary/40"
            aria-label="Friends"
          >
            <Users className="size-4" />
            {hasPendingFriendRequests && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_25%,transparent)]" />
            )}
          </Link>
          <Link
            to="/notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-elevated transition-all hover:-translate-y-0.5 hover:border-primary/40"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_25%,transparent)]" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="md:pl-64">
        <div key={pathname} className="animate-fade-up mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8 md:pb-14 md:pt-10">
          {children}
        </div>
      </main>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-sidebar/90 backdrop-blur-xl md:hidden">
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
              <Icon className={cn("size-5 transition-transform", active && "scale-110")} />
              {label}
              {active && <span className="h-0.5 w-6 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
