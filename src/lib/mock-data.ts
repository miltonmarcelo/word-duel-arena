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

export type NotificationType =
  | "challenge"
  | "challenge_accepted"
  | "challenge_declined"
  | "word_locked"
  | "opponent_finished"
  | "turn"
  | "starting"
  | "result"
  | "ranking"
  | "achievement"
  | "friend"
  | "friend_request"
  | "friend_accepted"
  | "friend_now"
  | "system";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  group: "today" | "yesterday" | "earlier";
  unread?: boolean;
  actor?: Player;
  meta?: { word?: string; xp?: number; rank?: number; deltaRank?: number; badge?: string };
};

export const notifications: NotificationItem[] = [
  { id: "n-1",   type: "challenge",          title: "Mira challenged you",        body: "Best of 3 · 60s per round",                time: "2m ago",   group: "today",     unread: true,  actor: players[0] },
  { id: "n-1b",  type: "challenge_accepted", title: "Diego accepted your challenge", body: "He locked his word. The duel is on.",   time: "5m ago",   group: "today",     unread: true,  actor: players[1] },
  { id: "n-1c",  type: "word_locked",        title: "Your word has been defined", body: "Yuki picked the word you'll guess.",       time: "7m ago",   group: "today",     unread: true,  actor: players[2], meta: { word: "BRAVE" } },
  { id: "n-1d",  type: "opponent_finished",  title: "Sam finished their guess",   body: "Your turn to close out the round.",        time: "9m ago",   group: "today",     unread: true,  actor: players[3] },
  { id: "n-fr-1",type: "friend_request",     title: "Nora sent you a friend request", body: "She's been climbing the ranks lately.", time: "10m ago",  group: "today",     unread: true,  actor: players[4] },
  { id: "n-fr-2",type: "friend_accepted",    title: "Kai accepted your friend request", body: "You can challenge them now.",          time: "20m ago",  group: "today",     unread: true,  actor: players[5] },
  { id: "n-2",   type: "turn",               title: "Your turn vs Diego",         body: "Round 2 · 1m 40s left to play",            time: "12m ago",  group: "today",     unread: true,  actor: players[1] },
  { id: "n-3",   type: "starting",           title: "Match starting soon",        body: "Wordsmiths room · kicks off in 30s",       time: "18m ago",  group: "today",     unread: true,  actor: players[3] },
  { id: "n-4",   type: "result",             title: "Match ended — view result",  body: "You won vs Yuki · solved in 4",            time: "1h ago",   group: "today",     unread: true,  actor: players[2], meta: { word: "BREAD", xp: 98 } },
  { id: "n-5",   type: "ranking",            title: "You climbed the ranking",    body: "Up 4 places to #28 this week",             time: "3h ago",   group: "today",                    meta: { rank: 28, deltaRank: 4 } },
  { id: "n-6",   type: "achievement",        title: "Achievement unlocked",       body: "Night Owl · won past midnight",            time: "5h ago",   group: "today",                    meta: { badge: "🌙" } },
  { id: "n-7",   type: "friend",             title: "Sam joined Wordsmiths",      body: "Your room has a new member",               time: "Yesterday",group: "yesterday",                actor: players[3] },
  { id: "n-8",   type: "challenge",          title: "Diego rematch request",      body: "Accept to settle the score",               time: "Yesterday",group: "yesterday",                actor: players[1] },
  { id: "n-8b",  type: "challenge_declined", title: "Nora declined your challenge", body: "Maybe next time. Try someone else?",     time: "Yesterday",group: "yesterday",                actor: players[4] },
  { id: "n-9",   type: "result",             title: "Match recap ready",          body: "Draw vs Mira · 6 guesses each",            time: "Yesterday",group: "yesterday",                actor: players[0], meta: { word: "LIGHT", xp: 40 } },
  { id: "n-10",  type: "achievement",        title: "Achievement unlocked",       body: "On Fire · 5 win streak",                   time: "2d ago",   group: "earlier",                  meta: { badge: "🔥" } },
  { id: "n-11",  type: "system",             title: "Weekly reset in 2 days",     body: "Climb the leaderboard before Sunday",      time: "2d ago",   group: "earlier" },
  { id: "n-12",  type: "ranking",            title: "New season started",         body: "Season 4 begins. Reset your progress.",    time: "3d ago",   group: "earlier",                  meta: { rank: 32 } },
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
