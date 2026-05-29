import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { setMockSession } from "@/lib/mock-session";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "WordClash — Guess. Challenge. Win." },
      {
        name: "description",
        content: "Sign in to WordClash and start competitive word duels.",
      },
    ],
  }),
  component: WelcomeScreen,
});

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
      <path d="M16.37 1.43c.05 1.05-.34 2.07-1.02 2.83-.7.79-1.84 1.4-2.96 1.31-.06-1.02.41-2.07 1.06-2.79.72-.79 1.95-1.36 2.92-1.35zM20.5 17.1c-.55 1.27-.81 1.83-1.52 2.95-.99 1.57-2.38 3.52-4.11 3.53-1.53.01-1.93-.99-4.01-.98-2.08.01-2.52.99-4.05.98-1.73-.02-3.05-1.78-4.04-3.34C-.07 16.04-.36 10.6 1.42 7.7c1.27-2.07 3.27-3.28 5.15-3.28 1.92 0 3.12 1.05 4.71 1.05 1.54 0 2.48-1.05 4.7-1.05 1.67 0 3.44.91 4.7 2.48-4.13 2.26-3.46 8.16.32 10.2z" />
    </svg>
  );
}

function WelcomeScreen() {
  const navigate = useNavigate();

  const signIn = () => {
    setMockSession(true);
    navigate({ to: "/home" });
  };

  return (
    <div
      className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col"
      style={{ background: "linear-gradient(180deg, #0F0F14 0%, #1A1A2E 100%)" }}
    >
      {/* Hero ghost grid */}
      <div className="relative" style={{ flex: "0 0 35%" }}>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0.12, filter: "blur(2px)" }}
          aria-hidden="true"
        >
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(5, 36px)", gap: 4 }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 36,
                  border: "1px solid #3A3A4C",
                  borderRadius: 6,
                  background: "#1E1E2E",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Brand zone */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1
          style={{
            color: "#FFFFFF",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          WordClash
        </h1>
        <p
          style={{
            marginTop: 10,
            color: "#A0A0B0",
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: 1,
          }}
        >
          Guess. Challenge. Win.
        </p>
        <div
          style={{
            marginTop: 16,
            width: 48,
            height: 2,
            background: "#538D4E",
            borderRadius: 9999,
          }}
        />
      </div>

      {/* Auth zone */}
      <div className="px-6 pb-8" style={{ flex: "0 0 45%" }}>
        <div
          className="flex h-full flex-col justify-center"
          style={{
            border: "1px solid #3A3A4C",
            borderRadius: 24,
            padding: 24,
          }}
        >
          <button
            onClick={signIn}
            className="flex w-full items-center transition-transform active:scale-[0.98]"
            style={{
              height: 52,
              background: "#FFFFFF",
              color: "#0F0F14",
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 9999,
              padding: "0 12px",
            }}
          >
            <GoogleIcon />
            <span className="flex-1 text-center" style={{ marginLeft: -20 }}>
              Continue with Google
            </span>
          </button>

          <button
            onClick={signIn}
            className="mt-3 flex w-full items-center transition-transform active:scale-[0.98]"
            style={{
              height: 52,
              background: "transparent",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 9999,
              border: "1.5px solid #FFFFFF",
              padding: "0 12px",
            }}
          >
            <AppleIcon />
            <span className="flex-1 text-center" style={{ marginLeft: -20 }}>
              Continue with Apple
            </span>
          </button>

          <button
            onClick={() => navigate({ to: "/login" })}
            className="mx-auto mt-4 block"
            style={{
              color: "#A0A0B0",
              fontSize: 13,
              textDecoration: "underline",
            }}
          >
            Sign in with email
          </button>

          <p
            className="mt-auto pt-6 text-center"
            style={{ color: "#606070", fontSize: 11 }}
          >
            By continuing you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
