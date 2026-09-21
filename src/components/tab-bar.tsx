import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Camera, History, LayoutGrid, Trophy } from "lucide-react";
import { useGarageStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Scan", icon: Camera, match: (p: string) => p === "/" || p === "/scan" },
  { to: "/collection", label: "Collection", icon: LayoutGrid, match: (p: string) => p === "/collection" || p.startsWith("/collection/") },
  { to: "/history", label: "History", icon: History, match: (p: string) => p === "/history" || p.startsWith("/history/") },
  { to: "/favourites", label: "Favourites", icon: Bookmark, match: (p: string) => p === "/favourites" || p.startsWith("/favourites/") },
  { to: "/trophies", label: "Trophies", icon: Trophy, match: (p: string) => p === "/trophies" || p.startsWith("/trophies/") },
] as const;

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const favouriteCount = useGarageStore((s) => {
    const ids = new Set(s.favouriteIds ?? []);
    return s.sightings.reduce((n, row) => n + (ids.has(row.id) ? 1 : 0), 0);
  });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-navy/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          const showCount = tab.to === "/favourites" && favouriteCount > 0;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                aria-current={active ? "page" : undefined}
                aria-label={
                  tab.to === "/favourites" && favouriteCount > 0
                    ? `Favourites, ${favouriteCount}`
                    : tab.label
                }
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 px-0.5 text-center text-[10px] font-medium leading-tight",
                  active ? "text-primary" : "text-muted",
                )}
              >
                <span className="relative">
                  <Icon
                    className="size-5"
                    strokeWidth={active ? 2.4 : 1.8}
                    fill={tab.to === "/favourites" && active ? "currentColor" : "none"}
                  />
                  {showCount ? (
                    <span className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full bg-primary px-1 text-center text-[9px] font-semibold leading-4 text-primary-fg">
                      {favouriteCount > 99 ? "99+" : favouriteCount}
                    </span>
                  ) : null}
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
