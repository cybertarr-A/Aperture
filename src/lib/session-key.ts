const STORAGE = "aperture.groq.session";

export function readSessionKey(): string {
  try {
    return sessionStorage.getItem(STORAGE) ?? "";
  } catch {
    return "";
  }
}

export function writeSessionKey(key: string): void {
  try {
    if (!key) sessionStorage.removeItem(STORAGE);
    else sessionStorage.setItem(STORAGE, key);
  } catch {
    /* private mode */
  }
}

export function clearSessionKey(): void {
  writeSessionKey("");
}
