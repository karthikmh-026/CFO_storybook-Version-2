const AUTH_KEY = "cfo_storybook_auth";

// Demo-grade shared password gate — no backend/user accounts. Swap for real
// auth (FastAPI login endpoint + hashed passwords in Postgres) before this
// is ever exposed outside a trusted internal demo.
const PASSWORD = "pitti2026";

// A hard refresh (F5 / Ctrl+R) re-runs this module, unlike SPA route changes
// or clicking a link — use that to force a fresh login on every real reload.
const [navEntry] = performance.getEntriesByType("navigation");
if (navEntry?.type === "reload") {
  sessionStorage.removeItem(AUTH_KEY);
} 

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function authenticate(password) {
  if (password === PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}
