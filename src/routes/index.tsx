import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Flame,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { WordRow } from "@/components/WordBoard";
import { Button } from "@/components/ui/button";
import { players } from "@/lib/mock-data";
import type { Guess } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WordClash — Words, but as a sport" },
      {
        name: "description",
        content:
          "Play the daily word, challenge friends, or draw a random opponent. Five letters. Six attempts. One winner. Join 240k+ daily players on WordClash.",
      },
      { property: "og:title", content: "WordClash — Words, but as a sport" },
      {
        property: "og:description",
        content:
          "Live word duels, daily puzzles and a global leaderboard. Sign up free and play your first match in under a minute.",
      },
    ],
  }),
  component: Landing,
});

/* ------------------------------------------------------------------ data */

const heroRows: (Guess | null)[] = [
  { letters: ["C", "R", "A", "N", "E"], states: ["absent", "present", "absent", "present", "absent"] },
  { letters: ["L", "I", "G", "H", "T"], states: ["absent", "absent", "correct", "absent", "absent"] },
  { letters: ["S", "H", "I", "N", "Y"], states: ["correct", "absent", "correct", "present", "correct"] },
  null,
  null,
  null,
];

const dailyMini: Guess[] = [
  { letters: ["C", "R", "A", "N", "E"], states: ["absent", "present", "absent", "present", "absent"] },
  { letters: ["T", "R", "A", "C", "E"], states: ["absent", "correct", "correct", "absent", "correct"] },
  { letters: ["C", "R", "A", "S", "H"], states: ["correct", "correct", "correct", "present", "absent"] },
];

const playsRow: Guess = {
  letters: ["P", "L", "A", "Y", "S"],
  states: ["correct", "correct", "correct", "correct", "correct"],
};

const activity = [
  { icon: "🟢", text: "Alex beat Carlos in 4 guesses · 2 min ago" },
  { icon: "🏆", text: "Emma climbed to #34 global · just now" },
  { icon: "⚔️", text: "30 live duels in progress" },
  { icon: "🔥", text: "Lena is on a 14-day streak" },
  { icon: "🟢", text: "Tom beat Mia · 5 guesses · 1 min ago" },
  { icon: "⚡", text: "Daily word: 3,812 plays today" },
];

const modeSteps = [
  {
    n: "1",
    title: "Sign up free",
    body: "Google or email. Your profile and stats are created instantly.",
  },
  {
    n: "2",
    title: "Find an opponent",
    body: "Draw from the live pool or challenge a friend directly from your contacts.",
  },
  {
    n: "3",
    title: "Guess and win",
    body: "6 attempts. Mint = correct. Lilac = wrong position. Grey = not in word. Fastest correct guess wins.",
  },
];

const leaderboard = [
  { rank: "🥇", name: "JadeW", pts: "4,820", player: players[0], you: false },
  { rank: "🥈", name: "MarcoP", pts: "4,611", player: players[1], you: false },
  { rank: "🥉", name: "SophieR", pts: "4,390", player: players[2], you: false },
  { rank: "4", name: "tomk", pts: "3,955", player: players[3], you: false },
  { rank: "5", name: "You", pts: "3,720", player: players[7], you: true },
];

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

