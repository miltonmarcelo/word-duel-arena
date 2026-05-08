import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminAccounts } from "@/lib/admin-mock-data";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Scoring rules, feature flags and admin accounts.</p>
      </header>

      <ScoringRules />
      <FeatureFlags />
      <Leaderboard />
      <AdminRoles />
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface-elevated p-6">
      <header className="mb-4">
        <h2 className="font-display text-xl">{title}</h2>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </header>
      {children}
    </section>
  );
}

function NumField({ label, defaultValue }: { label: string; defaultValue: number }) {
  return (
    <div>
      <Label className="text-xs font-medium uppercase text-muted-foreground">{label}</Label>
      <Input type="number" defaultValue={defaultValue} className="mt-1" />
    </div>
  );
}

function ScoringRules() {
  return (
    <Card title="Scoring rules" desc="Adjust XP rewards and penalties applied to matches.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NumField label="Base XP per win" defaultValue={100} />
        <NumField label="Base XP per draw" defaultValue={40} />
        <NumField label="Base XP per loss" defaultValue={15} />
        <NumField label="Hint penalty" defaultValue={-10} />
        <NumField label="Streak multiplier" defaultValue={1.2} />
        <NumField label="Daily word XP bonus %" defaultValue={15} />
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={() => toast.success("Scoring rules saved")}>Save changes</Button>
      </div>
    </Card>
  );
}

function FeatureFlags() {
  const flags = [
    { key: "daily", label: "Daily Word", desc: "Show the daily word challenge across the app.", on: true },
    { key: "random", label: "Random Match", desc: "Allow matchmaking with random opponents.", on: true },
    { key: "themed", label: "Themed Mode", desc: "Curated themed words available to players.", on: true },
    { key: "rooms", label: "Group Rooms", desc: "Allow players to create and join rooms.", on: true },
    { key: "hints", label: "Hints allowed", desc: "Players may use a hint per match.", on: false },
    { key: "challenges", label: "Friend challenges", desc: "Players can directly challenge friends.", on: true },
  ];
  return (
    <Card title="Feature flags" desc="Toggle features without a deploy.">
      <ul className="divide-y divide-border">
        {flags.map((f) => (
          <li key={f.key} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
            <Switch defaultChecked={f.on} onCheckedChange={(v) => toast(`${f.label} ${v ? "enabled" : "disabled"}`)} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Leaderboard() {
  const [period, setPeriod] = useState("weekly");
  const [tie, setTie] = useState("guesses");
  return (
    <Card title="Leaderboard" desc="Reset cadence and tie-breaking.">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label className="text-xs font-medium uppercase text-muted-foreground">Reset period</Label>
          <RadioGroup value={period} onValueChange={setPeriod} className="mt-2 space-y-1">
            {["weekly","monthly","all-time"].map((p) => (
              <div key={p} className="flex items-center gap-2">
                <RadioGroupItem value={p} id={`p-${p}`} />
                <Label htmlFor={`p-${p}`} className="capitalize">{p.replace("-"," ")}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label className="text-xs font-medium uppercase text-muted-foreground">Tie-breaking</Label>
          <RadioGroup value={tie} onValueChange={setTie} className="mt-2 space-y-1">
            <div className="flex items-center gap-2"><RadioGroupItem value="guesses" id="t-g" /><Label htmlFor="t-g">Fewer guesses</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="time" id="t-t" /><Label htmlFor="t-t">Faster time</Label></div>
          </RadioGroup>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={() => toast.success("Leaderboard settings saved")}>Save</Button>
      </div>
    </Card>
  );
}

function AdminRoles() {
  return (
    <Card title="Admin roles" desc="Read-only list of admin accounts.">
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminAccounts.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell>{a.role}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
