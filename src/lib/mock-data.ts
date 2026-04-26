// Centralized mock data for the WordClash visual prototype.

export type Player = {
  id: string;
  name: string;
  handle: string;
  level: number;
  xp: number;
  xpToNext: number;
  rating: number;
  avatarColor: string;
  initials: string;
  country: string;
};

export const currentUser: Player = {
  id: "u-0",
  name: "Alex Rivers",
  handle: "@alex",
  level: 18,
  xp: 2480,
  xpToNext: 3200,
  rating: 1842,
  avatarColor: "var(--primary)",
  initials: "AR",
  country: "US",
};

export const players: Player[] = [
  { id: "u-1", name: "Mira Chen",     handle: "@mira",  level: 27, xp: 0, xpToNext: 0, rating: 2310, avatarColor: "var(--accent)",  initials: "MC", country: "SG" },
  { id: "u-2", name: "Diego Alvarez", handle: "@diego", level: 24, xp: 0, xpToNext: 0, rating: 2188, avatarColor: "var(--present)", initials: "DA", country: "MX" },
  { id: "u-3", name: "Yuki Tanaka",   handle: "@yuki",  level: 22, xp: 0, xpToNext: 0, rating: 2104, avatarColor: "var(--correct)", initials: "YT", country: "JP" },
  { id: "u-4", name: "Sam Patel",     handle: "@sam",   level: 21, xp: 0, xpToNext: 0, rating: 2050, avatarColor: "var(--primary)", initials: "SP", country: "IN" },
  { id: "u-5", name: "Nora Lindqvist",handle: "@nora",  level: 20, xp: 0, xpToNext: 0, rating: 1995, avatarColor: "var(--accent)",  initials: "NL", country: "SE" },
  { id: "u-6", name: "Kai Brooks",    handle: "@kai",   level: 19, xp: 0, xpToNext: 0, rating: 1933, avatarColor: "var(--warning)", initials: "KB", country: "AU" },
  { id: "u-7", name: "Ines Moreau",   handle: "@ines",  level: 19, xp: 0, xpToNext: 0, rating: 1901, avatarColor: "var(--correct)", initials: "IM", country: "FR" },
  currentUser,
  { id: "u-8", name: "Ravi Kumar",    handle: "@ravi",  level: 17, xp: 0, xpToNext: 0, rating: 1788, avatarColor: "var(--present)", initials: "RK", country: "IN" },
  { id: "u-9", name: "Zola Mbeki",    handle: "@zola",  level: 16, xp: 0, xpToNext: 0, rating: 1740, avatarColor: "var(--accent)",  initials: "ZM", country: "ZA" },
];

export type TileState = "empty" | "filled" | "correct" | "present" | "absent";
export type Guess = { letters: string[]; states: TileState[] };

export const sampleGuesses: Guess[] = [
  { letters: ["C","R","A","N","E"], states: ["absent","absent","correct","absent","present"] },
  { letters: ["S","L","A","T","E"], states: ["absent","absent","correct","correct","correct"] },
  { letters: ["P","L","A","T","E"], states: ["correct","correct","correct","correct","correct"] },
];

export const opponentGuesses: Guess[] = [
  { letters: ["A","D","I","E","U"], states: ["present","absent","absent","present","absent"] },
  { letters: ["S","T","O","R","E"], states: ["absent","present","absent","absent","correct"] },
  { letters: ["P","L","A","C","E"], states: ["correct","correct","correct","absent","correct"] },
  { letters: ["P","L","A","T","E"], states: ["correct","correct","correct","correct","correct"] },
];

export type Match = {
  id: string;
  opponent: Player;
  result: "win" | "loss" | "draw";
  guesses: number;
  xp: number;
  word: string;
  date: string;
};

