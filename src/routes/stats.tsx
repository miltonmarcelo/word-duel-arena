import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { monthlyStats, weeklyStats } from "@/lib/mock-data";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Stats — WordClash" }] }),
  component: StatsPage,
});

const kpis = [
  { label: "Win rate",    value: "68%",   delta: "+4%" },
  { label: "Avg guesses", value: "3.7",   delta: "-0.2" },
  { label: "Best streak", value: "27d",   delta: "Best" },
  { label: "Total XP",    value: "12.4k", delta: "+820" },
];

function StatsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Performance</p>
          <h1 className="font-display text-4xl sm:text-5xl">Your numbers.</h1>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="surface-elevated p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className="mt-1 font-display text-3xl">{k.value}</p>
              <p className="mt-1 text-xs text-primary">{k.delta}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all">All-time</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-6">
            <div className="surface-elevated p-6">
              <h3 className="mb-4 font-display text-xl">XP earned this week</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={weeklyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="you" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="avg" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <div className="surface-elevated p-6">
              <h3 className="mb-4 font-display text-xl">Wins vs losses (12 weeks)</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Bar dataKey="wins" fill="var(--primary)" radius={[6,6,0,0]} />
                    <Bar dataKey="losses" fill="var(--accent)" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="surface-elevated p-6">
              <h3 className="mb-4 font-display text-xl">Lifetime overview</h3>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { l: "Matches", v: "412" },
                  { l: "Wins", v: "281" },
                  { l: "Avg time", v: "1m 22s" },
                  { l: "Trophies", v: "9" },
                ].map((s) => (
                  <div key={s.l}><p className="font-display text-3xl">{s.v}</p><p className="text-xs uppercase text-muted-foreground">{s.l}</p></div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
