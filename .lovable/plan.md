# WordClash — Visual Prototype Plan

A high-fidelity, English-language UI prototype of a social multiplayer Wordle-style game called **DUEL WORDS / WordClash**, using the user's **"Graphite & Mint"** color palette. Pure UI — no backend, no real game logic, fully mocked data.

---

## 🎨 Design System (from uploaded palette)

**Identity**: Graphite base, mint primary, lilac accent. Premium, competitive, social.

**Typography**
- **Headings**: `DM Serif Display` (elegant, editorial) — for hero, screen titles, scores
- **Body / UI**: `Inter` (300–800) — everything else
- Loaded via Google Fonts in `index.html`

**Color tokens** (HEX from the guide, converted to HSL for Tailwind)

| Token | Hex | Role |
|---|---|---|
| `--background` | `#111827` | App background (graphite) |
| `--surface` | `#1F2937` | Cards |
| `--surface-elevated` | `#263241` | Modals, popovers |
| `--surface-soft` | `#162031` | Subtle panels |
| `--primary` | `#2DD4BF` | Mint — CTAs, player A, brand |
| `--secondary` | `#99F6E4` | Soft mint — text accents |
| `--accent` | `#C084FC` | Lilac — player B, highlights |
| `--text` | `#F9FAFB` | Primary text |
| `--muted-text` | `#9CA3AF` | Secondary text |
| `--border` | `#374151` | Borders |
| `--border-soft` | `#2D3748` | Inner dividers |
| `--success` (correct) | `#6AAA64` | Wordle green — letter in right spot |
| `--present` | `#C9B458` | Wordle yellow — letter present |
| `--absent` | `#787C7E` | Wordle gray — letter absent |
| `--danger` | `#F87171` | Errors, lose state |
| `--warning` | `#F6C85F` | Alerts |

**Light mode**: an inverted variant of the same palette — bright off-white background (`#F9FAFB`), graphite text, mint/lilac kept as accents, Wordle game-state colors unchanged (those are universal). Theme toggle visible on every screen.

**Signature touches**
- Soft radial gradients in mint + lilac on hero/landing backgrounds
- Tile flip animations, count-up scores, podium glow
- Player A = mint top-border, Player B = lilac top-border (per the guide)
- Rounded-2xl cards, soft shadows `0 18px 45px rgba(0,0,0,0.18)`

---

## 📁 Styles Architecture (as requested)

Three CSS files, imported in order from `src/styles.css`:

1. **`src/styles/tokens.css`** — all design tokens
   - `:root` block with HSL variables for both light and dark
   - `.dark` overrides
   - Wordle game-state tokens (`--correct`, `--present`, `--absent`)
   - Player tokens (`--player-a`, `--player-b`)
   - Radii, shadows, gradients, font families
   - Mapped into Tailwind via `@theme inline` so utilities like `bg-primary`, `text-accent`, `bg-correct` work

2. **`src/styles/components.css`** — reusable component classes built on tokens
   - `.tile`, `.tile-correct`, `.tile-present`, `.tile-absent`, `.tile-active`, `.tile-empty` (Wordle board)
   - `.key`, `.key-correct/present/absent/active` (virtual keyboard)
   - `.player-card`, `.player-card.player-a`, `.player-card.player-b`
   - `.btn-primary`, `.btn-accent`, `.btn-ghost`, `.btn-danger` (extra variants beyond shadcn)
   - `.surface-elevated`, `.gradient-hero`, `.glow-mint`, `.glow-lilac`
   - Tile flip + reveal keyframes, score count-up, podium shimmer

3. **`src/styles.css`** (existing) — entry file
   - Keeps Tailwind imports and `@theme inline`
   - `@import "./styles/tokens.css"` and `@import "./styles/components.css"`
   - Existing shadcn HSL variables replaced with the Graphite & Mint palette

The existing shadcn `button.tsx` will be updated so `default` = mint, plus added variants (`accent` lilac, `success`). Other shadcn components inherit automatically through the token mapping.

