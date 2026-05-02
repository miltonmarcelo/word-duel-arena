import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Globe2,
  Hash,
  KeyRound,
  Loader2,
  Lock,
  Plus,
  Trophy,
  Users,
  Clock,
  Hourglass,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { currentUser, rooms as initialRooms, players, type Room } from "@/lib/mock-data";

export const Route = createFileRoute("/rooms")({
  head: () => ({ meta: [{ title: "Rooms — WordClash" }] }),
  component: RoomsPage,
});

const THEMES = [
  { id: "general", label: "General", emoji: "✨" },
  { id: "cinema", label: "Cinema", emoji: "🎬" },
  { id: "sports", label: "Sports", emoji: "🏅" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "geography", label: "Geography", emoji: "🌍" },
] as const;

const TIME_LIMITS = [
  { id: "8h", label: "8 hours" },
  { id: "12h", label: "12 hours" },
  { id: "24h", label: "24 hours" },
] as const;

type MaxMembers = 4 | 8 | 16 | "unlimited";
const MAX_MEMBERS_OPTS: { value: MaxMembers; label: string }[] = [
  { value: 4, label: "4" },
  { value: 8, label: "8" },
  { value: 16, label: "16" },
  { value: "unlimited", label: "∞" },
];

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `CLASH-${s}`;
}

function formatJoinCode(raw: string) {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  if (cleaned.length <= 4) return cleaned;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
}

const MOCK_PREVIEW_HOSTS = ["Mira Chen", "Diego Alvarez", "Yuki Tanaka", "Nora Lindqvist"];
const MOCK_PREVIEW_THEMES = ["Cinema", "Music", "Sports", "Science", "Food"];
const MOCK_PREVIEW_EMOJI = ["🎬", "🎵", "🏅", "🔬", "🍜"];
const MOCK_PREVIEW_TIMES = ["8h per word", "12h per word", "24h per word"];

type RoomStatus = "active" | "played" | "waiting";

type MyRoom = Room & {
  theme: string;
  status: RoomStatus;
  remaining: string;
  position: number;
  total: number;
  isNew?: boolean;
};

type PublicRoom = Room & {
  theme: string;
  host: typeof players[number];
  timeLimit: string;
};

const myRoomsSeed: MyRoom[] = [
  {
    ...initialRooms[0],
    theme: "Cinema",
    status: "active",
    remaining: "6h 22m remaining",
    position: 2,
    total: 8,
  },
  {
    ...initialRooms[1],
    theme: "General",
    status: "played",
    remaining: "9h 04m remaining",
    position: 1,
    total: 6,
  },
  {
    ...initialRooms[2],
    theme: "Music",
    status: "waiting",
    remaining: "Waiting for next word",
    position: 4,
    total: 5,
  },
];

const publicRoomsSeed: PublicRoom[] = [
  {
    ...initialRooms[3],
    theme: "Science",
    host: players[2],
    timeLimit: "12h per word",
  },
  {
    id: "p-1",
    name: "Foodies United",
    emoji: "🍜",
    activity: "live",
    description: "Daily duels for the kitchen-obsessed.",
    members: players.slice(1, 7),
    theme: "Food",
    host: players[1],
    timeLimit: "24h per word",
  },
  {
    id: "p-2",
    name: "Goal Diggers",
    emoji: "🏅",
    activity: "live",
    description: "Sports words only. No mercy.",
    members: players.slice(0, 5),
    theme: "Sports",
    host: players[0],
    timeLimit: "8h per word",
  },
  {
    id: "p-3",
    name: "Synth & Strings",
    emoji: "🎵",
    activity: "idle",
    description: "From classical to k-pop.",
    members: players.slice(3, 8),
    theme: "Music",
    host: players[4],
    timeLimit: "24h per word",
  },
];

const statusMeta: Record<
  RoomStatus,
  { dot: string; label: string; tone: string }
> = {
  active: {
    dot: "bg-correct",
    label: "Word active — play now",
    tone: "text-correct",
  },
  played: {
    dot: "bg-warning",
    label: "You already played this word",
    tone: "text-warning",
  },
  waiting: {
    dot: "bg-muted-foreground",
    label: "Waiting for next word",
    tone: "text-muted-foreground",
  },
};

function RoomsPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [name, setName] = useState("");
  const [themeId, setThemeId] = useState<(typeof THEMES)[number]["id"]>("general");
  const [maxMembers, setMaxMembers] = useState<MaxMembers>(8);
  const [timeLimit, setTimeLimit] = useState<(typeof TIME_LIMITS)[number]["id"]>("12h");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [inviteCode, setInviteCode] = useState(() => generateInviteCode());
  const [codeCopied, setCodeCopied] = useState(false);
  const [myRooms, setMyRooms] = useState<MyRoom[]>(myRoomsSeed);
  const [publicRooms, setPublicRooms] = useState<PublicRoom[]>(publicRoomsSeed);
  const [joinPreview, setJoinPreview] = useState<{
    name: string;
    host: typeof players[number];
    members: number;
    theme: string;
    emoji: string;
    timeLimit: string;
    privacy: "public" | "private";
  } | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);

  // Mock: any non-empty code shows a preview after a brief loading state
  useEffect(() => {
    const cleaned = joinCode.replace(/[^A-Z0-9]/g, "");
    if (cleaned.length === 0) {
      setJoinPreview(null);
      setJoinLoading(false);
      return;
    }
    setJoinLoading(true);
    setJoinPreview(null);
    const seed = cleaned.charCodeAt(0) || 0;
    const hostIdx = seed % MOCK_PREVIEW_HOSTS.length;
    const themeIdx = (seed + cleaned.length) % MOCK_PREVIEW_THEMES.length;
    const t = setTimeout(() => {
      const host = players.find((p) => p.name === MOCK_PREVIEW_HOSTS[hostIdx]) ?? players[0];
      setJoinPreview({
        name: `${MOCK_PREVIEW_THEMES[themeIdx]} Clash`,
        host,
        members: 3 + (seed % 8),
        theme: MOCK_PREVIEW_THEMES[themeIdx],
        emoji: MOCK_PREVIEW_EMOJI[themeIdx % MOCK_PREVIEW_EMOJI.length],
        timeLimit: MOCK_PREVIEW_TIMES[seed % MOCK_PREVIEW_TIMES.length],
        privacy: cleaned.length % 2 === 0 ? "private" : "public",
      });
      setJoinLoading(false);
    }, 450);
    return () => clearTimeout(t);
  }, [joinCode]);


  const timeLimitLabel = useMemo(
    () => TIME_LIMITS.find((t) => t.id === timeLimit)!.label,
    [timeLimit],
  );

  function resetForm() {
    setName("");
    setThemeId("general");
    setMaxMembers(8);
    setTimeLimit("12h");
    setPrivacy("public");
    setInviteCode(generateInviteCode());
    setCodeCopied(false);
  }

  function copyInvite() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(inviteCode).catch(() => {});
    }
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1600);
  }

  function handleCreate() {
    const theme = THEMES.find((t) => t.id === themeId)!;
    const finalName = name.trim() || `${theme.label} Room`;
    const memberLabel = maxMembers === "unlimited" ? "unlimited members" : `up to ${maxMembers} players`;
    const newRoomId = `r-new-${Date.now()}`;
    const newRoom: MyRoom = {
      id: newRoomId,
      name: finalName,
      emoji: theme.emoji,
      activity: "live",
      description: `${privacy === "public" ? "Public" : "Private"} · ${theme.label} · ${timeLimitLabel} · ${memberLabel}`,
      members: [currentUser],
      theme: theme.label,
      status: "waiting",
      remaining: "Waiting for next word",
      position: 1,
      total: 1,
      isNew: true,
    };
    setMyRooms((prev) => [newRoom, ...prev]);
    const codeForToast = inviteCode;
    setOpen(false);
    resetForm();
    toast.success("Room created!", {
      description: `Share your code: ${codeForToast}`,
    });
    navigate({ to: "/rooms/$roomId", params: { roomId: newRoomId } });
  }

  function handleJoin() {
    if (!joinPreview) return;
    const newRoomId = `r-join-${Date.now()}`;
    const newRoom: MyRoom = {
      id: newRoomId,
      name: joinPreview.name,
      emoji: joinPreview.emoji,
      activity: "live",
      description: `${joinPreview.privacy === "public" ? "Public" : "Private"} · ${joinPreview.theme} · ${joinPreview.timeLimit}`,
      members: [currentUser, joinPreview.host, ...players.slice(0, Math.max(0, joinPreview.members - 2))],
      theme: joinPreview.theme,
      status: "active",
      remaining: "11h 58m remaining",
      position: joinPreview.members + 1,
      total: joinPreview.members + 1,
      isNew: true,
    };
    setMyRooms((prev) => [newRoom, ...prev]);
    const joinedName = joinPreview.name;
    setJoinOpen(false);
    setJoinCode("");
    setJoinPreview(null);
    toast.success(`You joined ${joinedName}!`);
    navigate({ to: "/rooms/$roomId", params: { roomId: newRoomId } });
  }

  function joinPublic(room: PublicRoom) {
    setPublicRooms((prev) => prev.filter((r) => r.id !== room.id));
    setMyRooms((prev) => [
      {
        ...room,
        status: "active",
        remaining: "11h 58m remaining",
        position: room.members.length + 1,
        total: room.members.length + 1,
        isNew: true,
      },
      ...prev,
    ]);
    toast.success(`Joined ${room.name}`);
  }

  return (
    <AppShell>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Private leagues
            </p>
            <h1 className="font-display text-4xl sm:text-5xl">Rooms.</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Persistent word battles with your favorite people. One word at a time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setJoinOpen(true)}>
              <Hash className="size-4" /> Join with code
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" /> Create Room
            </Button>
          </div>
        </div>

        {/* SECTION 1 — My Rooms */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl">My Rooms</h2>
              <p className="text-xs text-muted-foreground">
                Rooms you've joined or created.
              </p>
            </div>
            <span className="chip chip-muted">{myRooms.length} active</span>
          </div>

          {myRooms.length === 0 ? (
            <EmptyMyRooms onCreate={() => setOpen(true)} onJoin={() => setJoinOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {myRooms.map((r) => (
                <MyRoomCard key={r.id} room={r} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2 — Public Rooms */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl">Public Rooms</h2>
              <p className="text-xs text-muted-foreground">
                Open lobbies — jump in and start playing.
              </p>
            </div>
            <span className="chip chip-muted">
              <Globe2 className="size-3" /> {publicRooms.length} open
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicRooms.map((r) => (
              <PublicRoomCard key={r.id} room={r} onJoin={() => joinPublic(r)} />
            ))}
          </div>
        </section>
      </div>

      {/* Create Room Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Create a room</DialogTitle>
            <DialogDescription>
              Set up a private league for friends, family or your team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Name */}
            <div>
              <Label htmlFor="room-name">
                Room name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="room-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Friday Night Clash"
                className="mt-1.5"
                maxLength={32}
                autoFocus
              />
            </div>

            {/* Theme */}
            <div>
              <Label>Theme</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {THEMES.map((t) => {
                  const active = t.id === themeId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeId(t.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm transition",
                        active
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      <span aria-hidden>{t.emoji}</span>
                      <span className="font-semibold">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <Label>Privacy</Label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {([
                  { id: "public", label: "Public", Icon: Globe2, desc: "Anyone with the link" },
                  { id: "private", label: "Private", Icon: Lock, desc: "Invite only" },
                ] as const).map((opt) => {
                  const active = opt.id === privacy;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPrivacy(opt.id)}
                      className={cn(
                        "flex items-start gap-2 rounded-xl border-2 p-3 text-left transition",
                        active
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <opt.Icon
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <div>
                        <p className="text-sm font-semibold">{opt.label}</p>
                        <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Invite code preview when Private */}
              {privacy === "private" && (
                <div className="mt-3 rounded-xl border border-accent/30 bg-accent/5 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                    Invite code
                  </p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <code className="font-display text-lg tracking-widest text-foreground">
                      {inviteCode}
                    </code>
                    <button
                      type="button"
                      onClick={copyInvite}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
                    >
                      {codeCopied ? (
                        <>
                          <Check className="size-3.5 text-correct" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Share this with friends so they can join.
                  </p>
                </div>
              )}
            </div>

            {/* Word time limit */}
            <div>
              <Label>Word time limit</Label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {TIME_LIMITS.map((t) => {
                  const active = t.id === timeLimit;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimeLimit(t.id)}
                      className={cn(
                        "rounded-xl border-2 py-2.5 text-sm font-display transition",
                        active
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                This is also the minimum wait time before launching the next word.
              </p>
            </div>

            {/* Max members */}
            <div>
              <Label>Max members</Label>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {MAX_MEMBERS_OPTS.map((opt) => {
                  const active = opt.value === maxMembers;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setMaxMembers(opt.value)}
                      className={cn(
                        "rounded-xl border-2 py-2 text-sm font-display transition",
                        active
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="gap-1.5">
              <Plus className="size-4" /> Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join with code Dialog */}
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Join with code</DialogTitle>
            <DialogDescription>
              Got a room code from a friend? Drop it in.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="join-code">Room code</Label>
            <Input
              id="join-code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="e.g. WORD-42AB"
              className="mt-1.5 uppercase tracking-widest font-display"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setJoinOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoin}>
              <KeyRound className="size-4" /> Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function MyRoomCard({ room }: { room: MyRoom }) {
  const meta = statusMeta[room.status];
  const canPlay = room.status === "active";
  const TimerIcon = room.status === "waiting" ? Hourglass : Clock;

  return (
    <div className="surface-elevated p-6 transition-transform hover:-translate-y-0.5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{room.emoji}</span>
          <div>
            <h3 className="font-display text-xl leading-tight">{room.name}</h3>
            <span className="mt-1 inline-block chip chip-muted">{room.theme}</span>
          </div>
        </div>
        {room.isNew && <span className="chip">✨ New</span>}
      </div>

      {/* Status row */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            meta.dot,
            room.status === "active" && "animate-pulse",
          )}
        />
        <span className={cn("font-semibold", meta.tone)}>{meta.label}</span>
      </div>

      {/* Timer + position */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-muted-foreground">
          <TimerIcon className="size-3.5" />
          <span className="truncate">{room.remaining}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-muted-foreground">
          <Trophy className="size-3.5 text-accent" />
          <span>
            You're <span className="font-semibold text-foreground">#{room.position}</span> of{" "}
            {room.total}
          </span>
        </div>
      </div>

      {/* Members */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {room.members.slice(0, 5).map((m) => (
              <Avatar key={m.id} player={m} size={30} />
            ))}
          </div>
          <span className="ml-3 text-xs text-muted-foreground">
            {room.members.length} members
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-5 flex gap-2">
        {canPlay && (
          <Button asChild className="flex-1">
            <Link to="/match">
              <Sparkles className="size-4" /> Play Now
            </Link>
          </Button>
        )}
        <Button asChild variant="secondary" className={cn(!canPlay && "flex-1")}>
          <Link to="/rooms/$roomId" params={{ roomId: room.id }}>
            <Users className="size-4" /> View Room
          </Link>
        </Button>
      </div>
    </div>
  );
}

function PublicRoomCard({ room, onJoin }: { room: PublicRoom; onJoin: () => void }) {
  return (
    <div className="surface-elevated p-5 transition-transform hover:-translate-y-0.5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{room.emoji}</span>
          <div>
            <h3 className="font-display text-lg leading-tight">{room.name}</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              <span className="chip chip-muted">{room.theme}</span>
              <span className="chip chip-muted">
                <Clock className="size-3" /> {room.timeLimit}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Avatar player={room.host} size={24} />
        <span>
          Hosted by <span className="font-semibold text-foreground">{room.host.name}</span>
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="size-3.5" />
          {room.members.length} members
        </div>
        <Button size="sm" onClick={onJoin}>
          Join Room
        </Button>
      </div>
    </div>
  );
}

function EmptyMyRooms({
  onCreate,
  onJoin,
}: {
  onCreate: () => void;
  onJoin: () => void;
}) {
  return (
    <div className="surface-elevated flex flex-col items-center gap-3 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-3xl">
        🏠
      </div>
      <h3 className="font-display text-xl">You haven't joined any rooms yet</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Rooms are persistent leagues with friends. One word a day. Climb the local leaderboard.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Button onClick={onCreate}>
          <Plus className="size-4" /> Create Room
        </Button>
        <Button variant="secondary" onClick={onJoin}>
          <Hash className="size-4" /> Join with code
        </Button>
      </div>
    </div>
  );
}
