import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Crown,
  Globe2,
  Hourglass,
  Lock,
  LogOut,
  MoreHorizontal,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  Trophy,
  UserCog,
  UserMinus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { rooms, currentUser, players, type Player } from "@/lib/mock-data";

const SETTINGS_THEMES = [
  { id: "general", label: "General", emoji: "✨" },
  { id: "cinema", label: "Cinema", emoji: "🎬" },
  { id: "sports", label: "Sports", emoji: "🏅" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "geography", label: "Geography", emoji: "🌍" },
] as const;

const SETTINGS_TIMES = [
  { id: "8h", label: "8 hours" },
  { id: "12h", label: "12 hours" },
  { id: "24h", label: "24 hours" },
] as const;

type SettingsMaxMembers = 4 | 8 | 16 | "unlimited";
const SETTINGS_MAX_MEMBERS: { value: SettingsMaxMembers; label: string }[] = [
  { value: 4, label: "4" },
  { value: 8, label: "8" },
  { value: 16, label: "16" },
  { value: "unlimited", label: "∞" },
];


export const Route = createFileRoute("/rooms/$roomId")({
  head: () => ({ meta: [{ title: "Room — WordClash" }] }),
  validateSearch: (s: Record<string, unknown>): { state?: WordState; role?: "host" | "member" } => ({
    state:
      s.state === "active-not-played" ||
      s.state === "active-played" ||
      s.state === "expired" ||
      s.state === "waiting"
        ? s.state
        : undefined,
    role: s.role === "host" || s.role === "member" ? s.role : undefined,
  }),
  component: RoomHub,
});

type WordState = "active-not-played" | "active-played" | "expired" | "waiting";

type MemberStatus = "playing" | "finished" | "not-started";

type RoomMember = Player & {
  role: "host" | "member";
  joinedAt: string;
  status: MemberStatus;
  attempts?: number;
  timeTaken?: string;
  points?: number;
  solved?: boolean;
  totalPoints: number;
  wordsSolved: number;
  avgAttempts: number;
};

function roomCodeFor(id: string) {
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  let n = seed * 9301 + 49297;
  for (let i = 0; i < 4; i++) {
    n = (n * 9301 + 49297) % 233280;
    out += alpha[n % alpha.length];
  }
  return `CLASH-${out}`;
}

const JOIN_DATES = [
  "Joined Mar 12",
  "Joined Apr 02",
  "Joined Apr 18",
  "Joined May 05",
  "Joined Jun 01",
  "Joined Jul 19",
  "Joined Aug 24",
  "Joined Sep 08",
];

