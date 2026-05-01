import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/play/matches")({
  head: () => ({
    meta: [{ title: "Matches in progress — WordClash" }],
  }),
  component: MatchesStub,
});

function MatchesStub() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="page-eyebrow justify-center">Coming next</p>
        <h1 className="mt-2 font-display text-4xl">Matches in progress</h1>
        <p className="mt-3 text-muted-foreground">
          This screen will list all your active duels. Placeholder for now.
        </p>
        <Link to="/play" className="mt-6 inline-block">
          <Button variant="outline">Back to Play</Button>
        </Link>
      </div>
    </AppShell>
  );
}
