import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { RankUp } from "./rank-up";
import { Splash } from "./splash";
import { TabBar } from "./tab-bar";
import { useGarageStore } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      const store = useGarageStore.getState();
      if (!store.seeded) store.applySeed();
      store.ensureDay();
      store.completeOnboarding();
      store.setHydrated();
      setReady(true);
    };
    const unsub = useGarageStore.persist.onFinishHydration(finish);
    void useGarageStore.persist.rehydrate();
    if (useGarageStore.persist.hasHydrated()) finish();
    const onVis = () => {
      if (document.visibilityState === "visible") useGarageStore.getState().ensureDay();
    };
    document.addEventListener("visibilitychange", onVis);
    const tick = window.setInterval(() => useGarageStore.getState().ensureDay(), 30_000);
    return () => {
      unsub();
      document.removeEventListener("visibilitychange", onVis);
      window.clearInterval(tick);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-navy text-fg">
      {ready ? (
        <>
          <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col tab-safe">
            <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
          </div>
          {splashDone ? <TabBar /> : null}
          <RankUp />
          <Toaster
            theme="dark"
            position="top-center"
            toastOptions={{
              className: "bg-navy-2 text-fg border-border",
            }}
          />
        </>
      ) : null}
      {splashDone ? null : <Splash onDone={() => setSplashDone(true)} />}
    </div>
  );
}