function RoomHub() {
  const { roomId } = useParams({ from: "/rooms/$roomId" });
  const search = Route.useSearch();
  const room = useMemo(() => rooms.find((r) => r.id === roomId) ?? rooms[0], [roomId]);

  // Mock state controls (toggleable for visual prototype)
  const [wordState, setWordState] = useState<WordState>(search.state ?? "active-not-played");
  const [isHost, setIsHost] = useState<boolean>((search.role ?? "host") === "host");
  const [cooldownActive, setCooldownActive] = useState(false);
  const [launchOpen, setLaunchOpen] = useState(false);

  const code = useMemo(() => roomCodeFor(room.id), [room]);
  const [copied, setCopied] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  // Host-leave flow
  const [hostLeaveOpen, setHostLeaveOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState<RoomMember | null>(null);
  const navigate = useNavigate();

  // Settings sheet
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [closeRoomOpen, setCloseRoomOpen] = useState(false);
  const [sName, setSName] = useState(room.name);
  const [sThemeId, setSThemeId] = useState<(typeof SETTINGS_THEMES)[number]["id"]>("general");
  const [sPrivacy, setSPrivacy] = useState<"public" | "private">("public");
  const [sTimeLimit, setSTimeLimit] = useState<(typeof SETTINGS_TIMES)[number]["id"]>("12h");
  const [sMaxMembers, setSMaxMembers] = useState<SettingsMaxMembers>(8);

  // Reset settings form whenever the sheet opens
  useEffect(() => {
    if (settingsOpen) {
      setSName(room.name);
      setSThemeId("general");
      setSPrivacy("public");
      setSTimeLimit("12h");
      setSMaxMembers(8);
    }
  }, [settingsOpen, room.name]);

  function handleSaveSettings() {
    setSettingsOpen(false);
    toast.success("Room settings saved", {
      description: `${sName.trim() || room.name} updated.`,
    });
  }

  function handleCloseRoom() {
    setCloseRoomOpen(false);
    setSettingsOpen(false);
    toast.success("Room closed.");
    navigate({ to: "/rooms" });
  }


  // Build mock members for the hub
  const members: RoomMember[] = useMemo(() => {
    const base: Player[] = [
      currentUser,
      ...room.members.filter((m) => m.id !== currentUser.id),
      ...players.filter(
        (p) => p.id !== currentUser.id && !room.members.some((m) => m.id === p.id),
      ),
    ].slice(0, 8);

    const statuses: MemberStatus[] = ["finished", "playing", "not-started"];
    return base.map((p, i) => {
      const status: MemberStatus = i === 0 ? (wordState === "active-played" ? "finished" : "playing") : statuses[i % 3];
      const solved = status === "finished" ? i % 4 !== 3 : false;
      return {
        ...p,
        role: i === (isHost ? -1 : 1) ? "host" : i === 0 && isHost ? "host" : i === 1 ? "host" : "member",
        joinedAt: JOIN_DATES[i % JOIN_DATES.length],
        status,
        attempts: solved ? 2 + (i % 4) : status === "finished" ? 6 : undefined,
        timeTaken: solved ? `${1 + (i % 4)}m ${10 + i * 7}s` : undefined,
        points: solved ? 120 - i * 12 : status === "finished" ? 0 : undefined,
        solved,
        totalPoints: 980 - i * 73,
        wordsSolved: 14 - i,
        avgAttempts: 3.2 + i * 0.18,
      };
    }).map((m, i, arr) => {
      // Ensure exactly one host
      const hostIdx = isHost ? 0 : 1;
      return { ...m, role: i === hostIdx ? "host" : "member" };
    }) as RoomMember[];
  }, [room, wordState, isHost]);

  const wordsPlayed = 14;
  const correctWord = "PLATE";
  const youResult = members[0];

  function copyCode() {
    if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(code).catch(() => {});
    }
    setCopied(true);
    toast.success("Room code copied");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <AppShell>
      {/* Top bar */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link to="/rooms">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" /> Rooms
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {/* Visual-prototype state toggles */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                Mock state <ChevronDown className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(
                [
                  ["active-not-played", "Word active — not played"],
                  ["active-played", "Word active — you played"],
                  ["expired", "Word expired"],
                  ["waiting", "No active word"],
                ] as const
              ).map(([k, label]) => (
                <DropdownMenuItem key={k} onClick={() => setWordState(k)}>
                  {wordState === k && <Check className="mr-1 size-3.5 text-primary" />}
                  {label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setIsHost((h) => !h)}>
                <UserCog className="mr-1 size-3.5" /> View as {isHost ? "Member" : "Host"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isHost && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Room settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Room header */}
      <div className="surface-elevated relative overflow-hidden p-5 md:p-7">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip chip-muted">{room.emoji} Theme · General</span>
              {isHost && <span className="chip">👑 You're the host</span>}
            </div>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">{room.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-3.5" /> {members.length} members
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="word" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          <TabsTrigger value="word">Current Word</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* TAB 1 — Current Word */}
        <TabsContent value="word" className="mt-5 space-y-5">
          {wordState === "active-not-played" && (
            <ActiveNotPlayed
              roomId={room.id}
              members={members}
              theme="General"
              correctWord={correctWord}
            />
          )}
          {wordState === "active-played" && (
            <ActivePlayed members={members} you={youResult} />
          )}
          {wordState === "expired" && (
            <ExpiredWord members={members} correctWord={correctWord} />
          )}
          {wordState === "waiting" && (
            <WaitingWord
              isHost={isHost}
              canLaunch={!cooldownActive}
              onLaunch={() => setLaunchOpen(true)}
            />
          )}
        </TabsContent>

        {/* TAB 2 — Leaderboard */}
        <TabsContent value="leaderboard" className="mt-5 space-y-4">
          <div className="surface-elevated flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Words played
              </p>
              <p className="font-display text-2xl">{wordsPlayed}</p>
            </div>
            <span className="chip">
              <Trophy className="size-3 text-accent" /> All-time
            </span>
          </div>

          <div className="surface-elevated divide-y divide-border overflow-hidden">
            <div className="grid grid-cols-[36px_1fr_auto_auto_auto] items-center gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">Points</span>
              <span className="hidden sm:inline text-right">Solved</span>
              <span className="hidden sm:inline text-right">Avg</span>
            </div>
            {[...members]
              .sort((a, b) => b.totalPoints - a.totalPoints)
              .map((m, i) => {
                const isYou = m.id === currentUser.id;
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "grid grid-cols-[36px_1fr_auto_auto_auto] items-center gap-3 px-4 py-3 transition",
                      isYou && "bg-primary/8",
                    )}
                  >
                    <span
                      className={cn(
                        "font-display text-lg",
                        i === 0 && "text-warning",
                        i === 1 && "text-muted-foreground",
                        i === 2 && "text-present",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar player={m} size={32} ring={isYou ? "lilac" : "none"} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {m.name}
                          {isYou && <span className="ml-1 text-muted-foreground">(you)</span>}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">{m.handle}</p>
                      </div>
                    </div>
                    <span className="text-right font-display text-base">{m.totalPoints}</span>
                    <span className="hidden sm:inline text-right text-sm text-muted-foreground">
                      {m.wordsSolved}
                    </span>
                    <span className="hidden sm:inline text-right text-sm text-muted-foreground">
                      {m.avgAttempts.toFixed(1)}
                    </span>
                  </div>
                );
              })}
          </div>
        </TabsContent>

        {/* TAB 3 — Members */}
        <TabsContent value="members" className="mt-5 space-y-5">
          {/* Invite + code */}
          <div className="surface-elevated p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Room code
                </p>
                <button
                  onClick={copyCode}
                  className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 transition hover:border-primary/40"
                >
                  <span className="font-display text-xl tracking-[0.3em]">{code}</span>
                  <span className="text-muted-foreground">
                    {copied ? <Check className="size-4 text-correct" /> : <Copy className="size-4" />}
                  </span>
                </button>
              </div>
              <Button
                onClick={() => {
                  copyCode();
                  toast.success("Invite link ready", { description: "Share the room code with friends." });
                }}
              >
                <Share2 className="size-4" /> Invite Friends
              </Button>
            </div>
          </div>

          {/* Members list */}
          <div className="surface-elevated divide-y divide-border overflow-hidden">
            {members.map((m) => {
              const isYou = m.id === currentUser.id;
              return (
                <div key={m.id} className="flex items-center gap-3 p-4">
                  <Avatar player={m} size={42} ring={isYou ? "lilac" : "none"} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-sm font-semibold">
                        {m.name}
                        {isYou && <span className="ml-1 text-muted-foreground">(you)</span>}
                      </p>
                      {m.role === "host" ? (
                        <span className="chip">
                          <Crown className="size-3 text-warning" /> Host
                        </span>
                      ) : (
                        <span className="chip chip-muted">Member</span>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {m.handle} · {m.rating} · {m.joinedAt}
                    </p>
                  </div>

                  {/* Host controls */}
                  {isHost && !isYou && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hidden sm:inline-flex"
                        onClick={() =>
                          toast.success(`Host transferred to ${m.name}`, {
                            description: "They now manage the room.",
                          })
                        }
                      >
                        <UserCog className="size-3.5" /> Transfer Host
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" aria-label="Member actions">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="sm:hidden"
                            onClick={() =>
                              toast.success(`Host transferred to ${m.name}`)
                            }
                          >
                            <UserCog className="mr-1 size-3.5" /> Transfer Host
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                              toast.success(`${m.name} removed from room`)
                            }
                          >
                            <UserMinus className="mr-1 size-3.5" /> Remove from Room
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leave Room */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                if (isHost) {
                  setTransferTarget(null);
                  setHostLeaveOpen(true);
                } else {
                  setLeaveOpen(true);
                }
              }}
            >
              <LogOut className="size-4" /> Leave Room
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Settings sheet (host only) */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto p-0 sm:max-w-lg"
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border p-6">
              <SheetTitle className="font-display text-2xl">Room settings</SheetTitle>
              <SheetDescription>
                Tune the room. Changes apply to future words.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 p-6">
              {/* Name */}
              <div>
                <Label htmlFor="settings-name">Room name</Label>
                <Input
                  id="settings-name"
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  maxLength={32}
                  className="mt-1.5"
                />
              </div>

              {/* Theme */}
              <div>
                <Label>Theme</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {SETTINGS_THEMES.map((t) => {
                    const active = t.id === sThemeId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSThemeId(t.id)}
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
                    const active = opt.id === sPrivacy;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSPrivacy(opt.id)}
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
              </div>

              {/* Word time limit */}
              <div>
                <Label>Word time limit</Label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {SETTINGS_TIMES.map((t) => {
                    const active = t.id === sTimeLimit;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSTimeLimit(t.id)}
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
                  Also the minimum wait before launching the next word.
                </p>
              </div>

              {/* Max members */}
              <div>
                <Label>Max members</Label>
                <div className="mt-1.5 grid grid-cols-4 gap-2">
                  {SETTINGS_MAX_MEMBERS.map((opt) => {
                    const active = opt.value === sMaxMembers;
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setSMaxMembers(opt.value)}
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

              {/* Danger zone */}
              <div
                className="rounded-2xl border p-5"
                style={{ borderColor: "color-mix(in oklch, var(--destructive) 35%, transparent)" }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-destructive">
                  Danger zone
                </p>
                <h4 className="mt-1 font-display text-lg">Close this room</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  All members will be removed and the room history will be lost. This cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  className="mt-3"
                  onClick={() => setCloseRoomOpen(true)}
                >
                  <Trash2 className="size-4" /> Close Room
                </Button>
              </div>
            </div>

            <SheetFooter className="border-t border-border p-4 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSettings}>Save changes</Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Close Room confirm */}
      <AlertDialog open={closeRoomOpen} onOpenChange={setCloseRoomOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">
              Close {room.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? All members will be removed and the room history will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleCloseRoom}
            >
              Close Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave confirm — MEMBER */}
      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">
              Leave {room.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will lose your spot in the leaderboard. You can rejoin later with the room code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setLeaveOpen(false);
                toast.success(`You left ${room.name}.`);
                navigate({ to: "/rooms" });
              }}
            >
              Leave Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave flow — HOST: pick a successor, then confirm */}
      <AlertDialog
        open={hostLeaveOpen}
        onOpenChange={(v) => {
          setHostLeaveOpen(v);
          if (!v) setTransferTarget(null);
        }}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">
              {transferTarget
                ? `Transfer host to ${transferTarget.name} and leave?`
                : "You are the host"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {transferTarget
                ? `${transferTarget.name} will manage ${room.name} after you leave. This can't be undone from here.`
                : "Before leaving, choose a new host."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {!transferTarget && (
            <div className="max-h-[320px] overflow-y-auto rounded-xl border border-border divide-y divide-border">
              {members
                .filter((m) => m.id !== currentUser.id)
                .map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3">
                    <Avatar player={m} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{m.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {m.handle} · {m.rating}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setTransferTarget(m)}
                    >
                      <Crown className="size-3.5 text-warning" /> Make host
                    </Button>
                  </div>
                ))}
            </div>
          )}

          <AlertDialogFooter>
            {transferTarget ? (
              <>
                <Button variant="ghost" onClick={() => setTransferTarget(null)}>
                  Back
                </Button>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    const name = transferTarget.name;
                    setHostLeaveOpen(false);
                    setTransferTarget(null);
                    toast.success(`${name} is the new host. You left ${room.name}.`);
                    navigate({ to: "/rooms" });
                  }}
                >
                  Confirm & Leave
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

/* ─────────────────── Sub-views ─────────────────── */

function CountdownBlock({ label = "remaining" }: { label?: string }) {
  return (
    <div className="surface-elevated flex flex-col items-center gap-1 p-5 text-center">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Word ends in
      </span>
      <p className="font-display text-4xl text-primary md:text-5xl">
        <Clock className="mr-2 inline size-7 -translate-y-1" />
        6h 22m
      </p>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function MemberStatusList({ members, revealResults }: { members: RoomMember[]; revealResults?: boolean }) {
  return (
    <div className="surface-elevated divide-y divide-border overflow-hidden">
      <div className="px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Members status
        </p>
      </div>
      {members.map((m) => {
        const isYou = m.id === currentUser.id;
        return (
          <div key={m.id} className="flex items-center gap-3 px-4 py-3">
            <Avatar player={m} size={32} ring={isYou ? "lilac" : "none"} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {m.name}
                {isYou && <span className="ml-1 text-muted-foreground">(you)</span>}
              </p>
              {revealResults && m.status === "finished" && (
                <p className="truncate text-[11px] text-muted-foreground">
                  {m.solved
                    ? `Solved in ${m.attempts} · ${m.timeTaken} · ${m.points} pts`
                    : "Did not solve — 0 pts"}
                </p>
              )}
            </div>
            <StatusPill status={m.status} />
          </div>
        );
      })}
    </div>
  );
}

function StatusPill({ status }: { status: MemberStatus }) {
  if (status === "playing") {
    return (
      <span className="chip" style={{ color: "var(--warning)" }}>
        <span className="size-1.5 rounded-full bg-warning animate-pulse" /> Still playing
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span className="chip" style={{ color: "var(--correct)" }}>
        <Check className="size-3" /> Finished
      </span>
    );
  }
  return (
    <span className="chip chip-muted">
      <span className="size-1.5 rounded-full bg-muted-foreground" /> Not started
    </span>
  );
}

function ActiveNotPlayed({
  roomId,
  members,
  theme,
  correctWord,
}: {
  roomId: string;
  members: RoomMember[];
  theme: string;
  correctWord: string;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">{theme}</span>
        <span className="chip chip-muted">
          <Sparkles className="size-3 text-accent" /> Difficulty · Medium
        </span>
      </div>

      <CountdownBlock />

      <Link
        to="/match"
        search={{ word: correctWord, theme, mode: "themed" as const }}
        className="block"
      >
        <Button size="xl" className="w-full">
          <Sparkles className="size-5" /> Play Now
        </Button>
      </Link>

      <MemberStatusList members={members} />
    </div>
  );
}

function ActivePlayed({ members, you }: { members: RoomMember[]; you: RoomMember }) {
  return (
    <div className="space-y-5">
      <div
        className="surface-elevated p-5"
        style={{ borderColor: "color-mix(in oklch, var(--correct) 40%, transparent)" }}
      >
        <p className="font-display text-2xl">You finished! ✅</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Results stay hidden until the timer runs out.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Attempts" value={String(you.attempts ?? 4)} />
          <Stat label="Time" value={you.timeTaken ?? "2m 18s"} />
          <Stat label="Points" value={String(you.points ?? 96)} accent />
        </div>
      </div>

      <CountdownBlock label="Results revealed when timer ends" />

      <MemberStatusList members={members} />
    </div>
  );
}

function ExpiredWord({
  members,
  correctWord,
}: {
  members: RoomMember[];
  correctWord: string;
}) {
  return (
    <div className="space-y-5">
      <div
        className="surface-elevated p-5"
        style={{ borderColor: "color-mix(in oklch, var(--warning) 40%, transparent)" }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-warning">
          Word expired
        </p>
        <p className="mt-1 font-display text-2xl">
          The word was{" "}
          <span className="rounded-lg bg-correct/15 px-2 py-0.5 font-display text-correct">
            {correctWord}
          </span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Full results below. New word launches soon.
        </p>
      </div>

      <a href="#room-results">
        <Button variant="secondary" className="w-full sm:w-auto">
          See full results
        </Button>
      </a>

      <div id="room-results">
        <MemberStatusList members={members} revealResults />
      </div>
    </div>
  );
}

function WaitingWord({ isHost, canLaunch }: { isHost: boolean; canLaunch: boolean }) {
  return (
    <div className="surface-elevated flex flex-col items-center gap-3 p-10 text-center">
      <Hourglass className="size-10 text-muted-foreground" />
      <h3 className="font-display text-2xl">No active word</h3>
      {isHost ? (
        canLaunch ? (
          <>
            <p className="max-w-sm text-sm text-muted-foreground">
              Ready when you are. Launching a new word kicks off the timer for everyone.
            </p>
            <Button
              size="lg"
              className="mt-2"
              onClick={() => toast.success("New word launched!", { description: "Members are notified." })}
            >
              <Sparkles className="size-4" /> Launch New Word
            </Button>
          </>
        ) : (
          <>
            <p className="max-w-sm text-sm text-muted-foreground">
              Cooldown active to keep things fair.
            </p>
            <Button size="lg" className="mt-2" disabled>
              <Clock className="size-4" /> Next word available in 4h
            </Button>
          </>
        )
      ) : (
        <p className="max-w-sm text-sm text-muted-foreground">
          Waiting for host to launch the next word.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl bg-surface p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 font-display text-2xl", accent && "text-primary")}>{value}</p>
    </div>
  );
}
