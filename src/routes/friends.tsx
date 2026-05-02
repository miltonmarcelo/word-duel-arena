import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Check,
  MoreHorizontal,
  Search,
  Swords,
  Trophy,
  UserPlus,
  UserMinus,
  UserX,
  X,
  Flag,
  Users,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { players, type Player } from "@/lib/mock-data";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: "Friends — WordClash" },
      {
        name: "description",
        content:
          "Manage your WordClash friends, requests, and discover new players to challenge.",
      },
    ],
  }),
  component: FriendsPage,
});

type RelStatus = "friend" | "sent" | "received" | "none";

type FriendEntry = Player & {
  online: boolean;
  winRate: number;
  played: number;
  level: number;
  lastSeen?: string;
  status: RelStatus;
  sentAt?: string;
};

// --- Mock relationships -----------------------------------------------------
const base = players.filter((p) => p.id !== "u-0");

const initialFriends: FriendEntry[] = base.map((p, i) => {
  let status: RelStatus = "none";
  if (i < 4) status = "friend";
  else if (i === 4) status = "received";
  else if (i === 5) status = "received";
  else if (i === 6) status = "sent";
  else if (i === 7) status = "sent";
  return {
    ...p,
    online: i % 3 !== 0,
    winRate: 48 + ((i * 7) % 40),
    played: 18 + i * 11,
    level: p.level,
    lastSeen: i % 3 === 0 ? `${(i + 1) * 4}m ago` : undefined,
    status,
    sentAt: status === "sent" ? `${i + 1}d ago` : undefined,
  };
});

// Discoverable extra players (not in main list) for "Find Players" search
const discoverable: FriendEntry[] = [
  { id: "d-1", name: "Lina Park",      handle: "@lina",  level: 23, xp: 0, xpToNext: 0, rating: 2155, avatarColor: "var(--accent)",  initials: "LP", country: "KR", online: true,  winRate: 62, played: 144, status: "none" },
  { id: "d-2", name: "Marco Bianchi",  handle: "@marco", level: 18, xp: 0, xpToNext: 0, rating: 1790, avatarColor: "var(--present)", initials: "MB", country: "IT", online: false, winRate: 51, played: 88,  status: "none", lastSeen: "1h ago" },
  { id: "d-3", name: "Hana Suzuki",    handle: "@hana",  level: 26, xp: 0, xpToNext: 0, rating: 2240, avatarColor: "var(--primary)", initials: "HS", country: "JP", online: true,  winRate: 68, played: 210, status: "none" },
  { id: "d-4", name: "Omar Haddad",    handle: "@omar",  level: 15, xp: 0, xpToNext: 0, rating: 1620, avatarColor: "var(--correct)", initials: "OH", country: "AE", online: false, winRate: 44, played: 56,  status: "none", lastSeen: "3h ago" },
];