export const recentMatches: Match[] = [
  { id: "m-1", opponent: players[0], result: "win",  guesses: 3, xp: 124, word: "PLATE", date: "Today" },
  { id: "m-2", opponent: players[3], result: "loss", guesses: 6, xp: 22,  word: "HOUSE", date: "Today" },
  { id: "m-3", opponent: players[2], result: "win",  guesses: 4, xp: 98,  word: "BREAD", date: "Yesterday" },
  { id: "m-4", opponent: players[5], result: "win",  guesses: 5, xp: 76,  word: "CRANE", date: "2d ago" },
  { id: "m-5", opponent: players[1], result: "draw", guesses: 6, xp: 40,  word: "LIGHT", date: "3d ago" },
];

export type NotificationItem = {
  id: string;
  type: "challenge" | "win" | "system" | "friend";
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  actor?: Player;
};

export const notifications: NotificationItem[] = [
  { id: "n-1", type: "challenge", title: "Mira challenged you", body: "Best of 3 · 60s per round", time: "2m ago", unread: true, actor: players[0] },
  { id: "n-2", type: "win",       title: "You won vs Yuki",     body: "+98 XP · solved in 4 guesses", time: "1h ago", unread: true, actor: players[2] },
  { id: "n-3", type: "friend",    title: "Sam joined Wordsmiths", body: "Your room has a new member", time: "3h ago", actor: players[3] },
  { id: "n-4", type: "system",    title: "Weekly reset in 2 days", body: "Climb the leaderboard before Sunday", time: "Yesterday" },
  { id: "n-5", type: "challenge", title: "Diego rematch request", body: "Accept to settle the score", time: "Yesterday", actor: players[1] },
];

export type Room = {
  id: string;
  name: string;
  members: Player[];
  activity: "live" | "idle";
  emoji: string;
  description: string;
};

export const rooms: Room[] = [
  { id: "r-1", name: "Wordsmiths", emoji: "📚", activity: "live", description: "Daily duels with sharp friends.", members: players.slice(0, 5) },
  { id: "r-2", name: "Office League", emoji: "💼", activity: "idle", description: "Weekly tournament every Friday.", members: players.slice(2, 7) },
  { id: "r-3", name: "Family Clash", emoji: "🏡", activity: "live", description: "Cousins vs aunts. No mercy.", members: players.slice(1, 6) },
  { id: "r-4", name: "Night Owls", emoji: "🌙", activity: "idle", description: "Match only after 10pm.", members: players.slice(4, 9) },
];

export const weeklyStats = [
  { day: "Mon", you: 320, avg: 220 },
  { day: "Tue", you: 410, avg: 250 },
  { day: "Wed", you: 280, avg: 240 },
  { day: "Thu", you: 520, avg: 260 },
  { day: "Fri", you: 460, avg: 280 },
  { day: "Sat", you: 610, avg: 310 },
  { day: "Sun", you: 540, avg: 290 },
];

export const monthlyStats = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i + 1}`,
  wins: 4 + Math.round(Math.sin(i) * 2 + 4),
  losses: 2 + Math.round(Math.cos(i) * 2 + 2),
}));

export const achievements = [
  { id: "a-1", name: "First Win",       desc: "Win your first match",        unlocked: true,  icon: "🏆" },
  { id: "a-2", name: "On Fire",         desc: "5 win streak",                unlocked: true,  icon: "🔥" },
  { id: "a-3", name: "Perfectionist",   desc: "Solve in 2 guesses",          unlocked: true,  icon: "🎯" },
  { id: "a-4", name: "Night Owl",       desc: "Win past midnight",           unlocked: true,  icon: "🌙" },
  { id: "a-5", name: "Globe Trotter",   desc: "Beat players from 5 regions", unlocked: false, icon: "🌍" },
  { id: "a-6", name: "Untouchable",     desc: "10 win streak",               unlocked: false, icon: "👑" },
  { id: "a-7", name: "Speed Demon",     desc: "Solve in under 30s",          unlocked: false, icon: "⚡" },
  { id: "a-8", name: "Wordsmith",      desc: "Reach level 25",              unlocked: false, icon: "✒️" },
];
