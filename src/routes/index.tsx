import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Trophy, Zap } from "lucide-react";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { WordRow } from "@/components/WordBoard";
import { players } from "@/lib/mock-data";
import type { Guess } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tazlo — Words, but as a sport" },
      {
        name: "description",
        content:
          "Play the daily word, challenge friends, or draw a random opponent. Five letters. Six attempts. One winner. Join 240k+ daily players on Tazlo.",
      },
      { property: "og:title", content: "Tazlo — Words, but as a sport" },
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

const modeSteps = [
  {
    n: "01",
    title: "Pick a mode",
    body: "Daily word, a random live opponent, or a private challenge with a friend.",
  },
  {
    n: "02",
    title: "Guess the word",
    body: "Five letters, six attempts. Greens, ambers and greys guide every move.",
  },
  {
    n: "03",
    title: "Win the duel",
    body: "Solve it faster than your rival to take the points and climb the ranking.",
  },
];

const activity = [
  { icon: "🟢", text: "Alex beat Carlos in 4 guesses · 2 min ago" },
  { icon: "🏆", text: "Emma climbed to #34 global · just now" },
  { icon: "⚔️", text: "30 live duels in progress" },
  { icon: "🔥", text: "Lena is on a 14-day streak" },
  { icon: "🟢", text: "Tom beat Mia · 5 guesses · 1 min ago" },
  { icon: "⚡", text: "Daily word: 3,812 plays today" },
];

const leaderboard = [
  { rank: "🥇", name: "JadeW", pts: "4,820", player: players[0], you: false },
  { rank: "🥈", name: "MarcoP", pts: "4,611", player: players[1], you: false },
  { rank: "🥉", name: "SophieR", pts: "4,390", player: players[2], you: false },
  { rank: "4", name: "tomk", pts: "3,955", player: players[3], you: false },
  { rank: "5", name: "You", pts: "3,720", player: players[7], you: true },
];

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

/* --------------------------------------------------------------- helpers */

const SECTION_PAD = "clamp(4rem, 8vw, 6rem)";

const eyebrowStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.375rem 0.875rem",
  borderRadius: 9999,
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  background: "color-mix(in oklch, var(--primary) 14%, transparent)",
  border: "1px solid color-mix(in oklch, var(--primary) 32%, transparent)",
  color: "var(--primary)",
};

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.375rem 0.75rem",
  borderRadius: 9999,
  background: "color-mix(in oklch, var(--surface-elevated) 70%, transparent)",
  border: "1px solid color-mix(in oklch, var(--foreground) 12%, transparent)",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--muted-foreground)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  whiteSpace: "nowrap",
};

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  border: "none",
  borderRadius: 9999,
  padding: "0.875rem 2rem",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "var(--shadow-glow-mint)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const ghostBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "transparent",
  color: "var(--foreground)",
  border: "1px solid color-mix(in oklch, var(--foreground) 22%, transparent)",
  borderRadius: 9999,
  padding: "0.875rem 1.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
};

const pulseDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  background: "var(--primary)",
};

