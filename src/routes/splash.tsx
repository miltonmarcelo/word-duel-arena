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
    LETTERS.forEach((_, i) => {
      window.setTimeout(() => {
        setFlipped((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 140);
    });

    const glowT = window.setTimeout(() => setGlow(true), 780);
    const markT = window.setTimeout(() => setShowMark(true), 980);
    const tagT = window.setTimeout(() => setShowTagline(true), 1180);
    const fadeT = window.setTimeout(() => setLeaving(true), 1750);
    const navT = window.setTimeout(() => {
      navigate({ to: hasMockSession() ? "/home" : "/welcome" });
    }, 2050);

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
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.4s ease",
        /* Deep rich background — visible purple-to-green diagonal */
        background: `
          linear-gradient(145deg,
            #0D0620 0%,
            #0F1A2E 25%,
            #071A10 60%,
            #0A0F1A 100%
          )
        `,
      }}
    >
      <style>{`
        @keyframes wc-flip-in {
          0%   { transform: rotateX(0deg)  scale(1);    }
          45%  { transform: rotateX(95deg) scale(0.88); }
          100% { transform: rotateX(0deg)  scale(1);    }
        }
        @keyframes wc-glow-burst {
          0%   { opacity: 0;   transform: scale(0.6); }
          40%  { opacity: 1;   transform: scale(1.1); }
          100% { opacity: 0;   transform: scale(1.6); }
        }
        @keyframes wc-wordmark {
          0%   { opacity: 0; transform: translateY(14px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
        @keyframes wc-tagline {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 0.7; transform: translateY(0); }
        }
        @keyframes wc-dot {
          0%, 100% { transform: scaleX(1)   translateY(0);    opacity: 0.4; }
          50%       { transform: scaleX(2.2) translateY(0);    opacity: 1;   }
        }
        @keyframes wc-orb-1 {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.6; }
          50%       { transform: translate(-50%, -50%) scale(1.15); opacity: 0.9; }
        }
        @keyframes wc-orb-2 {
          0%, 100% { transform: translate(-50%, -50%) scale(1.1);  opacity: 0.5; }
          50%       { transform: translate(-50%, -50%) scale(0.9);  opacity: 0.8; }
        }
        @keyframes wc-grid-pulse {
          0%, 100% { opacity: 0.04; }
          50%       { opacity: 0.09; }
        }
        @keyframes wc-scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* ── BIG COLOUR ORBS ── give the background real visible colour */}
      {/* Purple orb — top left */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,60,220,0.28) 0%, transparent 65%)",
          top: "10%",
          left: "10%",
          transform: "translate(-50%, -50%)",
          animation: "wc-orb-1 5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Teal/green orb — bottom right */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,120,0.22) 0%, transparent 65%)",
          bottom: "-5%",
          right: "-10%",
          transform: "translate(0%, 0%)",
          animation: "wc-orb-2 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Blue orb — top right */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,130,246,0.18) 0%, transparent 65%)",
          top: "5%",
          right: "0%",
          pointerEvents: "none",
        }}
      />

      {/* ── GHOST GRID background texture ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(5, 36px)",
          gridTemplateRows: "repeat(6, 36px)",
          gap: 4,
          alignContent: "center",
          justifyContent: "center",
          animation: "wc-grid-pulse 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
            }}
          />
        ))}
      </div>

      {/* ── SCANLINE effect — subtle premium feel ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(transparent 50%, rgba(0,0,0,0.04) 50%)",
          backgroundSize: "100% 4px",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      {/* ── GLOW BURST behind tiles ── */}
      {glow && (
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(34,197,120,0.5) 0%, rgba(120,60,220,0.2) 50%, transparent 75%)",
            animation: "wc-glow-burst 0.8s ease-out forwards",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* ── TILES ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          position: "relative",
          zIndex: 2,
        }}
      >
        {LETTERS.map((ch, i) => (
          <div key={ch} style={{ width: 56, height: 56, perspective: 500 }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,

                /* Tile face changes dramatically on flip */
                background: flipped[i]
                  ? "linear-gradient(145deg, #22C778 0%, #16A35A 40%, #0D6E3A 100%)"
                  : "linear-gradient(145deg, #1E1535 0%, #16102A 100%)",

                border: flipped[i] ? "1.5px solid rgba(100,255,160,0.6)" : "1.5px solid rgba(120,60,220,0.3)",

                boxShadow: flipped[i]
                  ? "0 0 24px rgba(34,197,120,0.5), 0 0 8px rgba(34,197,120,0.3), inset 0 1px 0 rgba(255,255,255,0.25)"
                  : "0 0 12px rgba(120,60,220,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",

                color: flipped[i] ? "#FFFFFF" : "rgba(255,255,255,0.15)",
                fontWeight: 900,
                fontSize: 22,
                letterSpacing: 1,
                textShadow: flipped[i] ? "0 1px 4px rgba(0,0,0,0.4)" : "none",

                animation: `wc-flip-in 0.44s cubic-bezier(0.4,0,0.2,1) both`,
                animationDelay: `${i * 140}ms`,
                transition: "background 0.2s, border 0.2s, box-shadow 0.25s, color 0.15s",
              }}
            >
              {ch}
            </div>
          </div>
        ))}
      </div>

      {/* ── WORDMARK ── */}
      <div
        style={{
          marginTop: 36,
          zIndex: 2,
          opacity: showMark ? 1 : 0,
          animation: showMark ? "wc-wordmark 0.55s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: 4,
            /* Vivid gradient: white → green → purple */
            background: "linear-gradient(90deg, #FFFFFF 0%, #22C778 50%, #A855F7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          WordClash
        </span>
      </div>

      {/* ── TAGLINE ── */}
      <div
        style={{
          marginTop: 10,
          zIndex: 2,
          opacity: showTagline ? 0.7 : 0,
          animation: showTagline ? "wc-tagline 0.4s ease forwards" : "none",
        }}
      >
        <span
          style={{
            color: "#A0A0C0",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Guess · Challenge · Win
        </span>
      </div>

      {/* ── LOADING DOTS ── */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          display: "flex",
          gap: 10,
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: 24,
              height: 4,
              borderRadius: 9999,
              background:
                i === 0
                  ? "linear-gradient(90deg, #22C778, #16A35A)"
                  : i === 1
                    ? "linear-gradient(90deg, #A855F7, #7C3AED)"
                    : "linear-gradient(90deg, #3B82F6, #1D4ED8)",
              transformOrigin: "center",
              animation: "wc-dot 1.3s ease-in-out infinite",
              animationDelay: `${i * 220}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
