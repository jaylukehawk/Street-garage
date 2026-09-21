import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/app-shell";
import appCss from "../styles.css?url";

const APP_NAME = "Street Garage";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#000000" },
      { name: "color-scheme", content: "dark" },
      { name: "description", content: "Photograph cars you see. Build your garage. Earn metal for each make." },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    styles: [
      {
        children:
          "html,body{background:#000;color:#fff;margin:0;min-height:100dvh;color-scheme:dark}",
      },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" style={{ background: "#000", colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-black text-fg" style={{ background: "#000", color: "#fff", margin: 0, minHeight: "100dvh" }}>
        <PreviewHostBridge />
        <AuthProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
