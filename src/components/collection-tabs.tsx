import { Link, useRouterState } from "@tanstack/react-router";

export function CollectionTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHistory = pathname === "/history" || pathname.startsWith("/history/");
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Link
        to="/collection"
        className={`flex min-h-12 items-center justify-center rounded-md font-display text-lg ${
          onHistory ? "border border-border" : "bg-primary text-primary-fg"
        }`}
      >
        Makes
      </Link>
      <Link
        to="/history"
        className={`flex min-h-12 items-center justify-center rounded-md font-display text-lg ${
          onHistory ? "bg-primary text-primary-fg" : "border border-border"
        }`}
      >
        History
      </Link>
    </div>
  );
}
