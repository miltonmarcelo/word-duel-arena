import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { hasMockSession } from "@/lib/mock-session";

export const Route = createFileRoute("/splash")({
  head: () => ({
    meta: [{ title: "WordClash" }],
  }),
  component: LoaderScreen,
});

const LETTERS = ["W", "O", "R", "D", "C"];

function LoaderScreen() {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false, false, false]);
  const [glow, setGlow] = useState(false);
  const [showMark, setShowMark] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Flip tiles one by one
    LETTERS.forEach((_, i) => {
      window.setTimeout(() => {
        setFlipped((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 130);
    });

    const glowT = window.setTimeout(() => setGlow(true), 750);
    const markT = window.setTimeout(() => setShowMark(true), 950);
    const tagT = window.setTimeout(() => setShowTagline(true), 1150);
    const fadeT = window.setTimeout(() => setLeaving(true), 1700);
    const navT = window.setTimeout(() => {
      navigate({ to: hasMockSession() ? "/home" : "/welcome" });
    }, 2000);

    return () => {
      window.clearTimeout(glowT);
      window.clearTimeout(markT);
      window.clearTimeout(tagT);
      window.clearTimeout(fadeT);
      window.clearTimeout(navT);
    };
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.35s ease",
        background: `
          radial-gradient(ellipse 80% 60% at 50% 40%, #0D2818 0%, transparent 65%),
          radial-gradient(ellipse 60% 40% at 50% 40%, #0A1628 0%, transparent 60%),
          linear-gradient(160deg, #0A0A12 0%, #080810 40%, #0A0D0A 100%)
        `,
      }}
    >
      <style>{`
        @keyframes wc-flip-in {
          0%   { transform: rotateX(0deg) scale(1);   opacity: 1; }
          45%  { transform: rotateX(92deg) scale(0.9); opacity: 0.6; }
          100% { transform: rotateX(0deg) scale(1);   opacity: 1; }
        }
        @keyframes wc-glow-burst {
          0%   { opacity: 0; transform: scale(0.8); }
          35%  { opacity: 1; transform: scale(1.08); }
          100% { opacity: 0; transform: scale(1.4); }
        }
        @keyframes wc-wordmark {
          0%   { opacity: 0; transform: translateY(10px) scale(0.97); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0px) scale(1);    filter: blur(0px); }
        }
        @keyframes wc-tagline {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes wc-dot-travel {
          0%   { transform: scaleX(1);   opacity: 0.3; }
          50%  { transform: scaleX(1.8); opacity: 1;   }
          100% { transform: scaleX(1);   opacity: 0.3; }
        }
        @keyframes wc-ambient {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.7; }
        }
      `}</style>

      {/* Ambient background orb — breathes slowly */}
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(83,141,78,0.12) 0%, transparent 70%)",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "wc-ambient 3s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Glow burst behind tiles */}
      {glow && (
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(83,141,78,0.35) 0%, transparent 70%)",
            animation: "wc-glow-burst 0.7s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Tile row */}
      <div style={{ display: "flex", gap: 8, position: "relative", zIndex: 1 }}>
        {LETTERS.map((ch, i) => (
          <div
            key={ch}
            style={{
              width: 54,
              height: 54,
              perspective: 400,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                background: flipped[i]
                  ? "linear-gradient(145deg, #1A3D2B 0%, #0F2218 50%, #162E1F 100%)"
                  : "linear-gradient(145deg, #1C1C2E 0%, #14141F 100%)",
                border: flipped[i] ? "1.5px solid rgba(83,141,78,0.7)" : "1.5px solid rgba(255,255,255,0.07)",
                boxShadow: flipped[i]
                  ? "0 0 16px rgba(83,141,78,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"
                  : "inset 0 1px 0 rgba(255,255,255,0.04)",
                color: flipped[i] ? "#FFFFFF" : "transparent",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: 1,
                transition: "background 0.15s, border 0.15s, box-shadow 0.2s, color 0.1s",
                animation: `wc-flip-in 0.42s ease both`,
                animationDelay: `${i * 130}ms`,
              }}
            >
              {ch}
            </div>
          </div>
        ))}
      </div>

      {/* Wordmark */}
      <div
        style={{
          marginTop: 32,
          height: 36,
          opacity: showMark ? 1 : 0,
          animation: showMark ? "wc-wordmark 0.5s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 3,
            background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 55%, #6AAF60 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          WordClash
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 8,
          opacity: showTagline ? 1 : 0,
          animation: showTagline ? "wc-tagline 0.4s ease forwards" : "none",
        }}
      >
        <span
          style={{
            color: "rgba(160,160,176,0.7)",
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Guess · Challenge · Win
        </span>
      </div>

      {/* Loading dots */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 20,
              height: 4,
              borderRadius: 9999,
              background: "linear-gradient(90deg, #538D4E, #6AAF60)",
              transformOrigin: "center",
              animation: "wc-dot-travel 1.2s ease-in-out infinite",
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
