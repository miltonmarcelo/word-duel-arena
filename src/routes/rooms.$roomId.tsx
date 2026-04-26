import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Check,
  Crown,
  Settings2,
  BookOpen,
  Send,
  Zap,
  Share2,
  Users,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { rooms, currentUser, players, type Player } from "@/lib/mock-data";

export const Route = createFileRoute("/rooms/$roomId")({
  head: () => ({ meta: [{ title: "Room lobby — WordClash" }] }),
  component: RoomLobby,
});

type Member = Player & {
  status: "ready" | "waiting" | "away";
  host?: boolean;
};

type ChatMsg = {
  id: string;
  author: Player;
  text?: string;
  reaction?: string;
  time: string;
  system?: boolean;
};

const REACTIONS = ["🔥", "👏", "😂", "🤯", "🧠", "💀", "🎯", "✨"];

function RoomLobby() {
  const { roomId } = useParams({ from: "/rooms/$roomId" });
  const room = useMemo(() => rooms.find((r) => r.id === roomId) ?? rooms[0], [roomId]);

  // Derive members for the lobby (visual prototype)
  const members: Member[] = useMemo(() => {
    const baseList: Player[] = [currentUser, ...room.members.filter((m) => m.id !== currentUser.id)];
    const statuses: Member["status"][] = ["ready", "waiting", "away"];
    return baseList.slice(0, 8).map((p, i) => ({
      ...p,
      status: i === 0 ? "ready" : statuses[i % 3],
      host: i === 1, // pick someone other than user as host for variety
    }));
  }, [room]);

  const code = useMemo(() => roomCodeFor(room.id), [room]);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState("General");
  const [openTheme, setOpenTheme] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>(() => seedChat(members));
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const readyCount = members.filter((m) => m.status === "ready").length;
  const totalCount = members.length;
  const allReady = readyCount === totalCount;
  const youReady = members[0].status === "ready";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat]);

  function copyCode() {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function send(text: string) {
    if (!text.trim()) return;
    setChat((c) => [
      ...c,
      { id: Math.random().toString(36).slice(2), author: currentUser, text, time: "now" },
    ]);
    setInput("");
  }

  function react(emoji: string) {
    setChat((c) => [
      ...c,
      { id: Math.random().toString(36).slice(2), author: currentUser, reaction: emoji, time: "now" },
    ]);
  }

  return (
    <AppShell>
      {/* Top bar: back + room title */}
      <div className="mb-5 flex items-center gap-3">
        <Link to="/rooms">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" /> Rooms
          </Button>
        </Link>
        <span
          className={cn(
            "chip",
            room.activity === "live" ? "" : "chip-muted",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              room.activity === "live" ? "bg-primary animate-pulse" : "bg-muted-foreground",
            )}
          />
          {room.activity}
        </span>
      </div>

      {/* Hero card */}
      <div className="surface-elevated relative overflow-hidden p-5 md:p-7">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Room lobby
            </p>
            <h1 className="font-display text-3xl md:text-4xl">
              <span className="mr-2 text-3xl md:text-4xl">{room.emoji}</span>
              {room.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{room.description}</p>
          </div>

          {/* Room code */}
          <div className="flex flex-col gap-2 md:items-end">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Room code
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={copyCode}
                className="group flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2 backdrop-blur transition hover:border-primary/40"
              >
                <span className="font-mono text-xl font-bold tracking-[0.35em]">{code}</span>
                <span className="text-muted-foreground group-hover:text-primary">
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </span>
              </button>
              <Button size="sm" variant="secondary" onClick={copyCode} className="gap-1.5">
                <Share2 className="size-3.5" /> Invite
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr,1fr]">
        {/* LEFT: members + actions */}
        <div className="space-y-5">
          {/* Ready bar */}
          <div className="surface-elevated p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Players ready
                </p>
                <p className="font-display text-2xl">
                  <span className={cn(allReady && "text-[var(--correct)]")}>{readyCount}</span>
                  <span className="text-muted-foreground"> / {totalCount}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Theme</p>
                <p className="font-semibold">{theme}</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(readyCount / totalCount) * 100}%`,
                  background: "var(--gradient-primary)",
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setOpenTheme(true)}
              >
                <Settings2 className="size-3.5" /> Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setOpenRules(true)}
              >
                <BookOpen className="size-3.5" /> Rules
              </Button>
              <Button variant="secondary" size="sm" className="gap-1.5" onClick={copyCode}>
                <Copy className="size-3.5" /> Copy code
              </Button>
              <Link to="/match" className="contents">
                <Button size="sm" className="gap-1.5" disabled={!allReady && !youReady}>
                  <Zap className="size-3.5" /> {allReady ? "Start match" : "Start when ready"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Members list */}
          <div className="surface-elevated p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="chip">
                <Users className="size-3" /> Participants
              </span>
              <span className="text-xs text-muted-foreground">{totalCount} in lobby</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {members.map((m) => (
                <MemberRow key={m.id} member={m} isYou={m.id === currentUser.id} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: chat + reactions */}
        <div className="surface-elevated flex h-[460px] flex-col p-4 lg:h-auto lg:min-h-[460px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="chip chip-lilac">Chat & reactions</span>
            <span className="text-xs text-muted-foreground">{chat.length} messages</span>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto pr-1">
            {chat.map((m) => (
              <ChatBubble key={m.id} msg={m} isYou={m.author.id === currentUser.id} />
            ))}
          </div>

          {/* Quick reactions */}
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
            {REACTIONS.map((e) => (
              <button
                key={e}
                onClick={() => react(e)}
                className="grid size-9 place-items-center rounded-lg border border-border bg-background/40 text-base transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/50"
                aria-label={`React ${e}`}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mt-3 flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Say something nice (or trash talk)…"
              className="h-10"
            />
            <Button type="submit" size="icon" aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Theme dialog */}
      <Dialog open={openTheme} onOpenChange={setOpenTheme}>
        <DialogContent className="surface-elevated border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Choose a theme</DialogTitle>
            <DialogDescription>
              Pick a category for this room's match. The host can change it any time.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["General", "Nature", "Tech", "Food", "Sports", "Movies"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  setOpenTheme(false);
                }}
                className={cn(
                  "rounded-xl border p-3 text-left transition",
                  theme === t
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40 hover:bg-muted/40",
                )}
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-[11px] text-muted-foreground">5-letter words</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rules dialog */}
      <Dialog open={openRules} onOpenChange={setOpenRules}>
        <DialogContent className="surface-elevated border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Room rules</DialogTitle>
            <DialogDescription>How matches work in this room.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm">
            {[
              "Each round: 6 guesses, 60 seconds per guess.",
              "Theme is chosen by the host before each match.",
              "Score = correctness + speed bonus + streak multiplier.",
              "Top scorer after 3 rounds wins the room badge.",
              "Be kind in chat. Trash talk is fine, slurs are not.",
            ].map((line) => (
              <li key={line} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--correct)]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button onClick={() => setOpenRules(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function MemberRow({ member, isYou }: { member: Member; isYou: boolean }) {
  const statusColor =
    member.status === "ready"
      ? "var(--correct)"
      : member.status === "waiting"
        ? "var(--warning)"
        : "var(--muted-foreground)";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-2.5">
      <div className="relative">
        <Avatar player={member} size={40} ring={isYou ? "lilac" : "none"} />
        <span
          className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background"
          style={{ background: statusColor }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold">
            {member.name}
            {isYou && <span className="ml-1 text-muted-foreground">(you)</span>}
          </p>
          {member.host && (
            <Crown className="size-3.5 text-[var(--warning)]" aria-label="Host" />
          )}
        </div>
        <p className="truncate text-[11px] text-muted-foreground">
          {member.handle} · {member.rating}
        </p>
      </div>
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
        style={{
          background: `color-mix(in oklch, ${statusColor} 18%, transparent)`,
          color: statusColor,
        }}
      >
        {member.status}
      </span>
    </div>
  );
}

function ChatBubble({ msg, isYou }: { msg: ChatMsg; isYou: boolean }) {
  if (msg.system) {
    return (
      <div className="text-center text-[11px] text-muted-foreground">{msg.text}</div>
    );
  }
  if (msg.reaction) {
    return (
      <div className={cn("flex items-center gap-2", isYou && "justify-end")}>
        {!isYou && <Avatar player={msg.author} size={20} />}
        <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-base">
          {msg.reaction}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {isYou ? "You" : msg.author.name.split(" ")[0]}
        </span>
      </div>
    );
  }
  return (
    <div className={cn("flex items-start gap-2", isYou && "flex-row-reverse")}>
      <Avatar player={msg.author} size={24} />
      <div className={cn("max-w-[80%]", isYou && "items-end text-right")}>
        <p className="text-[11px] text-muted-foreground">
          {isYou ? "You" : msg.author.name.split(" ")[0]} · {msg.time}
        </p>
        <div
          className={cn(
            "mt-0.5 inline-block rounded-2xl px-3 py-1.5 text-sm",
            isYou
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm",
          )}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}

function roomCodeFor(id: string) {
  // Deterministic 6-char code from room id for stable display
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  let n = seed * 9301 + 49297;
  for (let i = 0; i < 6; i++) {
    n = (n * 9301 + 49297) % 233280;
    out += alpha[n % alpha.length];
  }
  return out;
}

function seedChat(members: Member[]): ChatMsg[] {
  const m = members;
  return [
    { id: "s1", author: m[0], system: true, text: "Lobby opened · invite friends with the room code.", time: "" },
    { id: "1", author: m[1] ?? m[0], text: "Ready when you are 🔥", time: "2m" },
    { id: "2", author: m[2] ?? m[0], reaction: "👏", time: "2m" },
    { id: "3", author: m[3] ?? m[0], text: "Last round was brutal lol", time: "1m" },
    { id: "4", author: m[1] ?? m[0], text: "Let's go theme = nature this time", time: "1m" },
    { id: "5", author: m[0], text: "Bring it on.", time: "now" },
  ];
}
