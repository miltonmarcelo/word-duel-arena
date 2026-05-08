import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { adminStats, adminReports, dailySchedule, adminWords } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/overview")({
  component: OverviewPage,
});

function Kpi({ label, value, accent }: { label: string; value: string; accent?: "warning" | "primary" }) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 font-display text-3xl tabular-nums",
          accent === "warning" && "text-[color:var(--warning)]",
          accent === "primary" && "text-primary",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function OverviewPage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const todayEntry = dailySchedule[0];
  const todayWord = todayEntry.word ? adminWords.find((w) => w.word === todayEntry.word) : undefined;
  const openReports = adminReports.filter((r) => r.status === "open");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl">Operations Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">{today}</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="DAU" value={adminStats.dau.toLocaleString()} />
        <Kpi label="WAU" value={adminStats.wau.toLocaleString()} />
        <Kpi label="MAU" value={adminStats.mau.toLocaleString()} />
        <Kpi label="Matches today" value={adminStats.matchesToday.toLocaleString()} />
        <Kpi label="New users today" value={`+${adminStats.newUsersToday}`} accent="primary" />
        <Kpi label="Active rooms" value={adminStats.activeRooms.toString()} />
        <Kpi
          label="Open reports"
          value={adminStats.openReports.toString()}
          accent={adminStats.openReports > 5 ? "warning" : undefined}
        />
        <Kpi label="Daily word participation" value={`${Math.round(adminStats.dailyWordParticipation * 100)}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface-elevated p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Daily activity (14d)</h2>
            <span className="text-xs text-muted-foreground">Users · Matches</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adminStats.dailyActivity}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Line type="monotone" dataKey="users" stroke="var(--primary)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="matches" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-elevated p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Mode usage</h2>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminStats.topModes}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="mode" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface-elevated p-5">
          <h2 className="mb-4 text-sm font-semibold">Today's word</h2>
          {todayEntry.word && todayWord ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-4xl tracking-widest text-primary">{todayEntry.word}</p>
                <Badge className="bg-primary/15 text-primary">Live</Badge>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Completion rate</span>
                  <span className="tabular-nums">{Math.round(todayWord.completionRate * 100)}%</span>
                </div>
                <Progress value={todayWord.completionRate * 100} />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Avg attempts</p>
                  <p className="font-display text-xl tabular-nums">{todayWord.avgAttempts.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Players</p>
                  <p className="font-display text-xl tabular-nums">{todayWord.totalPlayers.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/10 p-4">
              <div className="flex items-center gap-2 text-[color:var(--warning)]">
                <AlertTriangle className="size-4" />
                <p className="text-sm font-semibold">No word scheduled for today</p>
              </div>
              <Link to="/admin/words" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Go to scheduler <ArrowRight className="size-3" />
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface-elevated p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent reports</h2>
            <Link to="/admin/reports" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-border">
            {openReports.slice(0, 4).map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.target}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.reason}</p>
                </div>
                <PriorityBadge priority={r.priority} />
                <Link
                  to="/admin/reports"
                  className="ml-3 text-xs font-medium text-primary hover:underline"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: "low" | "medium" | "high" }) {
  const map = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    high: "bg-destructive/15 text-destructive",
  } as const;
  return <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", map[priority])}>{priority}</span>;
}
