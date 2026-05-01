import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

type WordPickSearch = {
  opp?: string;
  name?: string;
  handle?: string;
  rating?: number;
};

export const Route = createFileRoute("/play/word-pick")({
  validateSearch: (s: Record<string, unknown>): WordPickSearch => ({
    opp: typeof s.opp === "string" ? s.opp : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
    handle: typeof s.handle === "string" ? s.handle : undefined,
    rating: typeof s.rating === "number" ? s.rating : Number(s.rating) || undefined,
  }),
  head: () => ({
    meta: [{ title: "Pick a word — WordClash" }],
  }),
  component: WordPickStub,
});

function WordPickStub() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="page-eyebrow justify-center">Coming next</p>
        <h1 className="mt-2 font-display text-4xl">Pick a word</h1>
        <p className="mt-3 text-muted-foreground">
          Browse curated words by theme. Placeholder for now.
        </p>
        <Link to="/play/choose-word" className="mt-6 inline-block">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    </AppShell>
  );
}
