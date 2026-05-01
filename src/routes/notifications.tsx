import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUp,
  Award,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Clock,
  Eye,
  Flag,
  Lock,
  Play,
  Sparkles,
  Swords,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  UserPlus,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { notifications as initialNotifications, type NotificationItem, type NotificationType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Word Clash" }] }),
  component: NotificationsPage,
});

type Filter = "all" | "unread" | NotificationType;

const TYPE_META: Record<
  NotificationType,
  { label: string; icon: typeof Bell; color: string }
> = {
  challenge:          { label: "Challenges",        icon: Swords,     color: "var(--accent)" },
  challenge_accepted: { label: "Accepted",          icon: ThumbsUp,   color: "var(--correct)" },
  challenge_declined: { label: "Declined",          icon: ThumbsDown, color: "var(--destructive)" },
  word_locked:        { label: "Word locked",       icon: Lock,       color: "var(--primary)" },
  opponent_finished:  { label: "Opponent finished", icon: Eye,        color: "var(--present)" },
  turn:               { label: "Your turn",         icon: Clock,      color: "var(--warning)" },
  starting:           { label: "Starting",          icon: Play,       color: "var(--primary)" },
  result:             { label: "Results",           icon: Flag,       color: "var(--correct)" },
  ranking:            { label: "Ranking",           icon: ArrowUp,    color: "var(--present)" },
  achievement:        { label: "Achievements",      icon: Award,      color: "var(--warning)" },
  friend:             { label: "Friends",           icon: UserPlus,   color: "var(--accent)" },
  system:             { label: "System",            icon: Sparkles,   color: "var(--muted-foreground)" },
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",                label: "All" },
  { id: "unread",             label: "Unread" },
  { id: "challenge",          label: "Challenges" },
  { id: "challenge_accepted", label: "Accepted" },
  { id: "word_locked",        label: "Word locked" },
  { id: "opponent_finished",  label: "Opponent finished" },
  { id: "turn",               label: "Your turn" },
  { id: "result",             label: "Results" },
  { id: "ranking",            label: "Ranking" },
  { id: "achievement",        label: "Achievements" },
];