/* -------------------------------------------------------------- component */

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* SECTION 1 — Fixed nav */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 56,
          background:
            "linear-gradient(180deg, color-mix(in oklch, var(--surface-elevated) 78%, transparent), color-mix(in oklch, var(--surface-elevated) 62%, transparent))",
          backdropFilter: "blur(18px) saturate(1.25)",
          WebkitBackdropFilter: "blur(18px) saturate(1.25)",
          borderBottom: "1px solid color-mix(in oklch, var(--foreground) 10%, transparent)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div className="flex items-center gap-2">
            <Logo />
            <span className="hidden font-display text-lg text-muted-foreground sm:inline">· Tazlo</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            <a href="#modes" className="hover:text-foreground" style={{ transition: "color var(--transition-interactive)" }}>
              Game modes
            </a>
            <a href="#how" className="hover:text-foreground" style={{ transition: "color var(--transition-interactive)" }}>
              How it works
            </a>
            <a href="#rankings" className="hover:text-foreground" style={{ transition: "color var(--transition-interactive)" }}>
              Rankings
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
              style={{ transition: "color var(--transition-interactive)" }}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                borderRadius: 9999,
                fontSize: "0.875rem",
                fontWeight: 700,
                padding: "0.5rem 1.25rem",
                boxShadow: "var(--shadow-glow-mint)",
              }}
            >
              Play free
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 2 — Hero */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "100vh", paddingTop: 56 }}>
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, background: "var(--gradient-hero)", pointerEvents: "none", zIndex: -1 }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            gap: "4rem",
            maxWidth: 1200,
            margin: "0 auto",
            paddingInline: "2rem",
            minHeight: "calc(100vh - 56px)",
          }}
          className="hero-grid"
        >
          {/* Left — copy */}
          <div>
            <span style={eyebrowStyle}>
              <span style={pulseDot} className="animate-pulse-dot" />
              Multiplayer · Live duels
            </span>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(3rem, 5.5vw, 5rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                color: "var(--foreground)",
                margin: "1.5rem 0 1.25rem",
              }}
            >
              Words.
              <br />
              But as a sport.
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                color: "var(--muted-foreground)",
                maxWidth: 440,
                marginBottom: "2rem",
              }}
            >
              Play the daily word, challenge friends, or draw a random opponent. Five letters. Six attempts. One winner.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link to="/signup" className="hover-lift" style={primaryBtn}>
                Play free <ArrowRight className="size-4" />
              </Link>
              <a href="#how" style={ghostBtn}>
                Watch how it works
              </a>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
              <span style={pillStyle}>
                <Zap className="size-3.5 text-primary" /> 240k+ daily players
              </span>
              <span style={pillStyle}>
                <Trophy className="size-3.5 text-primary" /> Global leaderboard
              </span>
              <span style={pillStyle}>
                <Flame className="size-3.5 text-accent" /> Daily word streak
              </span>
            </div>
          </div>

          {/* Right — game card */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: -60,
                background:
                  "radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 18%, transparent) 0%, transparent 65%)",
                pointerEvents: "none",
                zIndex: 0,
                filter: "blur(40px)",
              }}
            />
            <div
              className="animate-card-rise"
              style={{
                position: "relative",
                zIndex: 1,
                borderRadius: "1.5rem",
                overflow: "hidden",
                background:
                  "linear-gradient(160deg, color-mix(in oklch, var(--surface-elevated) 78%, transparent), color-mix(in oklch, var(--surface) 62%, transparent))",
                backdropFilter: "blur(18px) saturate(1.25)",
                WebkitBackdropFilter: "blur(18px) saturate(1.25)",
                border: "1px solid color-mix(in oklch, var(--foreground) 16%, transparent)",
                boxShadow: "var(--shadow-glow-mint)",
                padding: "1.5rem",
                width: "100%",
                maxWidth: 420,
              }}
            >
              {/* Top bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <div className="flex items-center gap-2">
                  <Avatar player={players[7]} size={32} ring="mint" />
                  <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", fontWeight: 600 }}>You</span>
                </div>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 800,
                    color: "var(--primary)",
                    border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
                    borderRadius: 9999,
                    padding: "0.25rem 0.5rem",
                  }}
                >
                  VS
                </span>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", fontWeight: 600 }}>Mira K.</span>
                  <Avatar player={players[0]} size={32} ring="lilac" />
                </div>
              </div>

              {/* Board */}
              <div className="flex flex-col gap-1.5" style={{ margin: "0 auto", width: "fit-content" }}>
                {heroRows.map((g, i) =>
                  g ? <WordRow key={i} guess={g} size="sm" /> : <WordRow key={i} size="sm" empty />,
                )}
              </div>

              {/* Bottom bar */}
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
                  <span style={pulseDot} className="animate-pulse-dot" />
                  Mira K. is guessing…
                </span>
                <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                  6 attempts left
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Activity marquee */}
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          overflow: "hidden",
          background: "var(--surface-soft)",
          borderTop: "1px solid color-mix(in oklch, var(--foreground) 8%, transparent)",
          borderBottom: "1px solid color-mix(in oklch, var(--foreground) 8%, transparent)",
          padding: "0.75rem 0",
          pointerEvents: "none",
        }}
      >
        <div className="animate-marquee" style={{ display: "flex", gap: "1rem", width: "max-content" }}>
          {[...activity, ...activity].map((a, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                whiteSpace: "nowrap",
                padding: "0.375rem 0.875rem",
                borderRadius: 9999,
                background: "color-mix(in oklch, var(--surface-elevated) 70%, transparent)",
                border: "1px solid color-mix(in oklch, var(--foreground) 10%, transparent)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--muted-foreground)",
              }}
            >
              <span>{a.icon}</span> {a.text}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 4 — Game modes (asymmetric bento) */}
      <section id="modes" style={{ maxWidth: 1200, margin: "0 auto", paddingBlock: SECTION_PAD, paddingInline: "2rem" }}>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", lineHeight: 1.1, marginBottom: "0.5rem", textAlign: "left" }}
        >
          Three ways to play
        </h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "1.125rem", marginBottom: "2.5rem", textAlign: "left" }}>
          Pick your battlefield.
        </p>

        <div
          className="modes-grid"
          style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr 1fr", gridTemplateRows: "auto", gap: "1rem" }}
        >
          {/* Card 1 — Daily Word (wide featured) */}
          <article
            style={{
              gridColumn: 1,
              gridRow: 1,
              minHeight: 380,
              background:
                "linear-gradient(160deg, color-mix(in oklch, var(--primary) 10%, var(--surface)), var(--surface))",
              border: "1px solid color-mix(in oklch, var(--primary) 25%, var(--border))",
              borderRadius: "1.25rem",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span className="chip">Solo · Daily · Free</span>
              <h3 className="font-display" style={{ fontSize: "1.5rem", marginTop: "0.875rem" }}>
                Daily Word
              </h3>
              <p style={{ marginTop: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.9375rem", maxWidth: "28ch" }}>
                One word. The whole world. Play and compare your result with everyone on the leaderboard.
              </p>
            </div>
            <div className="flex flex-col gap-1" style={{ margin: "1.25rem auto", width: "fit-content" }}>
              {dailyMini.map((g, i) => (
                <WordRow key={i} guess={g} size="sm" />
              ))}
            </div>
            <Link
              to="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                borderRadius: 9999,
                fontSize: "0.875rem",
                fontWeight: 700,
                padding: "0.625rem 1.25rem",
                width: "fit-content",
              }}
            >
              Play today's word <ArrowRight className="size-4" />
            </Link>
          </article>

          {/* Card 2 — Random Match */}
          <article
            style={{
              gridColumn: 2,
              minHeight: 180,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "1.25rem",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 className="font-display" style={{ fontSize: "1.25rem" }}>
              Random Match
            </h3>
            <p style={{ marginTop: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
              Draw an opponent from the live pool. Guess faster to win.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", margin: "1.25rem 0" }}>
              <span style={{ ...pulseDot, width: 12, height: 12 }} className="animate-pulse-dot" />
              <span
                style={{
                  width: 40,
                  height: 2,
                  background: "linear-gradient(90deg, var(--primary), var(--accent))",
                  borderRadius: 9999,
                }}
                className="animate-pulse-dot"
              />
              <span style={{ ...pulseDot, width: 12, height: 12, background: "var(--accent)" }} className="animate-pulse-dot" />
            </div>
            <span className="chip-muted chip" style={{ marginTop: "auto", width: "fit-content" }}>
              Live · Ranked
            </span>
          </article>

          {/* Card 3 — Friend Challenge */}
          <article
            style={{
              gridColumn: 3,
              minHeight: 180,
              background:
                "linear-gradient(160deg, color-mix(in oklch, var(--accent) 8%, var(--surface)), var(--surface))",
              border: "1px solid color-mix(in oklch, var(--accent) 22%, var(--border))",
              borderRadius: "1.25rem",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 className="font-display" style={{ fontSize: "1.25rem" }}>
              Friend Challenge
            </h3>
            <p style={{ marginTop: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
              Pick a friend, send a challenge, and settle the score.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1.25rem 0" }}>
              <Avatar player={players[0]} size={28} />
              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Mira K.</span>
            </div>
            <span className="chip-lilac chip" style={{ marginTop: "auto", width: "fit-content" }}>
              Social · 1v1
            </span>
          </article>
        </div>
      </section>

      {/* SECTION 5 — How it works */}
      <section id="how" style={{ maxWidth: 1200, margin: "0 auto", paddingBlock: "clamp(3rem, 6vw, 4.5rem)", paddingInline: "2rem" }}>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", lineHeight: 1.1, marginBottom: "2.5rem", textAlign: "center" }}
        >
          Win in three moves
        </h2>

        <div className="steps-row" style={{ display: "flex", gap: 0, position: "relative" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "25%",
              right: "25%",
              borderTop: "1.5px dashed color-mix(in oklch, var(--foreground) 16%, transparent)",
            }}
          />
          {modeSteps.map((step) => (
            <div key={step.n} style={{ flex: 1, position: "relative", textAlign: "center", padding: "0 1rem" }}>
              <span
                className="font-mono"
                style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1, display: "block", marginBottom: "0.75rem" }}
              >
                {step.n}
              </span>
              <h3 className="font-display" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                {step.title}
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.9375rem", maxWidth: "26ch", margin: "0 auto" }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center" style={{ marginTop: "2.5rem" }}>
          <WordRow guess={playsRow} size="sm" />
        </div>
      </section>

      {/* SECTION 6 — Leaderboard + Streak */}
      <section
        id="rankings"
        className="rankings-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          paddingBlock: SECTION_PAD,
          paddingInline: "2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Leaderboard */}
        <div
          style={{
            borderRadius: "1.25rem",
            border: "1px solid var(--border)",
            background: "linear-gradient(180deg, var(--surface), var(--surface-soft))",
            boxShadow: "var(--shadow-md)",
            padding: "1.75rem",
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display" style={{ fontSize: "1.25rem" }}>
              Global ranking
            </h3>
            <span className="chip-muted chip">This week</span>
          </div>
          <ul style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {leaderboard.map((row) => (
              <li
                key={row.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  borderRadius: "0.875rem",
                  ...(row.you
                    ? {
                        background: "color-mix(in oklch, var(--primary) 10%, transparent)",
                        border: "1px solid color-mix(in oklch, var(--primary) 24%, transparent)",
                      }
                    : {}),
                }}
              >
                <span className="font-mono" style={{ width: "1.5rem", textAlign: "center", fontWeight: 700, color: "var(--muted-foreground)" }}>
                  {row.rank}
                </span>
                <Avatar player={row.player} size={32} />
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{row.name}</span>
                <span
                  className="font-mono"
                  style={{ marginLeft: "auto", fontWeight: 700, color: "var(--primary)", fontSize: "0.875rem" }}
                >
                  {row.pts} pts
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/ranking"
            className="hover:underline"
            style={{ marginTop: "1.25rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)" }}
          >
            See full leaderboard <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Streak */}
        <div
          style={{
            borderRadius: "1.25rem",
            border: "1px solid var(--border)",
            background: "linear-gradient(180deg, var(--surface), var(--surface-soft))",
            boxShadow: "var(--shadow-md)",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 className="font-display" style={{ fontSize: "1.25rem" }}>
            Your streak
          </h3>
          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            <span className="font-display" style={{ fontSize: "5rem", lineHeight: 1, color: "var(--primary)", display: "inline-block" }}>
              12
            </span>
            <span style={{ fontSize: "2.5rem" }}>🔥</span>
          </div>
          <p style={{ marginTop: "0.5rem", textAlign: "center", color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
            days in a row
          </p>

          <div style={{ marginTop: "1.75rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            {weekDays.map((d, i) => (
              <span
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  ...(i < 5
                    ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                    : { background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }),
                }}
              >
                {d}
              </span>
            ))}
          </div>

          <div style={{ marginTop: "auto", paddingTop: "1.75rem" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "0.5rem", fontSize: "0.75rem" }}>
              <span style={{ fontWeight: 600 }}>Level 7</span>
              <span className="font-mono" style={{ color: "var(--muted-foreground)" }}>
                3,720 / 5,000 XP
              </span>
            </div>
            <div style={{ height: "0.625rem", width: "100%", overflow: "hidden", borderRadius: 9999, background: "var(--surface-elevated)" }}>
              <div style={{ height: "100%", width: "74%", borderRadius: 9999, background: "var(--gradient-mint)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Final CTA */}
      <section
        style={{
          background: "var(--gradient-hero)",
          borderTop: "1px solid color-mix(in oklch, var(--foreground) 8%, transparent)",
          padding: "7rem 2rem",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <span style={eyebrowStyle}>
            <span style={pulseDot} className="animate-pulse-dot" />
            Free to play. Always.
          </span>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "1.25rem 0" }}
          >
            Your next opponent is waiting.
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "1.125rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
            Sign up in 10 seconds. No download. No install. Play on any browser.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/signup" className="hover-lift" style={primaryBtn}>
              Start playing free <ArrowRight className="size-4" />
            </Link>
            <Link to="/login" style={ghostBtn}>
              Sign in
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginTop: "2rem" }}>
            <div style={{ display: "flex" }}>
              {["var(--primary)", "var(--accent)", "oklch(0.83 0.14 80)"].map((c, i) => (
                <span
                  key={i}
                  style={{ width: 32, height: 32, borderRadius: "50%", background: c, marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--background)" }}
                />
              ))}
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.9375rem" }}>Join 240,000+ players</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid color-mix(in oklch, var(--foreground) 8%, transparent)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-center">
            <Logo />
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginLeft: "0.75rem" }}>© 2025 Tazlo</span>
          </div>
          <nav style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="hover:text-foreground"
                style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", transition: "color var(--transition-interactive)" }}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