function FriendsPage() {
  const [list, setList] = useState<FriendEntry[]>([...initialFriends, ...discoverable]);
  const [tab, setTab] = useState("friends");
  const [profileOf, setProfileOf] = useState<FriendEntry | null>(null);

  const friends = useMemo(() => list.filter((p) => p.status === "friend"), [list]);
  const received = useMemo(() => list.filter((p) => p.status === "received"), [list]);
  const sent = useMemo(() => list.filter((p) => p.status === "sent"), [list]);
  const requestCount = received.length + sent.length;

  function setStatus(id: string, status: RelStatus) {
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    setProfileOf((curr) => (curr && curr.id === id ? { ...curr, status } : curr));
  }

  return (
    <AppShell>
      <header className="page-header max-w-2xl">
        <p className="page-eyebrow">
          <Users className="size-3" /> Community
        </p>
        <h1 className="page-title font-display">Friends</h1>
        <p className="page-subtitle">
          Your duel circle. Manage friends, answer requests, and discover sharp
          new opponents.
        </p>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-xl">
          <TabsTrigger value="friends">
            My Friends
            <span className="ml-2 hidden text-xs opacity-60 sm:inline">
              {friends.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Requests
            {requestCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
                {requestCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="find">Find Players</TabsTrigger>
        </TabsList>

        {/* TAB 1 */}
        <TabsContent value="friends" className="mt-6">
          {friends.length === 0 ? (
            <EmptyState
              icon={<Users className="size-6" />}
              title="No friends yet"
              body="Find players in the Discover tab and send your first request."
              action={
                <Button onClick={() => setTab("find")} className="mt-4">
                  <UserPlus className="mr-2 size-4" />
                  Find players
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {friends.map((f) => (
                <FriendCard
                  key={f.id}
                  friend={f}
                  onOpenProfile={() => setProfileOf(f)}
                  onRemove={() => setStatus(f.id, "none")}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2 */}
        <TabsContent value="requests" className="mt-6 space-y-8">
          <section>
            <SectionHeader
              title="Received"
              count={received.length}
              hint="Players who'd like to connect with you."
            />
            {received.length === 0 ? (
              <EmptyState
                icon={<UserPlus className="size-6" />}
                title="No incoming requests"
                body="When someone wants to add you, they'll appear here."
                compact
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {received.map((p) => (
                  <RequestCard
                    key={p.id}
                    player={p}
                    direction="received"
                    onOpenProfile={() => setProfileOf(p)}
                    onAccept={() => setStatus(p.id, "friend")}
                    onDecline={() => setStatus(p.id, "none")}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeader
              title="Sent"
              count={sent.length}
              hint="Pending invitations awaiting an answer."
            />
            {sent.length === 0 ? (
              <EmptyState
                icon={<Clock className="size-6" />}
                title="No pending invites"
                body="Invites you send will show up here until accepted."
                compact
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sent.map((p) => (
                  <RequestCard
                    key={p.id}
                    player={p}
                    direction="sent"
                    onOpenProfile={() => setProfileOf(p)}
                    onCancel={() => setStatus(p.id, "none")}
                  />
                ))}
              </div>
            )}
          </section>
        </TabsContent>

        {/* TAB 3 */}
        <TabsContent value="find" className="mt-6">
          <FindPlayers
            list={list}
            onOpenProfile={(p) => setProfileOf(p)}
            onAddFriend={(id) => setStatus(id, "sent")}
            onCancel={(id) => setStatus(id, "none")}
          />
        </TabsContent>
      </Tabs>

      <PlayerProfile
        player={profileOf}
        onClose={() => setProfileOf(null)}
        onAdd={(id) => setStatus(id, "sent")}
        onCancel={(id) => setStatus(id, "none")}
        onRemove={(id) => setStatus(id, "none")}
      />
    </AppShell>
  );
}

// ----- Pieces ---------------------------------------------------------------

function SectionHeader({
  title,
  count,
  hint,
}: {
  title: string;
  count: number;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl">
          {title}{" "}
          <span className="text-sm font-sans text-muted-foreground">
            · {count}
          </span>
        </h2>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

function OnlineDot({ online, className }: { online: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "block size-3 rounded-full border-2 border-background",
        online ? "bg-[var(--correct)]" : "bg-muted-foreground/50",
        className,
      )}
      aria-label={online ? "Online" : "Offline"}
    />
  );
}

function FriendCard({
  friend,
  onOpenProfile,
  onRemove,
}: {
  friend: FriendEntry;
  onOpenProfile: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="surface-elevated card-premium-interactive group p-4">
      <div className="flex items-start gap-3">
        <button
          onClick={onOpenProfile}
          className="relative shrink-0 focus-ring rounded-full"
          aria-label={`Open ${friend.name}'s profile`}
        >
          <Avatar player={friend} size={52} />
          <OnlineDot
            online={friend.online}
            className="absolute -bottom-0.5 -right-0.5"
          />
        </button>
        <div className="min-w-0 flex-1">
          <button
            onClick={onOpenProfile}
            className="block truncate text-left text-sm font-semibold hover:text-primary"
          >
            {friend.name}
          </button>
          <p className="truncate text-xs text-muted-foreground">
            {friend.handle}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Trophy className="size-3" /> {friend.rating}
            <span className="opacity-50">·</span>
            {friend.online ? (
              <span className="text-[var(--correct)]">Online</span>
            ) : (
              <span>Last seen {friend.lastSeen ?? "recently"}</span>
            )}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="More actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={onOpenProfile}>
              <UserPlus className="mr-2 size-4" /> View profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onRemove}
              className="text-destructive focus:text-destructive"
            >
              <UserMinus className="mr-2 size-4" /> Remove friend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex gap-2">
        <Link to="/play/match-select" className="flex-1">
          <Button className="w-full gap-2" size="sm">
            <Swords className="size-4" /> Challenge
          </Button>
        </Link>
      </div>
    </div>
  );
}

function RequestCard({
  player,
  direction,
  onOpenProfile,
  onAccept,
  onDecline,
  onCancel,
}: {
  player: FriendEntry;
  direction: "received" | "sent";
  onOpenProfile: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="surface-elevated p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProfile}
          className="relative shrink-0 focus-ring rounded-full"
        >
          <Avatar player={player} size={48} />
        </button>
        <div className="min-w-0 flex-1">
          <button
            onClick={onOpenProfile}
            className="block truncate text-left text-sm font-semibold hover:text-primary"
          >
            {player.name}
          </button>
          <p className="truncate text-xs text-muted-foreground">
            {player.handle} · <Trophy className="inline size-3" /> {player.rating}
          </p>
          {direction === "sent" && player.sentAt && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Sent {player.sentAt}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {direction === "received" ? (
          <>
            <Button onClick={onAccept} size="sm" className="flex-1 gap-1.5">
              <Check className="size-4" /> Accept
            </Button>
            <Button
              onClick={onDecline}
              size="sm"
              variant="ghost"
              className="flex-1 gap-1.5"
            >
              <X className="size-4" /> Decline
            </Button>
          </>
        ) : (
          <Button
            onClick={onCancel}
            size="sm"
            variant="ghost"
            className="w-full gap-1.5"
          >
            <X className="size-4" /> Cancel request
          </Button>
        )}
      </div>
    </div>
  );
}

function FindPlayers({
  list,
  onOpenProfile,
  onAddFriend,
  onCancel,
}: {
  list: FriendEntry[];
  onOpenProfile: (p: FriendEntry) => void;
  onAddFriend: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list.slice(0, 8);
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q),
    );
  }, [query, list]);

  return (
    <div>
      <div className="surface-elevated mb-5 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 pl-9"
            placeholder="Search players by name or @handle…"
          />
        </div>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {query ? `${results.length} match${results.length === 1 ? "" : "es"}` : "Suggested players"}
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<Search className="size-6" />}
          title="No players found"
          body="Try a different name or @handle."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((p) => (
            <DiscoverCard
              key={p.id}
              player={p}
              onOpenProfile={() => onOpenProfile(p)}
              onAdd={() => onAddFriend(p.id)}
              onCancel={() => onCancel(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DiscoverCard({
  player,
  onOpenProfile,
  onAdd,
  onCancel,
}: {
  player: FriendEntry;
  onOpenProfile: () => void;
  onAdd: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="surface-elevated card-premium-interactive p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProfile}
          className="relative shrink-0 focus-ring rounded-full"
        >
          <Avatar player={player} size={48} />
          <OnlineDot
            online={player.online}
            className="absolute -bottom-0.5 -right-0.5"
          />
        </button>
        <div className="min-w-0 flex-1">
          <button
            onClick={onOpenProfile}
            className="block truncate text-left text-sm font-semibold hover:text-primary"
          >
            {player.name}
          </button>
          <p className="truncate text-xs text-muted-foreground">
            {player.handle}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Trophy className="size-3" /> {player.rating} · Lvl {player.level}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {player.status === "friend" && (
          <Button size="sm" variant="ghost" disabled className="w-full gap-1.5">
            <Check className="size-4" /> Friends
          </Button>
        )}
        {player.status === "sent" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            className="w-full gap-1.5 text-muted-foreground"
          >
            <Clock className="size-4" /> Request sent
          </Button>
        )}
        {player.status === "received" && (
          <Button size="sm" className="w-full gap-1.5" onClick={onAdd}>
            <Check className="size-4" /> Accept request
          </Button>
        )}
        {player.status === "none" && (
          <Button size="sm" className="w-full gap-1.5" onClick={onAdd}>
            <UserPlus className="size-4" /> Add friend
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
  action,
  compact,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "surface-elevated text-center",
        compact ? "p-6" : "p-10",
      )}
    >
      <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-surface-soft text-muted-foreground">
        {icon}
      </div>
      <p className="font-display text-lg">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        {body}
      </p>
      {action}
    </div>
  );
}

// ----- Profile sheet/dialog -------------------------------------------------

function PlayerProfile({
  player,
  onClose,
  onAdd,
  onCancel,
  onRemove,
}: {
  player: FriendEntry | null;
  onClose: () => void;
  onAdd: (id: string) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const isMobile = useIsMobile();
  const [confirmBlock, setConfirmBlock] = useState(false);

  const open = !!player;
  const body = player ? (
    <ProfileBody
      player={player}
      onAdd={() => onAdd(player.id)}
      onCancel={() => onCancel(player.id)}
      onRemove={() => {
        onRemove(player.id);
        onClose();
      }}
      onReport={() => setConfirmBlock(true)}
      onClose={onClose}
    />
  ) : null;

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
          <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
            {body}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
          <DialogContent className="max-w-md p-0">
            {body}
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={confirmBlock} onOpenChange={setConfirmBlock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report & block this player?</AlertDialogTitle>
            <AlertDialogDescription>
              They won't be able to challenge you or send you requests. You can
              undo this from Settings later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (player) onRemove(player.id);
                setConfirmBlock(false);
                onClose();
              }}
            >
              Report & block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProfileBody({
  player,
  onAdd,
  onCancel,
  onRemove,
  onReport,
  onClose,
}: {
  player: FriendEntry;
  onAdd: () => void;
  onCancel: () => void;
  onRemove: () => void;
  onReport: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      {/* Hero */}
      <div className="ambient-glow rounded-t-2xl border-b border-border px-6 pb-5 pt-7 text-center">
        <div className="mx-auto mb-3 inline-block">
          <Avatar player={player} size={84} ring="mint" />
        </div>
        <h3 className="font-display text-2xl leading-tight">{player.name}</h3>
        <p className="text-xs text-muted-foreground">
          {player.handle} ·{" "}
          {player.online ? (
            <span className="text-[var(--correct)]">Online</span>
          ) : (
            <span>Last seen {player.lastSeen ?? "recently"}</span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 px-6 pt-5">
        <Stat label="Rating" value={String(player.rating)} />
        <Stat label="Level" value={String(player.level)} />
        <Stat label="Win rate" value={`${player.winRate}%`} />
        <Stat label="Played" value={String(player.played)} />
      </div>

      {/* Actions */}
      <div className="space-y-2 px-6 pb-6 pt-5">
        <Link to="/play/match-select" onClick={onClose}>
          <Button className="w-full gap-2" size="lg">
            <Swords className="size-4" /> Challenge
          </Button>
        </Link>

        {player.status === "none" && (
          <Button onClick={onAdd} variant="secondary" className="w-full gap-2">
            <UserPlus className="size-4" /> Add friend
          </Button>
        )}
        {player.status === "sent" && (
          <Button onClick={onCancel} variant="secondary" className="w-full gap-2">
            <Clock className="size-4" /> Cancel request
          </Button>
        )}
        {player.status === "received" && (
          <Button onClick={onAdd} variant="secondary" className="w-full gap-2">
            <Check className="size-4" /> Accept request
          </Button>
        )}
        {player.status === "friend" && (
          <Button onClick={onRemove} variant="secondary" className="w-full gap-2">
            <UserMinus className="size-4" /> Remove friend
          </Button>
        )}

        <button
          onClick={onReport}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/10"
        >
          <Flag className="size-3.5" /> Report & block
        </button>
      </div>

      <button
        onClick={onClose}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-surface-soft text-muted-foreground hover:text-foreground"
        aria-label="Close"
      >
        <UserX className="hidden" />
        <X className="size-4" />
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-soft px-2 py-3 text-center">
      <p className="font-display text-lg leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