/* -------------------------------------------------------------- component */

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* SECTION 1 — Sticky nav */}
      <header
        className="glass-strong fixed inset-x-0 top-0 z-50 h-14"
        style={{ borderBottom: "1px solid color-mix(in oklch, var(--foreground) 10%, transparent)" }}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="hidden font-display text-lg text-muted-foreground sm:inline">· Tazlo</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            <a href="#how" className="hover:text-foreground" style={{ transition: "color var(--transition-interactive)" }}>How it works</a>
            <a href="#modes" className="hover:text-foreground" style={{ transition: "color var(--transition-interactive)" }}>Game modes</a>
            <a href="#rankings" className="hover:text-foreground" style={{ transition: "color var(--transition-interactive)" }}>Rankings</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Play free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 2 — Hero */}
      <section
        className="relative flex min-h-screen items-center px-6 pt-14"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 py-16 lg:grid-cols-[1.5fr_1fr]">
          {/* Left — copy */}
          <div>
            <span className="glass-tint-mint inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="size-3" /> Multiplayer · Live duels · Global ranking
            </span>
            <h1 className="mt-6 font-display text-6xl leading-[1.05] tracking-tight md:text-7xl">
              Words.
              <br />
              But as a sport.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Play the daily word, challenge friends, or draw a random opponent.
              Five letters. Six attempts. One winner.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="xl" style={{ boxShadow: "var(--shadow-glow-mint)" }}>
                  Play free <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-2.5">
              <span className="glass-flat inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Zap className="size-3.5 text-primary" /> 240k+ daily players
              </span>
              <span className="glass-flat inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Trophy className="size-3.5 text-primary" /> Global leaderboard
              </span>
              <span className="glass-flat inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Flame className="size-3.5 text-accent" /> Daily word streak
              </span>
            </div>
          </div>

          {/* Right — live duel card */}
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-8"
              style={{
                zIndex: -1,
                background:
                  "radial-gradient(40% 50% at 20% 40%, color-mix(in oklch, var(--primary) 60%, transparent), transparent 70%), radial-gradient(40% 50% at 80% 60%, color-mix(in oklch, var(--accent) 60%, transparent), transparent 70%)",
                opacity: 0.15,
              }}
            />
            <div
              className="glass-strong animate-card-rise mx-auto w-fit rounded-3xl p-6"
              style={{ boxShadow: "var(--shadow-glow-mint)" }}
            >
              {/* VS bar */}
              <div className="mb-5 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar player={players[7]} size={36} ring="mint" />
                  <div className="leading-tight">
                    <p className="flex items-center gap-1 text-xs font-semibold">
                      <span className="player-dot player-a" /> You
                    </p>
                  </div>
                </div>
                <span className="font-display text-sm text-muted-foreground">VS</span>
                <div className="flex items-center gap-2">
                  <div className="text-right leading-tight">
                    <p className="flex items-center justify-end gap-1 text-xs font-semibold">
                      Mira K. <span className="player-dot player-b" />
                    </p>
                  </div>
                  <Avatar player={players[0]} size={36} ring="lilac" />
                </div>
              </div>

              {/* Word board */}
              <div className="flex flex-col gap-1.5">
                {heroRows.map((g, i) =>
                  g ? <WordRow key={i} guess={g} size="sm" /> : <WordRow key={i} size="sm" empty />,
                )}
              </div>

              {/* Bottom bar */}
              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="shimmer-text font-semibold">Mira K. is guessing…</span>
                <span className="font-mono text-muted-foreground">6 attempts left</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Live activity strip */}
      <div
        className="flex h-14 items-center overflow-hidden"
        style={{ background: "var(--surface-soft)", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <div className="animate-marquee flex shrink-0 items-center gap-3 px-1.5">
          {[...activity, ...activity].map((a, i) => (
            <span
              key={i}
              className="glass-flat flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <span>{a.icon}</span> {a.text}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 4 — Game modes */}
      <section id="modes" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-4xl">Three ways to play</h2>
        <p className="mt-2 text-muted-foreground">Pick your battlefield.</p>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Daily Word */}
          <article className="glass-tint-mint flex flex-col p-7" style={{ borderRadius: "1.25rem" }}>
            <h3 className="font-display text-2xl">Daily Word</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              One word. The whole world. Play and compare your result with everyone on the leaderboard.
            </p>
            <div className="my-6 flex flex-col gap-1">
              {dailyMini.map((g, i) => (
                <WordRow key={i} guess={g} size="sm" />
              ))}
            </div>
            <span className="chip mt-auto w-fit">Solo · Free · Daily reset</span>
            <Link to="/signup" className="mt-4">
              <Button className="w-full">
                Play today's word <ArrowRight className="size-4" />
              </Button>
            </Link>
          </article>

          {/* Random Match */}
          <article className="glass flex flex-col p-7" style={{ borderRadius: "1.25rem" }}>
            <div className="mb-3 inline-flex w-fit items-center gap-2 text-primary">
              <Swords className="size-5" />
            </div>
            <h3 className="font-display text-[22px]">Random Match</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Draw an opponent from the live pool. Guess faster and score higher to win.
            </p>
            <div className="my-6 flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--surface-soft)" }}>
              <div className="flex -space-x-2">
                <span className="player-dot player-a animate-opponent-pulse !block !h-3 !w-3" />
                <span className="player-dot player-b animate-opponent-pulse !block !h-3 !w-3" style={{ animationDelay: "0.6s" }} />
              </div>
              <span className="text-xs font-semibold text-primary">Finding opponent…</span>
            </div>
            <span className="chip-muted chip mt-auto w-fit">Live · 1v1 · Ranked</span>
          </article>

          {/* Friend Challenge */}
          <article className="glass-tint-lilac flex flex-col p-7" style={{ borderRadius: "1.25rem" }}>
            <div className="mb-3 inline-flex w-fit items-center gap-2 text-accent">
              <Users className="size-5" />
            </div>
            <h3 className="font-display text-[22px]">Challenge a Friend</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a friend from your list, send a challenge, and settle the score.
            </p>
            <div className="my-6 flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--surface-soft)" }}>
              <Avatar player={players[0]} size={32} />
              <span className="text-sm font-semibold">Mira K.</span>
              <Button size="sm" variant="outline" className="ml-auto !border-accent/50 !text-accent hover:!bg-accent/10">
                Challenge <ArrowRight className="size-3.5" />
              </Button>
            </div>
            <span className="chip-lilac chip mt-auto w-fit">Social · 1v1 · Fun</span>
          </article>
        </div>
      </section>

      {/* SECTION 5 — How it works */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl">Win in three moves</h2>
        <p className="mt-2 text-muted-foreground">
          Sign up, find an opponent, guess the word. That's it.
        </p>

        <div className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div
            className="absolute left-[16.66%] right-[16.66%] top-8 hidden border-t-2 border-dashed md:block"
            style={{ borderColor: "color-mix(in oklch, var(--foreground) 18%, transparent)" }}
            aria-hidden="true"
          />
          {modeSteps.map((s) => (
            <div key={s.n} className="relative flex flex-col items-center">
              <div className="glass-tint-mint flex h-16 w-16 items-center justify-center rounded-full">
                <span className="font-mono text-[40px] font-bold leading-none text-primary">{s.n}</span>
              </div>
              <h3 className="mt-5 font-display text-xl">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <div className="flex gap-1.5">
            {playsRow.letters.map((letter, i) => (
              <div
                key={i}
                className="tile tile-correct !h-12 !w-12 !text-xl"
                style={{ animation: `tile-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms both` }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Leaderboard + streak */}
      <section id="rankings" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Leaderboard */}
          <div className="glass p-7" style={{ borderRadius: "1.25rem" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Global ranking</h3>
              <span className="chip-muted chip">This week</span>
            </div>
            <ul className="mt-6 space-y-2">
              {leaderboard.map((row) => (
                <li
                  key={row.name}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={
                    row.you
                      ? { background: "color-mix(in oklch, var(--primary) 12%, transparent)" }
                      : undefined
                  }
                >
                  <span className="w-6 text-center font-mono text-sm font-bold text-muted-foreground">{row.rank}</span>
                  <Avatar player={row.player} size={32} />
                  <span className="text-sm font-semibold">{row.name}</span>
                  {row.you && <span className="chip ml-1 !py-0.5 !text-[10px]">← you</span>}
                  <span className="ml-auto font-mono text-sm font-bold text-primary">{row.pts} pts</span>
                </li>
              ))}
            </ul>
            <Link to="/ranking" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              See full leaderboard <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Streak */}
          <div className="glass flex flex-col p-7" style={{ borderRadius: "1.25rem" }}>
            <h3 className="font-display text-xl">Your streak</h3>
            <div className="mt-6 flex flex-col items-center">
              <p className="flex items-center gap-3 font-display text-6xl text-primary">
                12 <span className="text-4xl">🔥</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">days in a row</p>
            </div>

            <div className="mt-7 flex justify-center gap-2">
              {weekDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold"
                    style={
                      i < 5
                        ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                        : { border: "1px solid var(--border)", color: "var(--muted-foreground)" }
                    }
                  >
                    {d}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Play today to keep your streak alive.
            </p>

            <div className="mt-auto pt-7">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold">Level 7</span>
                <span className="font-mono text-muted-foreground">3,720 / 5,000 XP</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-soft)" }}>
                <div className="h-full rounded-full" style={{ width: "74%", background: "var(--gradient-mint)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Final CTA + footer */}
      <section
        className="px-6 text-center"
        style={{ background: "var(--gradient-hero)", paddingBlock: "6rem" }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Free to play. Always.</p>
          <h2 className="mt-4 font-display text-5xl leading-tight md:text-[56px]">
            Your next opponent is waiting.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Sign up in 10 seconds. No download. No install. Play on any browser.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup">
              <Button size="xl" style={{ boxShadow: "var(--shadow-glow-mint)" }}>
                Start playing free <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="xl" variant="ghost">Sign in</Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="flex -space-x-3">
              {players.slice(0, 3).map((p) => (
                <Avatar key={p.id} player={p} size={36} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Join 240,000+ players</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid color-mix(in oklch, var(--foreground) 10%, transparent)" }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-3">
            <Logo />
            <span>© 2025 WordClash</span>
          </div>
          <nav className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground" style={{ transition: "color var(--transition-interactive)" }}>Privacy</a>
            <a href="#" className="hover:text-foreground" style={{ transition: "color var(--transition-interactive)" }}>Terms</a>
            <a href="#" className="hover:text-foreground" style={{ transition: "color var(--transition-interactive)" }}>Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
