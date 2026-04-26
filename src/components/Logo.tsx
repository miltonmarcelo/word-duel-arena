import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2 group", className)}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-display text-lg shadow-[0_8px_24px_color-mix(in_oklch,var(--primary)_30%,transparent)] transition-transform group-hover:scale-105">
        W
      </span>
      <span className="font-display text-xl tracking-tight">
        Word<span className="text-primary">Clash</span>
      </span>
    </Link>
  );
}