---

## 🧱 App Shell

- **Desktop**: Left sidebar nav (logo, Dashboard, Play, Ranking, Rooms, Notifications, Profile, Settings) + theme toggle in footer
- **Mobile**: Bottom tab bar (Home, Play, Ranking, Rooms, Profile) + top bar with logo, notifications bell, theme toggle
- Persistent across all authenticated screens via a TanStack layout route
- Smooth route transitions, active state with mint underline/pill

Mock data lives in `src/lib/mock-data.ts` (players, scores, matches, notifications, rooms).

---

## 📱 Screens (13 total)

Each is a separate TanStack route file under `src/routes/`.

1. **`/` — Landing** — hero with animated DUEL WORDS tile reveal, mint + lilac gradient bg, feature cards, CTAs to Login/Signup
2. **`/login`** & **`/signup`** — split card, social buttons, mint primary CTA, link between them
3. **`/dashboard`** — greeting, current streak ring, daily challenge card, "Quick Play" tile, recent matches feed, mini stats
4. **`/play`** — Game mode picker: 4 mode cards (Daily, Direct Challenge, Random Match, Group Room) with hover lift
5. **`/play/match-select`** — Direct challenge: friend list with search; OR Random: roulette animation cycling through avatars before locking in
6. **`/match`** — Live match: 6×5 Wordle board, virtual keyboard with state colors, opponent mini-board on the side (mobile: collapsible), turn timer, player A/B name chips with mint/lilac borders
7. **`/match/result`** — Win/Loss banner (mint glow / lilac glow / red), side-by-side final boards, XP gained count-up, rematch & share buttons
8. **`/stats`** — KPI cards (win rate, avg guesses, best streak), tabs for Weekly / Monthly / All-time, line + bar charts using mint + lilac
9. **`/ranking`** — Podium for top 3 (lilac/mint glow), ranked list below with avatars, level badges, weekly delta arrows; filters: Global / Friends / Region
10. **`/rooms`** — Grid of joined rooms (member avatars stack, activity dot), "Create Room" + "Join by Code" CTAs, room detail drawer
11. **`/notifications`** — Grouped (Today / Earlier), types: challenges (lilac), wins (mint), system (gray), with accept/decline inline actions
12. **`/profile`** — Cover gradient, avatar with rank ring, level + XP bar, achievements wall (locked/unlocked badges), match history list
13. **`/settings`** — Sections: Account, Appearance (theme toggle: System / Light / Dark with previews), Notifications, Language, Danger zone

---

## 🔧 Implementation Notes

- **Stack**: TanStack Start + React 19 + Tailwind v4 + shadcn/ui (already installed)
- **Routing**: file-based under `src/routes/` with a layout route for the app shell (sidebar + bottom tabs)
- **Theme toggle**: `next-themes`-style hook persisting to `localStorage`, toggling `.dark` on `<html>`. Toggle component reused in sidebar footer, top bar, and Settings
- **Charts**: `recharts` (already in project) themed via tokens
- **Animations**: CSS keyframes in `components.css` + Tailwind `transition-*` utilities. Tile flip uses 3D transform with stagger
- **Icons**: `lucide-react`
- **No backend**: all data from `mock-data.ts`; auth screens just navigate to `/dashboard`

---

## ✅ Deliverables

- `src/styles/tokens.css` — full Graphite & Mint token system (light + dark)
- `src/styles/components.css` — Wordle tiles, keyboard, player cards, buttons, animations
- Updated `src/styles.css` importing both
- Updated `src/components/ui/button.tsx` with mint + accent + success variants
- App shell layout (sidebar + mobile bottom tabs + theme toggle)
- 13 fully-designed routes with rich mock data
- `src/lib/mock-data.ts` and `src/lib/theme.tsx` (theme provider hook)
- Google Fonts (Inter + DM Serif Display) wired into `__root.tsx` head
