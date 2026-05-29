import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { hasMockSession } from "@/lib/mock-session";

export const Route = createFileRoute("")({
  head: () => ({
    meta: [{ title: "WordClash" }],
  }),
  component: LoaderScreen,
});

const LETTERS = ["W", "O", "R", "D", "C"];

function LoaderScreen() {
  const navigate = useNavigate();
  const [glow, setGlow] = useState(false);
  const [showMark, setShowMark] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Tiles land ~700ms → glow pulse, then wordmark fades in.
    const glowT = window.setTimeout(() => setGlow(true), 720);
    const markT = window.setTimeout(() => setShowMark(true), 900);
    // Begin cross-fade out, then navigate based on the (mock) session.
    const fadeT = window.setTimeout(() => setLeaving(true), 1500);
    const navT = window.setTimeout(() => {
      navigate({ to: hasMockSession() ? "/home" : "/welcome" });
    }, 1800);

    return () => {
      window.clearTimeout(glowT);
      window.clearTimeout(markT);
      window.clearTimeout(fadeT);
      window.clearTimeout(navT);
    };
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-300"
      style={{ background: "#0F0F14", opacity: leaving ? 0 : 1 }}
    >
      <style>{`
        @keyframes wc-flip {
          0%   { transform: rotateX(0deg);  }
          50%  { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg);  }
        }
        @keyframes wc-glow {
          0%   { box-shadow: 0 0 0 0 rgba(83,141,78,0); }
          40%  { box-shadow: 0 0 48px 12px rgba(83,141,78,0.55); }
          100% { box-shadow: 0 0 0 0 rgba(83,141,78,0); }
        }
        @keyframes wc-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wc-dot {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 1; }
        }
        .wc-tile-inner { animation: wc-flip 0.42s ease both; }
      `}</style>

      <div
        className="flex"
        style={{
          gap: 6,
          borderRadius: 10,
          animation: glow ? "wc-glow 0.4s ease-out forwards" : "none",
        }}
      >
        {LETTERS.map((ch, i) => (
          <div
            key={ch}
            style={{
              width: 52,
              height: 52,
              perspective: 200,
            }}
          >
            <div
              className="wc-tile-inner flex h-full w-full items-center justify-center"
              style={{
                background: "#1E1E2E",
                border: "1px solid #3A3A4C",
                borderRadius: 8,
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 22,
                animationDelay: `${i * 120}ms`,
              }}
            >
              {ch}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 28,
          height: 30,
          opacity: showMark ? 1 : 0,
          animation: showMark ? "wc-fade-up 0.4s ease both" : "none",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          WordClash
        </span>
      </div>

      <div
        className="absolute flex"
        style={{ bottom: 40, gap: 10 }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#538D4E",
              animation: "wc-dot 1.1s ease-in-out infinite",
              animationDelay: `${i * 180}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
