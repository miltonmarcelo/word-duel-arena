import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Globe2, KeyRound, Lock, Plus } from "lucide-react";
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
import { currentUser, rooms as initialRooms, type Room } from "@/lib/mock-data";

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
] as const;

const MAX_PLAYERS = [2, 4, 6, 8] as const;

type NewRoom = Room & { isNew?: true };

function RoomsPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [themeId, setThemeId] = useState<(typeof THEMES)[number]["id"]>("general");
  const [maxPlayers, setMaxPlayers] = useState<(typeof MAX_PLAYERS)[number]>(4);
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [rooms, setRooms] = useState<NewRoom[]>(initialRooms);

  function resetForm() {
    setName("");
    setThemeId("general");
    setMaxPlayers(4);
    setPrivacy("public");
  }

  function handleCreate() {
    const theme = THEMES.find((t) => t.id === themeId)!;
    const finalName = name.trim() || `${theme.label} Room`;
    const newRoom: NewRoom = {
      id: `r-new-${Date.now()}`,
      name: finalName,
      emoji: theme.emoji,
      activity: "live",
      description: `${privacy === "public" ? "Public" : "Private"} · ${theme.label} · up to ${maxPlayers} players`,
      members: [currentUser],
      isNew: true,
    };
    setRooms((prev) => [newRoom, ...prev]);
    setOpen(false);
    resetForm();
    toast.success("Room created!", {
      description: `${finalName} is ready — invite your friends.`,
    });
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Private leagues
            </p>
            <h1 className="font-display text-4xl sm:text-5xl">Your rooms.</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <Link to="/rooms/$roomId" params={{ roomId: initialRooms[0].id }}>
                <KeyRound className="size-4" /> Join by code
              </Link>
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" /> Create Room
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rooms.map((r) => (
            <div
              key={r.id}
              className="surface-elevated p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{r.emoji}</span>
                <div className="flex items-center gap-2">
                  {r.isNew && <span className="chip">✨ New</span>}
                  <span className={`chip ${r.activity === "live" ? "" : "chip-muted"}`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        r.activity === "live"
                          ? "bg-primary animate-pulse"
                          : "bg-muted-foreground"
                      }`}
                    />
                    {r.activity}
                  </span>
                </div>
              </div>
              <h3 className="font-display text-2xl">{r.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {r.members.slice(0, 5).map((m) => (
                    <Avatar key={m.id} player={m} size={32} />
                  ))}
                  <span className="ml-3 self-center text-xs text-muted-foreground">
                    {r.members.length} members
                  </span>
                </div>
                <Link to="/rooms/$roomId" params={{ roomId: initialRooms[0].id }}>
                  <Button size="sm" variant="ghost">
                    Open
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Create a room</DialogTitle>
            <DialogDescription>
              Set up a private league for friends, family or your team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Name */}
            <div>
              <Label htmlFor="room-name">Room name</Label>
              <Input
                id="room-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wordsmiths"
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

            {/* Max players */}
            <div>
              <Label>Max players</Label>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {MAX_PLAYERS.map((n) => {
                  const active = n === maxPlayers;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setMaxPlayers(n)}
                      className={cn(
                        "rounded-xl border-2 py-2 text-sm font-display transition",
                        active
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      {n}
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
    </AppShell>
  );
}
