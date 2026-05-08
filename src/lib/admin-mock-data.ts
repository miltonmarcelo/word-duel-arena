// Mock data for the WordClash admin portal. Pure mocks — no backend.
import { players, currentUser, type Player } from "./mock-data";

export type WordStatus = "active" | "scheduled" | "archived" | "pending";
export type Difficulty = "easy" | "medium" | "hard";

export type AdminWord = {
  id: string;
  word: string;
  theme: string;
  difficulty: Difficulty;
  status: WordStatus;
  scheduledDate?: string;
  completionRate: number;
  avgAttempts: number;
  totalPlayers: number;
  addedBy: string;
  addedAt: string;
};

const themes = ["General", "Food", "Nature", "Sports", "Travel", "Tech", "Music", "Animals"];
const wordPool = [
  "PLATE","HOUSE","BREAD","CRANE","LIGHT","ROBOT","MUSIC","TIGER","RIVER","STORM",
  "BRAVE","CHESS","PIANO","NOVEL","DRIFT","BEACH","FLAME","GHOST","HONEY","JOLLY",
  "KNIFE","LEMON","MONEY","NORTH","OCEAN","PRIDE","QUEEN","RADIO","SPADE","TRAIN",
];

export const adminWords: AdminWord[] = wordPool.map((w, i) => ({
  id: `w-${i + 1}`,
  word: w,
  theme: themes[i % themes.length],
  difficulty: (["easy", "medium", "hard"] as const)[i % 3],
  status: (["active", "scheduled", "archived", "pending"] as const)[i % 4],
  scheduledDate: i % 4 === 1 ? new Date(Date.now() + i * 86400000).toISOString().slice(0, 10) : undefined,
  completionRate: 0.35 + ((i * 7) % 60) / 100,
  avgAttempts: 2 + ((i * 3) % 4),
  totalPlayers: 200 + i * 47,
  addedBy: i % 2 === 0 ? "admin@wordclash.io" : "ops@wordclash.io",
  addedAt: new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString().slice(0, 10),
}));

export type ScheduleStatus = "scheduled" | "empty" | "live";
export type DailyScheduleEntry = {
  date: string;
  word?: string;
  wordId?: string;
  status: ScheduleStatus;
};

export const dailySchedule: DailyScheduleEntry[] = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  const date = d.toISOString().slice(0, 10);
  if (i === 0) return { date, word: "PLATE", wordId: "w-1", status: "live" };
  if (i % 3 === 0) return { date, status: "empty" };
  const wIdx = (i + 4) % wordPool.length;
  return { date, word: wordPool[wIdx], wordId: `w-${wIdx + 1}`, status: "scheduled" };
});

export type PlayerStatus = "active" | "suspended" | "banned";
export type AdminPlayer = Player & {
  status: PlayerStatus;
  email: string;
  joinedAt: string;
  lastSeen: string;
  totalMatches: number;
  reportCount: number;
  warnings: number;
  region: string;
};

const regions = ["NA", "EU", "APAC", "LATAM", "MEA"];
const allPlayers = [...players, currentUser].filter(
  (p, idx, arr) => arr.findIndex((q) => q.id === p.id) === idx,
);

export const adminPlayers: AdminPlayer[] = allPlayers.map((p, i) => ({
  ...p,
  status: (["active", "active", "active", "suspended", "active", "banned"] as const)[i % 6],
  email: `${p.handle.replace("@", "")}@wordclash.io`,
  joinedAt: new Date(Date.now() - (i + 5) * 86400000 * 30).toISOString().slice(0, 10),
  lastSeen: i % 3 === 0 ? "5m ago" : i % 3 === 1 ? "2h ago" : "Yesterday",
  totalMatches: 80 + i * 23,
  reportCount: i % 4,
  warnings: i % 3 === 0 ? 1 : 0,
  region: regions[i % regions.length],
}));

export type MatchStatus = "completed" | "abandoned" | "disputed" | "void";
export type MatchMode = "direct" | "random" | "daily" | "themed" | "rooms";

export type AdminMatch = {
  id: string;
  playerA: Player;
  playerB: Player;
  word: string;
  mode: MatchMode;
  theme: string;
  status: MatchStatus;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  playerAGuesses: number;
  playerBGuesses: number;
  result: "a_wins" | "b_wins" | "draw";
  xpA: number;
  xpB: number;
  flagged: boolean;
};

const modes: MatchMode[] = ["direct", "random", "daily", "themed", "rooms"];
const statusList: MatchStatus[] = ["completed", "completed", "completed", "abandoned", "disputed", "void"];

