export const STORAGE_KEYS = {
  mode: "bassdojo:mode",
  dark: "bassdojo:dark",
  stageNotes: "bassdojo:stage-notes",
  stageCue: "bassdojo:stage-cue",
  trainLastTab: "bassdojo:train:lastTab",
  trainLastSession: "bassdojo:train:lastSession",
  trainHistory: "bassdojo:train:history",
  instrument: "bassdojo:instrument",
  fretboardFilter: "bassdojo:fretboard:filter",
  schemaVersion: "bassdojo:schemaVersion",
};

export const STORAGE_VERSION = 1;

const hasStorage = () => typeof window !== "undefined" && "localStorage" in window;

export function migrateIfNeeded() {
  if (!hasStorage()) return;
  try {
    const current = window.localStorage.getItem(STORAGE_KEYS.schemaVersion);
    const target = String(STORAGE_VERSION);
    if (current !== target) {
      window.localStorage.setItem(STORAGE_KEYS.schemaVersion, target);
    }
  } catch (error) {
    console.warn("[storage] migrateIfNeeded failed", error);
  }
}

export function getString(key, fallback = "") {
  if (!hasStorage()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

export function setString(key, value) {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(key, String(value));
  } catch (error) {
    console.warn("[storage] setString failed", error);
  }
}

export function getBool(key, fallback = false) {
  if (!hasStorage()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return fallback;
    if (value === true || value === false) return Boolean(value);
    const normalized = String(value).toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
    return fallback;
  } catch (error) {
    return fallback;
  }
}

export function setBool(key, value) {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(key, value ? "true" : "false");
  } catch (error) {
    console.warn("[storage] setBool failed", error);
  }
}

export function getJSON(key, fallback = null) {
  if (!hasStorage()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return fallback;
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

export function setJSON(key, value) {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("[storage] setJSON failed", error);
  }
}