function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = items.filter((n) => n.unread).length;

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((n) => n.unread);
    return items.filter((n) => n.type === filter);
  }, [items, filter]);

  const groups = useMemo(() => {
    const today = filtered.filter((n) => n.group === "today");
    const yesterday = filtered.filter((n) => n.group === "yesterday");
    const earlier = filtered.filter((n) => n.group === "earlier");
    return { today, yesterday, earlier };
  }, [filtered]);

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const dismiss = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <AppShell>
      <div className="space-y-6 pb-6 sm:space-y-8">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Inbox</p>
            <h1 className="font-display text-3xl leading-tight sm:text-5xl">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 inline-flex items-center justify-center rounded-full bg-primary px-2.5 py-0.5 align-middle text-sm font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              Stay on top of duels, results and achievements.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-1.5">
              <CheckCheck className="h-4 w-4" /> Mark all as read
            </Button>
          )}
        </header>

        {/* Filter chips */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
                {f.id === "unread" && unreadCount > 0 && (
                  <span className={cn("ml-1.5 rounded-full px-1.5 text-[10px]", active ? "bg-primary-foreground/20" : "bg-primary/15 text-primary")}>
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sections */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            <Section title="Today"     items={groups.today}     onRead={markRead} onDismiss={dismiss} />
            <Section title="Yesterday" items={groups.yesterday} onRead={markRead} onDismiss={dismiss} />
            <Section title="Earlier"   items={groups.earlier}   onRead={markRead} onDismiss={dismiss} />
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ---------- subcomponents ---------- */

function Section({
  title,
  items,
  onRead,
  onDismiss,
}: {
  title: string;
  items: NotificationItem[];
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h2>
      <div className="surface-elevated divide-y divide-border overflow-hidden rounded-2xl">
        {items.map((n) => (
          <NotificationRow key={n.id} n={n} onRead={onRead} onDismiss={onDismiss} />
        ))}
      </div>
    </section>
  );
}

function NotificationRow({
  n,
  onRead,
  onDismiss,
}: {
  n: NotificationItem;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const meta = TYPE_META[n.type];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 p-4 transition-colors",
        n.unread
          ? "bg-[color-mix(in_oklab,var(--primary)_7%,transparent)] hover:bg-[color-mix(in_oklab,var(--primary)_10%,transparent)]"
          : "hover:bg-[color-mix(in_oklab,var(--primary)_4%,transparent)]",
      )}
      onClick={() => n.unread && onRead(n.id)}
      role="button"
      tabIndex={0}
    >
      {/* Unread bar */}
      {n.unread && (
        <span
          aria-hidden
          className="absolute inset-y-3 left-0 w-0.5 rounded-r-full bg-primary"
        />
      )}

      {/* Avatar / icon */}
      <div className="relative shrink-0">
        {n.actor ? (
          <Avatar player={n.actor} size={42} />
        ) : (
          <div
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full"
            style={{
              background: `color-mix(in oklab, ${meta.color} 18%, transparent)`,
              color: meta.color,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        {/* Type badge corner */}
        <span
          className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-card"
          style={{ background: meta.color, color: "var(--background)" }}
          title={meta.label}
        >
          <Icon className="h-2.5 w-2.5" />
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
              <span className="truncate">{n.title}</span>
              {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
            </p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
          </div>
          <span className="shrink-0 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {n.time}
          </span>
        </div>

        {/* Meta chips */}
        {(n.meta?.word || n.meta?.xp || n.meta?.rank || n.meta?.badge) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {n.meta?.word && (
              <span className="rounded-md bg-card px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-widest">
                {n.meta.word}
              </span>
            )}
            {typeof n.meta?.xp === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--correct)_16%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--correct)]">
                <Trophy className="h-2.5 w-2.5" /> +{n.meta.xp} XP
              </span>
            )}
            {typeof n.meta?.rank === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--present)_16%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--present)]">
                <ArrowUp className="h-2.5 w-2.5" />
                #{n.meta.rank}
                {typeof n.meta.deltaRank === "number" && ` (+${n.meta.deltaRank})`}
              </span>
            )}
            {n.meta?.badge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--warning)]">
                <span className="text-sm leading-none">{n.meta.badge}</span> Unlocked
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <ActionRow type={n.type} />
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(n.id);
        }}
        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ActionRow({ type }: { type: NotificationType }) {
  if (type === "challenge") {
    return (
      <div className="mt-2.5 flex gap-2">
        <Link to="/play/your-turn">
          <Button size="sm" className="h-7 gap-1 text-xs">
            <Check className="h-3 w-3" /> Accept
          </Button>
        </Link>
        <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
          <X className="h-3 w-3" /> Decline
        </Button>
      </div>
    );
  }
  if (type === "turn" || type === "starting") {
    return (
      <div className="mt-2.5">
        <Link to="/play/your-turn">
          <Button size="sm" className="h-7 gap-1 text-xs">
            <Play className="h-3 w-3" /> {type === "turn" ? "Play now" : "Join match"}
          </Button>
        </Link>
      </div>
    );
  }
  if (type === "result") {
    return (
      <div className="mt-2.5">
        <Link to="/match/result">
          <Button size="sm" variant="secondary" className="h-7 gap-1 text-xs">
            <Flag className="h-3 w-3" /> View recap
          </Button>
        </Link>
      </div>
    );
  }
  if (type === "ranking") {
    return (
      <div className="mt-2.5">
        <Link to="/ranking">
          <Button size="sm" variant="secondary" className="h-7 gap-1 text-xs">
            <ArrowUp className="h-3 w-3" /> See ranking
          </Button>
        </Link>
      </div>
    );
  }
  if (type === "achievement") {
    return (
      <div className="mt-2.5">
        <Link to="/profile">
          <Button size="sm" variant="secondary" className="h-7 gap-1 text-xs">
            <Award className="h-3 w-3" /> View badge
          </Button>
        </Link>
      </div>
    );
  }
  return null;
}

function EmptyState() {
  return (
    <div className="surface-elevated flex flex-col items-center justify-center gap-3 rounded-2xl p-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
        <BellOff className="h-6 w-6" />
      </div>
      <h3 className="font-display text-xl">All clear</h3>
      <p className="max-w-xs text-sm text-muted-foreground">
        No notifications match this filter. Check back after your next duel.
      </p>
    </div>
  );
}
