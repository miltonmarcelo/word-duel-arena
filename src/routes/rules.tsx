import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Swords, Grid3x3, Palette, Coins, Eye, Gamepad2, Sparkles,
  Trophy, Clock, Users2, Zap, Shuffle, ChevronRight, AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "How to play — WordClash" },
      { name: "description", content: "Learn how WordClash duels work: attempts, colors, points, reveals, modes and themes — explained visually." },
      { property: "og:title", content: "How to play — WordClash" },
      { property: "og:description", content: "A clear, visual guide to WordClash duels: attempts, colors, points, reveals, modes and themes." },
    ],
  }),
  component: RulesPage,
});

const SECTIONS = [
  { id: "challenge", label: "The duel", icon: Swords },
  { id: "attempts",  label: "Attempts", icon: Grid3x3 },
  { id: "colors",    label: "Colors",   icon: Palette },
  { id: "points",    label: "Points",   icon: Coins },
  { id: "reveals",   label: "Reveals",  icon: Eye },
  { id: "modes",     label: "Modes",    icon: Gamepad2 },
  { id: "themes",    label: "Themes",   icon: Sparkles },
] as const;

function RulesPage() {
  return (
    <AppShell>
      <div className="space-y-10">
        <Hero />
        <SectionNav />
        <ChallengeSection />
        <AttemptsSection />
        <ColorsSection />
        <PointsSection />
        <RevealsSection />
        <ModesSection />
        <ThemesSection />
        <CTACard />
      </div>
    </AppShell>
  );
}

