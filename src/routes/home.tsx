import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Home as HomeIcon,
  LayoutGrid,
  Swords,
  Trophy,
  User,
} from "lucide-react";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [{ title: "WordClash — Dashboard" }],
  }),
  component: DashboardScreen,
});

type ActiveMatch = {
  initials: string;
  name: string;
  status: string;
  yourTurn: boolean;
};

const activeMatches: ActiveMatch[] = [
  { initials: "MC", name: "Mira Chen", status: "Your turn", yourTurn: true },
  { initials: "DA", name: "Diego Alvarez", status: "Waiting", yourTurn: false },
];

function Avatar({ initials, size }: { initials: string; size: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        background: "#538D4E",
        color: "#FFFFFF",
        fontWeight: 700,
        fontSize: size * 0.34,
      }}
    >
      {initials}
    </div>
  );
}

function DashboardScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-[430px]"
      style={{ background: "#0F0F14", color: "#FFFFFF" }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between"
        style={{ padding: "12px 16px" }}
      >
        <Avatar initials="AR" size={40} />
        <span style={{ fontSize: 18, fontWeight: 700 }}>WordClash</span>
        <button className="relative">
          <Bell size={22} color="#A0A0B0" />
          <span
            className="absolute"
            style={{
              top: -1,
              right: -1,
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#538D4E",
            }}
          />
        </button>
      </header>

      {/* Content */}
      <main className="px-4" style={{ paddingBottom: 96 }}>
        {/* Greeting */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Good morning, Alex 👋</h1>
          <p style={{ color: "#A0A0B0", fontSize: 13, marginTop: 2 }}>
            🔥 7 day streak
          </p>
        </div>

        {/* Play now card */}
        <section
          style={{
            background: "linear-gradient(135deg, #1A3A2A 0%, #0F2A1A 100%)",
            border: "1px solid rgba(83,141,78,0.4)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              color: "#6AAF60",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            READY TO PLAY?
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>
            Start a Match
          </h2>
          <p style={{ color: "#A0A0B0", fontSize: 13, marginTop: 4 }}>
            Challenge a friend or find a random opponent
          </p>
          <div className="flex gap-3" style={{ marginTop: 16 }}>
            <button
              className="flex-1 transition-transform active:scale-[0.98]"
              style={{
                height: 44,
                background: "#538D4E",
                color: "#FFFFFF",
                fontWeight: 600,
                borderRadius: 9999,
                fontSize: 14,
              }}
            >
              Random Match
            </button>
            <button
              className="flex-1 transition-transform active:scale-[0.98]"
              style={{
                height: 44,
                background: "transparent",
                border: "1px solid #538D4E",
                color: "#FFFFFF",
                fontWeight: 600,
                borderRadius: 9999,
                fontSize: 14,
              }}
            >
              Challenge Friend
            </button>
          </div>
        </section>

        {/* Active matches */}
        <section
          style={{
            background: "#1E1E2E",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Active Matches</h3>
            <span
              style={{
                background: "#538D4E",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 9999,
                padding: "2px 8px",
              }}
            >
              {activeMatches.length}
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            {activeMatches.map((m, i) => (
              <div
                key={m.name}
                className="flex items-center"
                style={{
                  height: 48,
                  gap: 12,
                  borderTop: i === 0 ? "none" : "0.5px solid #3A3A4C",
                }}
              >
                <Avatar initials={m.initials} size={32} />
                <div className="flex-1">
                  <p style={{ fontSize: 13, color: "#FFFFFF" }}>{m.name}</p>
                  <p
                    style={{
                      fontSize: 11,
                      color: m.yourTurn ? "#6AAF60" : "#A0A0B0",
                    }}
                  >
                    {m.status}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: m.yourTurn ? "#6AAF60" : "#A0A0B0",
                    fontWeight: 600,
                  }}
                >
                  {m.yourTurn ? "Play →" : "View"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats row */}
        <section className="flex gap-3" style={{ marginBottom: 16 }}>
          <div
            className="flex-1"
            style={{ background: "#1E1E2E", borderRadius: 16, padding: 16 }}
          >
            <div style={{ fontSize: 20 }}>🏆</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>#42</div>
            <div style={{ color: "#A0A0B0", fontSize: 11, marginTop: 2 }}>
              Global ranking
            </div>
          </div>
          <div
            className="flex-1"
            style={{ background: "#1E1E2E", borderRadius: 16, padding: 16 }}
          >
            <div style={{ fontSize: 20 }}>🎯</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>68%</div>
            <div style={{ color: "#A0A0B0", fontSize: 11, marginTop: 2 }}>
              Last 30 days
            </div>
          </div>
        </section>

        {/* Daily word card */}
        <section
          className="flex items-center justify-between"
          style={{
            background: "#1E1E2E",
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <div className="flex-1">
            <p
              style={{
                color: "#6AAF60",
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: 700,
              }}
            >
              DAILY CHALLENGE
            </p>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
              Today's word is waiting
            </h3>
            <p style={{ color: "#A0A0B0", fontSize: 12, marginTop: 2 }}>
              Play solo to keep your streak alive
            </p>
          </div>
          <div className="flex shrink-0" style={{ gap: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 30,
                  height: 30,
                  border: "1px solid #3A3A4C",
                  borderRadius: 6,
                  background: "#0F0F14",
                }}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2"
        style={{
          height: 64,
          background: "#12121A",
          borderTop: "1px solid #2A2A3C",
        }}
      >
        <div className="relative flex h-full items-center justify-around px-2">
          <NavItem icon={<HomeIcon size={22} />} label="Home" active />
          <NavItem icon={<LayoutGrid size={22} />} label="Matches" />
          {/* Elevated center play button */}
          <button
            className="flex flex-col items-center transition-transform active:scale-95"
            style={{ marginTop: -10 }}
          >
            <span
              className="flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 9999,
                background: "#538D4E",
                boxShadow: "0 0 12px #538D4E66",
              }}
            >
              <Swords size={26} color="#FFFFFF" />
            </span>
          </button>
          <NavItem icon={<Trophy size={22} />} label="Rankings" />
          <NavItem
            icon={<User size={22} />}
            label="Profile"
            onClick={() => navigate({ to: "/welcome" })}
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const color = active ? "#538D4E" : "#606070";
  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-1"
      style={{ color }}
    >
      {icon}
      <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
    </button>
  );
}
