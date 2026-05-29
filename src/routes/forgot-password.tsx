import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WordRow } from "@/components/WordBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — WordClash" }] }),
  component: ForgotPasswordPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function sendResetLink() {
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // Prototype: simulate the password reset request.
      // Wire to Supabase later:
      // await supabase.auth.resetPasswordForEmail(trimmed, {
      //   redirectTo: window.location.origin + "/reset-password",
      // });
      await new Promise((r) => setTimeout(r, 1100));
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-hero min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-6 py-8 lg:grid-cols-2 lg:py-16">
        <div className="hidden lg:block">
          <span className="chip">Account recovery</span>
          <h1 className="mt-4 font-display text-5xl leading-tight">Locked out? Let's fix that.</h1>
          <p className="mt-4 max-w-sm text-muted-foreground">
            We'll email you a secure link so you can set a new password and jump straight back into your duels.
          </p>
          <div className="mt-10 flex flex-col gap-2">
            <WordRow guess={{ letters: ["R","E","S","E","T"], states: ["correct","present","absent","correct","correct"] }} />
            <WordRow guess={{ letters: ["L","O","G","I","N"], states: ["correct","correct","correct","correct","correct"] }} />
          </div>
        </div>

        <div className="surface-elevated p-6 sm:p-8">
          {!sent ? (
            <>
              <h2 className="font-display text-3xl">Forgot password</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!loading) sendResetLink();
                }}
              >
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    className="mt-1.5"
                    value={email}
                    disabled={loading}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={!!error}
                  />
                  {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">
                  ← Back to login
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-[0_0_0_6px_color-mix(in_oklch,var(--primary)_12%,transparent)]">
                <MailCheck className="size-8" />
              </div>
              <h2 className="mt-5 font-display text-3xl">Check your inbox</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                We've sent a password reset link to{" "}
                <span className="font-semibold text-foreground">{email.trim()}</span>. Check your spam
                folder if you don't see it.
              </p>

              <div className="mt-6 flex flex-col items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => sendResetLink()}
                  disabled={loading}
                  className="font-medium text-primary hover:underline disabled:opacity-50"
                >
                  {loading ? "Resending…" : "Resend email"}
                </button>
                <Link to="/login" className="font-medium text-muted-foreground hover:text-foreground">
                  ← Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