/* ----------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-12"
      style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}>
      <div className="relative max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="size-3" /> How to play
        </span>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-6xl">
          Two players. <span className="text-primary">Six tries.</span><br />
          One mystery word.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          WordClash turns the daily word puzzle into a head-to-head duel. Crack the word
          faster than your rival, score more points, climb the ranks.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/play">Start a duel</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>

      {/* decorative tiles */}
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 gap-2 lg:flex">
        {[
          { l: "P", c: "tile-correct" },
          { l: "L", c: "tile-present" },
          { l: "A", c: "tile-correct" },
          { l: "Y", c: "tile-absent" },
          { l: "!", c: "tile-active" },
        ].map((t, i) => (
          <div
            key={i}
            className={cn("tile", t.c)}
            style={{ transform: `rotate(${(i - 2) * 4}deg)` }}
          >
            {t.l}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionNav() {
  return (
    <nav className="surface-elevated -mx-1 overflow-x-auto p-2">
      <ul className="flex min-w-max gap-1">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* --------------------------------- Sections ------------------------------- */

function ChallengeSection() {
  const steps = [
    { n: 1, t: "Find a rival", d: "Challenge a friend, queue up randomly, or join a public room." },
    { n: 2, t: "A theme is drawn", d: "A category is randomly picked — both players get the same secret word." },
    { n: 3, t: "Race to solve", d: "You play in parallel. Tries, time and points all count." },
    { n: 4, t: "Compare & score", d: "When both are done, you see the result side-by-side and earn rating." },
  ];
  return (
    <RuleSection id="challenge" icon={Swords} kicker="01" title="How a duel works"
      lead="Every WordClash match is a 1-vs-1 race against the same hidden word.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="surface-elevated relative h-full p-5">
            <span className="font-display text-5xl leading-none text-primary/80">{s.n}</span>
            <h3 className="mt-3 font-display text-lg">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            {s.n < steps.length && (
              <ChevronRight className="absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-border lg:block" />
            )}
          </div>
        ))}
      </div>
    </RuleSection>
  );
}

function AttemptsSection() {
  return (
    <RuleSection id="attempts" icon={Grid3x3} kicker="02" title="Attempts & the board"
      lead="You have 6 tries to guess a 5-letter word. Each guess must be a valid word.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface-elevated p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Example board</p>
          <div className="mt-4 flex flex-col items-center gap-2">
            {[
              ["S","T","O","R","E"],
              ["B","R","E","A","D"],
              ["B","R","A","V","E"],
            ].map((row, ri) => (
              <div key={ri} className="flex gap-2">
                {row.map((l, ci) => {
                  const colors = [
                    ["tile-absent","tile-absent","tile-present","tile-absent","tile-present"],
                    ["tile-present","tile-correct","tile-absent","tile-correct","tile-absent"],
                    ["tile-correct","tile-correct","tile-correct","tile-correct","tile-correct"],
                  ];
                  return <div key={ci} className={cn("tile", colors[ri][ci])} style={{ width: "3rem", height: "3rem", fontSize: "1.25rem" }}>{l}</div>;
                })}
              </div>
            ))}
            {[0,1,2].map((i) => (
              <div key={`empty-${i}`} className="flex gap-2">
                {Array.from({length:5}).map((_, ci) => (
                  <div key={ci} className="tile tile-empty" style={{ width: "3rem", height: "3rem" }} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Bullet icon={CheckCircle2} title="6 attempts max" desc="If you don't crack it in six guesses, the round is lost." />
          <Bullet icon={CheckCircle2} title="Valid words only" desc="Random letters won't be accepted — only real dictionary words." />
          <Bullet icon={Clock} title="Time matters" desc="Faster solves break ties and earn small speed bonuses." />
          <Bullet icon={AlertTriangle} title="No going back" desc="Once you submit a row, your attempt is locked in." />
        </div>
      </div>
    </RuleSection>
  );
}

function ColorsSection() {
  const items = [
    {
      cls: "tile-correct",
      letter: "B",
      title: "Correct",
      desc: "Right letter, right spot. Lock it in for the next try.",
    },
    {
      cls: "tile-present",
      letter: "R",
      title: "Present",
      desc: "The letter is in the word — but in a different position.",
    },
    {
      cls: "tile-absent",
      letter: "Z",
      title: "Absent",
      desc: "The letter isn't in the word at all. Skip it next time.",
    },
  ];
  return (
    <RuleSection id="colors" icon={Palette} kicker="03" title="What the colors mean"
      lead="After each guess, every tile flips to a color that tells you how close that letter is.">
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((i) => (
          <div key={i.title} className="surface-elevated flex flex-col items-center p-6 text-center">
            <div className={cn("tile", i.cls)}>{i.letter}</div>
            <h3 className="mt-4 font-display text-lg">{i.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{i.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        <p><strong className="text-foreground">Color-blind mode</strong> swaps green/yellow for orange/blue — enable it in Settings → Accessibility.</p>
      </div>
    </RuleSection>
  );
}

function PointsSection() {
  const rows = [
    { l: "Solve in 1 try",  v: "+200", tone: "primary" },
    { l: "Solve in 2 tries", v: "+150", tone: "primary" },
    { l: "Solve in 3 tries", v: "+100", tone: "primary" },
    { l: "Solve in 4 tries", v: "+70",  tone: "primary" },
    { l: "Solve in 5 tries", v: "+50",  tone: "primary" },
    { l: "Solve in 6 tries", v: "+30",  tone: "primary" },
    { l: "Speed bonus (under 60s)", v: "+25", tone: "accent" },
    { l: "Word not solved", v: "−40", tone: "danger" },
    { l: "Used a reveal",   v: "−20", tone: "danger" },
  ];
  return (
    <RuleSection id="points" icon={Coins} kicker="04" title="How points work"
      lead="Solve faster and cleaner to earn more rating. Risky plays cost you.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="surface-elevated p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Score table</p>
          <ul className="mt-3 divide-y divide-border">
            {rows.map((r) => (
              <li key={r.l} className="flex items-center justify-between py-2.5 text-sm">
                <span>{r.l}</span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums",
                    r.tone === "primary" && "bg-[color-mix(in_oklch,var(--primary)_18%,transparent)] text-primary",
                    r.tone === "accent"  && "bg-[color-mix(in_oklch,var(--accent)_18%,transparent)]  text-accent",
                    r.tone === "danger"  && "bg-[color-mix(in_oklch,var(--destructive)_15%,transparent)] text-destructive",
                  )}
                >
                  {r.v}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <Bullet icon={Trophy} title="Win the duel" desc="The higher score wins the match and adds a bonus to your global rating." />
          <Bullet icon={Zap} title="Streak multiplier" desc="Win 3+ duels in a row to multiply your point gains by ×1.25." />
          <Bullet icon={AlertTriangle} title="Points at risk" desc="Each duel stakes a slice of your rating — losing always costs something." />
        </div>
      </div>
    </RuleSection>
  );
}

function RevealsSection() {
  return (
    <RuleSection id="reveals" icon={Eye} kicker="05" title="Revealed letters"
      lead="Stuck? Spend points to uncover a single letter — but use them wisely.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="surface-elevated p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visual cue</p>
          <div className="mt-5 flex flex-col items-center gap-4">
            <div className="flex gap-2">
              <div className="tile tile-empty" />
              <div className="tile tile-empty" />
              <div className="tile tile-correct relative">
                A
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-md">
                  <Eye className="size-3" />
                </span>
              </div>
              <div className="tile tile-empty" />
              <div className="tile tile-empty" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Revealed letters glow with an <span className="text-accent font-semibold">accent ring</span> and stay locked for the rest of the match.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <Bullet icon={Coins} title="Cost: 20 points" desc="The price is deducted from your final score, win or lose." />
          <Bullet icon={Eye} title="Random correct letter" desc="Reveals a letter that exists in the word, in its true position." />
          <Bullet icon={AlertTriangle} title="Limit per match" desc="Up to 2 reveals per duel — you can't brute-force the answer." />
          <Bullet icon={Sparkles} title="Visible on results" desc="Both players see how many reveals were used in the recap screen." />
        </div>
      </div>
    </RuleSection>
  );
}

function ModesSection() {
  const modes = [
    {
      icon: Swords, name: "Classic duel",
      desc: "1-vs-1 race, 6 tries, full rating at stake.",
      tag: "Default", tone: "primary",
    },
    {
      icon: Zap, name: "Blitz",
      desc: "60 seconds total per player. Speed defines everything.",
      tag: "Fast", tone: "accent",
    },
    {
      icon: Users2, name: "Rooms",
      desc: "Up to 8 players in private rooms with a custom theme.",
      tag: "Social", tone: "primary",
    },
    {
      icon: Shuffle, name: "Random match",
      desc: "Auto-pair with a stranger of your skill level.",
      tag: "Open", tone: "accent",
    },
  ];
  return (
    <RuleSection id="modes" icon={Gamepad2} kicker="06" title="Game modes"
      lead="Pick the rhythm that fits your mood — every mode shares the same word rules.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.name} className="surface-elevated group relative h-full overflow-hidden p-5 transition-transform hover:-translate-y-0.5">
              <div className={cn(
                "flex size-11 items-center justify-center rounded-xl",
                m.tone === "primary" ? "bg-[color-mix(in_oklch,var(--primary)_15%,transparent)] text-primary"
                                     : "bg-[color-mix(in_oklch,var(--accent)_15%,transparent)] text-accent",
              )}>
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg">{m.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              <span className={cn(
                "mt-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                m.tone === "primary" ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent",
              )}>
                {m.tag}
              </span>
            </div>
          );
        })}
      </div>
    </RuleSection>
  );
}

function ThemesSection() {
  const themes = ["Cinema", "Sports", "Science", "Music", "Travel", "Tech", "Food", "Nature"];
  return (
    <RuleSection id="themes" icon={Sparkles} kicker="07" title="Themes & the draw"
      lead="Every match starts with a random theme — the secret word always belongs to that category.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface-elevated p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">How the draw works</p>
          <ol className="mt-4 space-y-4">
            {[
              { t: "You both pick a pool", d: "Choose your favorite themes in your profile — the system mixes both pools." },
              { t: "A theme is drawn", d: "One category is randomly selected from the shared pool, fair for both sides." },
              { t: "A word is sealed", d: "A word from that category is picked. Both players solve the exact same word." },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{s.t}</p>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="surface-elevated p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Available themes</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {themes.map((t, i) => (
              <span
                key={t}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  i % 2 === 0
                    ? "border-primary/30 bg-[color-mix(in_oklch,var(--primary)_10%,transparent)] text-primary"
                    : "border-accent/30 bg-[color-mix(in_oklch,var(--accent)_10%,transparent)] text-accent",
                )}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
            <Shuffle className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>Hate a theme? You can <strong className="text-foreground">reroll once per duel</strong> — both players need to agree.</p>
          </div>
        </div>
      </div>
    </RuleSection>
  );
}

function CTACard() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-border p-8 text-center sm:p-12"
      style={{ background: "var(--gradient-mint)" }}
    >
      <h2 className="font-display text-3xl text-primary-foreground sm:text-4xl">Ready for your first duel?</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/80">
        You know the rules. Now go pick a rival and prove it.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" variant="secondary">
          <Link to="/play">Find a match</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
          <Link to="/rooms">Join a room</Link>
        </Button>
      </div>
    </section>
  );
}

/* -------------------------------- Primitives ------------------------------ */

function RuleSection({
  id, icon: Icon, kicker, title, lead, children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  kicker: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_oklch,var(--primary)_14%,transparent)] text-primary">
            <Icon className="size-6" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Step {kicker}</p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">{title}</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">{lead}</p>
          </div>
        </div>
      </header>
      {children}
    </section>
  );
}

function Bullet({
  icon: Icon, title, desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
