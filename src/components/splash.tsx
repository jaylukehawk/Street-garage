import { useEffect, useRef, useState } from "react";

const SPLASH_MS = 4000;
const SKIP_AFTER_MS = 400;
const SEEN_KEY = "street-garage-splash-seen";
const START_KEY = "__sgSplashStart";

function splashStart() {
  const w = window as Window & { [START_KEY]?: number };
  if (!w[START_KEY]) w[START_KEY] = Date.now();
  return w[START_KEY];
}

export function Splash({ onDone }: { onDone: () => void }) {
  const finished = useRef(false);
  const seenBefore = useRef(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    try {
      seenBefore.current = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seenBefore.current = false;
    }
    const start = splashStart();
    const left = (ms: number) => Math.max(0, start + ms - Date.now());
    const skipTimer = window.setTimeout(() => {
      if (seenBefore.current) setCanSkip(true);
    }, left(SKIP_AFTER_MS));
    const endTimer = window.setTimeout(() => finish(), left(SPLASH_MS));
    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(endTimer);
    };
  }, []);

  function finish() {
    if (finished.current) return;
    finished.current = true;
    const w = window as Window & { [START_KEY]?: number };
    delete w[START_KEY];
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    onDone();
  }

  return (
    <div
      className="splash"
      role="button"
      tabIndex={0}
      onClick={() => {
        if (canSkip) finish();
      }}
      onKeyDown={(e) => {
        if (canSkip && (e.key === "Enter" || e.key === " ")) finish();
      }}
      aria-label="Hawkz Gaming"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        margin: 0,
        border: 0,
        width: "100%",
        minHeight: "100dvh",
        background: "#000",
        color: "#fff",
      }}
    >
      <span className="splash-glow" aria-hidden="true" />
      <span className="splash-mark">
        <img src="/hawkz-logo.png" alt="Hawkz Gaming" className="splash-eagle" />
        <span className="splash-game">
          STREET
          <br />
          GARAGE
        </span>
      </span>
    </div>
  );
}
