import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell, Globe, Lock, Volume2, Accessibility, LogOut, Palette,
  Monitor, Moon, Sun, ChevronRight, Check, Search, Trash2, Shield,
  Vibrate, Eye, Type, Languages, Mail, MessageCircle, Trophy, Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WordClash" },
      { name: "description", content: "Personalize WordClash: appearance, notifications, language, privacy, sound, and accessibility." },
    ],
  }),
  component: SettingsPage,
});

const NAV = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "language", label: "Language", icon: Globe },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "sound", label: "Sound & vibration", icon: Volume2 },
  { id: "accessibility", label: "Accessibility", icon: Accessibility },
  { id: "account", label: "Account", icon: LogOut },
] as const;

function SettingsPage() {
  const [active, setActive] = React.useState<string>("appearance");
  const [query, setQuery] = React.useState("");

  const filtered = NAV.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Preferences</p>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl">Settings.</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Make WordClash truly yours. Tune the look, sound and behaviour to match your style.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search settings…"
              className="pl-9"
            />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Side nav */}
          <nav className="surface-elevated h-fit overflow-hidden p-2 lg:sticky lg:top-24">
            <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {filtered.map((n) => {
                const Icon = n.icon;
                const isActive = active === n.id;
                return (
                  <li key={n.id} className="flex-shrink-0 lg:flex-shrink">
                    <button
                      onClick={() => {
                        setActive(n.id);
                        document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="whitespace-nowrap">{n.label}</span>
                      <ChevronRight className={cn(
                        "ml-auto size-4 transition-transform hidden lg:block",
                        isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
                      )} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sections */}
          <div className="space-y-6">
            <AppearanceSection />
            <NotificationsSection />
            <LanguageSection />
            <PrivacySection />
            <SoundSection />
            <AccessibilitySection />
            <AccountSection />

            <p className="pt-2 text-center text-xs text-muted-foreground">
              WordClash · v1.0.0 · Made with care
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* -------------------------------- Sections -------------------------------- */

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const options = [
    { id: "light" as const, label: "Light", icon: Sun, hint: "Bright & airy" },
    { id: "dark" as const, label: "Dark", icon: Moon, hint: "Easy on the eyes" },
    { id: "system" as const, label: "System", icon: Monitor, hint: "Follow OS" },
  ];
  return (
    <Section id="appearance" icon={Palette} title="Appearance" desc="Choose how WordClash looks on this device.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((o) => {
          const Icon = o.icon;
          const isActive = theme === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setTheme(o.id)}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-surface p-4 text-left transition-all",
                isActive
                  ? "border-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_15%,transparent)]"
                  : "border-border hover:-translate-y-0.5 hover:border-primary/40",
              )}
            >
              <div className={cn(
                "mb-3 flex h-20 items-center justify-center rounded-lg",
                o.id === "light" && "bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] text-[#111827]",
                o.id === "dark" && "bg-gradient-to-br from-[#1F2937] to-[#111827] text-white",
                o.id === "system" && "bg-gradient-to-br from-[#F9FAFB] via-[#9CA3AF] to-[#111827] text-white",
              )}>
                <Icon className="size-7" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{o.label}</p>
                {isActive && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{o.hint}</p>
            </button>
          );
        })}
      </div>

      <Divider />

      <Row
        label="Reduce visual noise"
        desc="Hide subtle gradients and decorative effects."
        control={<Switch />}
      />
    </Section>
  );
}

function NotificationsSection() {
  const items = [
    { l: "Direct challenges", d: "When a friend challenges you", on: true, icon: Zap },
    { l: "Match results", d: "When your match ends", on: true, icon: Trophy },
    { l: "Messages", d: "Chat from friends and rooms", on: true, icon: MessageCircle },
    { l: "Weekly recap", d: "Summary delivered every Monday", on: false, icon: Mail },
    { l: "Marketing emails", d: "Product updates and promos", on: false, icon: Mail },
  ];
  return (
    <Section id="notifications" icon={Bell} title="Notifications" desc="Choose what gets your attention.">
      <div className="space-y-1">
        {items.map((n) => (
          <Row
            key={n.l}
            icon={n.icon}
            label={n.l}
            desc={n.d}
            control={<Switch defaultChecked={n.on} />}
          />
        ))}
      </div>
      <Divider />
      <Row
        label="Quiet hours"
        desc="Pause notifications between 22:00 and 08:00."
        control={<Switch />}
      />
    </Section>
  );
}

