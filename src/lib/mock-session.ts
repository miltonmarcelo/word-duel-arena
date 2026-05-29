// Mock session helper for the WordClash visual prototype.
// No real backend/auth — just a localStorage flag so the loader can branch
// between the authenticated dashboard and the unauthenticated home screen.

const KEY = "wc_session";

export function hasMockSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setMockSession(active: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (active) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
