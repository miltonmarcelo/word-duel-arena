import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WordRow } from "@/components/WordBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — WordClash" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  function handleCreate() {
    try {
      localStorage.setItem("wc_auth", "true");
    } catch {
      // ignore (SSR / privacy mode)
    }
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="gradient-hero min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-6 py-8 lg:grid-cols-2 lg:py-16">
        <div className="hidden lg:block">
          <span className="chip">Join the arena</span>
          <h1 className="mt-4 font-display text-5xl leading-tight">
            Five letters. Endless duels.
          </h1>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Create your account to challenge friends, climb the ranking and unlock themed modes.
          </p>
          <div className="mt-10 flex flex-col gap-2">
            <WordRow
              guess={{
                letters: ["H", "E", "L", "L", "O"],
                states: ["absent", "correct", "absent", "correct", "present"],
              }}
            />
            <WordRow
              guess={{
                letters: ["A", "G", "A", "I", "N"],
                states: ["correct", "correct", "correct", "correct", "correct"],
              }}
            />
          </div>
        </div>

        <div className="surface-elevated p-6 sm:p-8">
          <h2 className="font-display text-3xl">Create your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Free forever. No credit card.</p>

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

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Alex Rivers" className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  id="username"
                  placeholder="alex"
                  className="pl-7"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@wordclash.gg"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
