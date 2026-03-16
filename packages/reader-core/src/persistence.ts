/**
 * IndexedDB persistence for preferences and last read position per document.
 * No auth, no remote DB—local-first only.
 */

const DB_NAME = "readalong-db";
const DB_VERSION = 1;
const PREFS_STORE = "prefs";
const POSITIONS_STORE = "positions";

export interface StoredPrefs {
  speed: number;
  voiceId: string;
  theme?: "light" | "dark";
}

export interface StoredPosition {
  documentId: string;
  currentChunkIndex: number;
  updatedAt: number;
}

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB not available"));
  }
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PREFS_STORE)) {
        db.createObjectStore(PREFS_STORE, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(POSITIONS_STORE)) {
        db.createObjectStore(POSITIONS_STORE, { keyPath: "documentId" });
      }
    };
  });
}

export async function loadPrefs(): Promise<Partial<StoredPrefs>> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PREFS_STORE, "readonly");
      const req = tx.objectStore(PREFS_STORE).get("prefs");
      req.onsuccess = () => resolve((req.result?.value as Partial<StoredPrefs>) ?? {});
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch {
    return {};
  }
}

export async function savePrefs(prefs: StoredPrefs): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PREFS_STORE, "readwrite");
      tx.objectStore(PREFS_STORE).put({ key: "prefs", ...prefs });
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

export async function loadPosition(documentId: string): Promise<number | null> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(POSITIONS_STORE, "readonly");
      const req = tx.objectStore(POSITIONS_STORE).get(documentId);
      req.onsuccess = () => {
        const r = req.result as StoredPosition | undefined;
        resolve(r?.currentChunkIndex ?? null);
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch {
    return null;
  }
}

export async function savePosition(documentId: string, currentChunkIndex: number): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(POSITIONS_STORE, "readwrite");
      tx.objectStore(POSITIONS_STORE).put({
        documentId,
        currentChunkIndex,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}
