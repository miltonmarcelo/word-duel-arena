import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — WordClash" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Preferences</p>
          <h1 className="font-display text-4xl sm:text-5xl">Settings.</h1>
        </div>

        <Section title="Account" desc="Update your public profile information.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Display name" defaultValue="Alex Rivers" />
            <Field label="Handle" defaultValue="@alex" />
            <Field label="Email" type="email" defaultValue="alex@wordclash.gg" />
            <Field label="Country" defaultValue="United States" />
          </div>
        </Section>

        <Section title="Appearance" desc="Pick the look that suits you best.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(["light","dark","system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "surface-elevated p-4 text-left transition-all",
                  theme === t ? "ring-2 ring-primary" : "hover:-translate-y-0.5"
                )}
              >
                <div className={cn("mb-3 h-20 rounded-lg border border-border",
                  t === "light" && "bg-[#F9FAFB]",
                  t === "dark" && "bg-[#111827]",
                  t === "system" && "bg-gradient-to-br from-[#F9FAFB] to-[#111827]"
                )} />
                <p className="text-sm font-semibold capitalize">{t}</p>
                <p className="text-xs text-muted-foreground">{t === "system" ? "Follow OS" : `${t} mode`}</p>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Notifications" desc="Choose what to be alerted about.">
          {[
            { l: "Direct challenges", on: true },
            { l: "Match results", on: true },
            { l: "Weekly recap", on: false },
            { l: "Marketing emails", on: false },
          ].map((n) => (
            <div key={n.l} className="flex items-center justify-between border-b border-border py-3 last:border-0">
              <span className="text-sm">{n.l}</span>
              <Switch defaultChecked={n.on} />
            </div>
          ))}
        </Section>

        <Section title="Language" desc="Coming soon — currently English only.">
          <Field label="Interface language" defaultValue="English (US)" disabled />
        </Section>

        <Section title="Danger zone" desc="Permanent actions on your account." danger>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost">Sign out</Button>
            <Button variant="destructive">Delete account</Button>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({ title, desc, children, danger }: { title: string; desc: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={cn("surface-elevated p-6", danger && "border-destructive/40")}>
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text", disabled }: { label: string; defaultValue?: string; type?: string; disabled?: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1.5" defaultValue={defaultValue} type={type} disabled={disabled} />
    </div>
  );
}
