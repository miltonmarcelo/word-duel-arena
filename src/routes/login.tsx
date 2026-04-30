import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WordRow } from "@/components/WordBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — WordClash" }] }),
  component: LoginPage,
});

function LoginPage() {
  return <AuthShell mode="login" />;
}

export function AuthShell({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  return (
    <div className="gradient-hero min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-6 py-8 lg:grid-cols-2 lg:py-16">
        <div className="hidden lg:block">
          <span className="chip">Welcome back</span>
          <h1 className="mt-4 font-display text-5xl leading-tight">A duel is waiting for you.</h1>
          <p className="mt-4 max-w-sm text-muted-foreground">Pick up your streak, accept pending challenges, or start a new round in seconds.</p>
          <div className="mt-10 flex flex-col gap-2">
            <WordRow guess={{ letters: ["H","E","L","L","O"], states: ["absent","correct","absent","correct","present"] }} />
            <WordRow guess={{ letters: ["A","G","A","I","N"], states: ["correct","correct","correct","correct","correct"] }} />
          </div>
        </div>

        <div className="surface-elevated p-6 sm:p-8">
          <h2 className="font-display text-3xl">{isLogin ? "Log in" : "Create your account"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{isLogin ? "Welcome back, wordsmith." : "Free forever. No credit card."}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button asChild variant="secondary" className="w-full">
              <Link to="/dashboard">Continue with Google</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/dashboard">Continue with Apple</Link>
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div>
                <Label htmlFor="name">Display name</Label>
                <Input id="name" placeholder="Alex Rivers" className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@wordclash.gg" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1.5" />
            </div>
            <Link to="/dashboard" className="block">
              <Button size="lg" className="w-full">{isLogin ? "Log in" : "Create account"}</Button>
            </Link>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <Link to={isLogin ? "/signup" : "/login"} className="font-semibold text-primary hover:underline">
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