function LanguageSection() {
  return (
    <Section id="language" icon={Globe} title="Language & region" desc="Used across the interface and word puzzles.">
      <Row
        icon={Languages}
        label="Interface language"
        desc="The language you see in WordClash."
        control={
          <Select defaultValue="en-US">
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="en-GB">English (UK)</SelectItem>
              <SelectItem value="pt-BR">Português (BR)</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
              <SelectItem value="fr-FR">Français</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <Row
        icon={Globe}
        label="Region"
        desc="Affects time format and rankings."
        control={
          <Select defaultValue="us">
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="br">Brazil</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="es">Spain</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </Section>
  );
}

function PrivacySection() {
  return (
    <Section id="privacy" icon={Lock} title="Privacy" desc="Decide who can see and contact you.">
      <Row
        icon={Eye}
        label="Profile visibility"
        desc="Who can view your profile and stats."
        control={
          <Select defaultValue="public">
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends">Friends only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <Row
        icon={Shield}
        label="Allow direct challenges"
        desc="Let other players challenge you 1-vs-1."
        control={<Switch defaultChecked />}
      />
      <Row
        icon={Trophy}
        label="Show on leaderboards"
        desc="Appear in global and friends rankings."
        control={<Switch defaultChecked />}
      />
      <Row
        icon={Eye}
        label="Online status"
        desc="Display when you’re active in WordClash."
        control={<Switch defaultChecked />}
      />
      <Divider />
      <Row
        label="Personalized analytics"
        desc="Help us improve with anonymous usage data."
        control={<Switch defaultChecked />}
      />
    </Section>
  );
}

function SoundSection() {
  const [volume, setVolume] = React.useState([70]);
  return (
    <Section id="sound" icon={Volume2} title="Sound & vibration" desc="Audio cues and haptic feedback.">
      <Row
        icon={Volume2}
        label="Sound effects"
        desc="Play sounds when validating words."
        control={<Switch defaultChecked />}
      />
      <div className="rounded-xl border border-border bg-surface px-4 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Master volume</span>
          <span className="text-muted-foreground tabular-nums">{volume[0]}%</span>
        </div>
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="mt-3"
        />
      </div>
      <Row
        icon={Vibrate}
        label="Vibration"
        desc="Subtle haptics on mobile devices."
        control={<Switch defaultChecked />}
      />
      <Row
        label="Mute when in background"
        desc="Silence audio when WordClash isn’t active."
        control={<Switch />}
      />
    </Section>
  );
}

function AccessibilitySection() {
  const [size, setSize] = React.useState([100]);
  return (
    <Section id="accessibility" icon={Accessibility} title="Accessibility" desc="Comfort and inclusivity options.">
      <Row
        icon={Eye}
        label="High contrast"
        desc="Use Wordle colors with maximum contrast."
        control={<Switch />}
      />
      <Row
        icon={Palette}
        label="Color-blind mode"
        desc="Swap green/yellow for orange/blue."
        control={<Switch />}
      />
      <Row
        icon={Zap}
        label="Reduce motion"
        desc="Minimize animations and transitions."
        control={<Switch />}
      />
      <div className="rounded-xl border border-border bg-surface px-4 py-4">
        <div className="flex items-center justify-between text-sm">
          <Type className="size-4 text-muted-foreground" />
          <span className="mr-auto ml-2 font-medium">Text size</span>
          <span className="text-muted-foreground tabular-nums">{size[0]}%</span>
        </div>
        <Slider
          value={size}
          onValueChange={setSize}
          min={80}
          max={140}
          step={10}
          className="mt-3"
        />
      </div>
      <Row
        label="Screen reader hints"
        desc="Verbose ARIA labels for letters and tiles."
        control={<Switch defaultChecked />}
      />
    </Section>
  );
}

function AccountSection() {
  return (
    <Section id="account" icon={LogOut} title="Account" desc="Manage your session and data.">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Signed in as Alex Rivers</p>
          <p className="text-xs text-muted-foreground">alex@wordclash.gg</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/profile">Edit profile</Link>
          </Button>
          <Button variant="ghost">
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-[color-mix(in_oklch,var(--destructive)_8%,transparent)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-destructive">Delete account</p>
          <p className="text-xs text-muted-foreground">
            Permanently removes your profile, stats and history. This cannot be undone.
          </p>
        </div>
        <Button variant="destructive" className="sm:shrink-0">
          <Trash2 className="mr-2 size-4" /> Delete account
        </Button>
      </div>
    </Section>
  );
}

/* -------------------------------- Primitives ------------------------------ */

function Section({
  id, icon: Icon, title, desc, children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="surface-elevated scroll-mt-24 overflow-hidden p-6"
    >
      <header className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_oklch,var(--primary)_14%,transparent)] text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-xl leading-tight">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
        </div>
      </header>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function Row({
  icon: Icon, label, desc, control,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  desc?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-surface">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface text-muted-foreground">
            <Icon className="size-4" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{label}</p>
          {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function Divider() {
  return <div className="my-4 h-px bg-border" />;
}