export const adminMatches: AdminMatch[] = Array.from({ length: 20 }).map((_, i) => {
  const a = allPlayers[i % allPlayers.length];
  const b = allPlayers[(i + 3) % allPlayers.length];
  const ag = 2 + (i % 5);
  const bg = 3 + ((i + 1) % 4);
  return {
    id: `match-${1000 + i}`,
    playerA: a,
    playerB: b,
    word: wordPool[i % wordPool.length],
    mode: modes[i % modes.length],
    theme: themes[i % themes.length],
    status: statusList[i % statusList.length],
    startedAt: new Date(Date.now() - i * 3600000).toISOString(),
    endedAt: new Date(Date.now() - i * 3600000 + 240000).toISOString(),
    durationSeconds: 90 + (i * 17) % 240,
    playerAGuesses: ag,
    playerBGuesses: bg,
    result: ag < bg ? "a_wins" : ag > bg ? "b_wins" : "draw",
    xpA: 40 + (i * 11) % 80,
    xpB: 30 + (i * 7) % 70,
    flagged: i % 6 === 0,
  };
});

export type RoomStatus = "active" | "waiting" | "closed";
export type AdminRoom = {
  id: string;
  name: string;
  host: Player;
  members: Player[];
  status: RoomStatus;
  activeWord?: string;
  theme: string;
  createdAt: string;
  totalMatches: number;
  reportCount: number;
};

const roomNames = [
  "Wordsmiths","Office League","Family Clash","Night Owls","Sunday Squad",
  "Coffee Talks","Word Warriors","The Vault","Rookies","Veterans",
];

export const adminRooms: AdminRoom[] = roomNames.map((name, i) => ({
  id: `room-${i + 1}`,
  name,
  host: allPlayers[i % allPlayers.length],
  members: allPlayers.slice(i % 4, (i % 4) + 4 + (i % 3)),
  status: (["active", "waiting", "closed", "active"] as const)[i % 4],
  activeWord: i % 3 === 0 ? wordPool[i % wordPool.length] : undefined,
  theme: themes[i % themes.length],
  createdAt: new Date(Date.now() - (i + 1) * 86400000 * 3).toISOString().slice(0, 10),
  totalMatches: 12 + i * 8,
  reportCount: i % 5,
}));

export type ReportType = "player" | "room" | "message";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type ReportPriority = "low" | "medium" | "high";

export type AdminReport = {
  id: string;
  type: ReportType;
  reportedBy: Player;
  target: string;
  reason: string;
  detail: string;
  status: ReportStatus;
  createdAt: string;
  priority: ReportPriority;
};

const reasons = [
  "Offensive language", "Cheating suspicion", "Harassment", "Spam", "Inappropriate name", "Toxicity",
];

export const adminReports: AdminReport[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `rep-${i + 100}`,
  type: (["player", "room", "message"] as const)[i % 3],
  reportedBy: allPlayers[i % allPlayers.length],
  target: allPlayers[(i + 2) % allPlayers.length].name,
  reason: reasons[i % reasons.length],
  detail:
    "Reporter described repeated incidents during recent matches. Please review chat logs and recent activity to determine if action is required.",
  status: (["open", "open", "reviewing", "resolved", "dismissed"] as const)[i % 5],
  createdAt: new Date(Date.now() - i * 3600000 * 5).toISOString(),
  priority: (["low", "medium", "high"] as const)[i % 3],
}));

export const adminStats = {
  dau: 12480,
  wau: 58210,
  mau: 184320,
  dailyWordParticipation: 0.62,
  activeRooms: 142,
  openReports: 9,
  matchesToday: 4218,
  newUsersToday: 312,
  retentionD7: 0.41,
  retentionD30: 0.22,
  topModes: [
    { mode: "Direct", count: 1820 },
    { mode: "Random", count: 1450 },
    { mode: "Daily", count: 2210 },
    { mode: "Rooms", count: 980 },
    { mode: "Themed", count: 612 },
  ],
  dailyActivity: Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toISOString().slice(5, 10),
      matches: 2800 + Math.round(Math.sin(i / 2) * 600 + i * 80),
      users: 9000 + Math.round(Math.cos(i / 3) * 1200 + i * 200),
    };
  }),
  completionByDifficulty: [
    { difficulty: "Easy", rate: 0.78 },
    { difficulty: "Medium", rate: 0.54 },
    { difficulty: "Hard", rate: 0.31 },
  ],
};

export const adminAccounts = [
  { id: "a-1", name: "Maya Operator", role: "Super Admin", lastActive: "Just now" },
  { id: "a-2", name: "Theo Game", role: "Game Admin", lastActive: "12m ago" },
  { id: "a-3", name: "Lin Mod", role: "Moderator", lastActive: "1h ago" },
  { id: "a-4", name: "Sam Help", role: "Support", lastActive: "Yesterday" },
  { id: "a-5", name: "Rae Insights", role: "Analyst", lastActive: "3d ago" },
];

export const currentAdmin = {
  name: "Maya Operator",
  role: "Super Admin",
  initials: "MO",
};
