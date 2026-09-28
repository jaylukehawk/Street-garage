import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <main className="px-5 pt-6 pb-10">
      <p className="font-display text-xs tracking-[0.32em] text-silver">LEGAL</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide">Privacy</h1>
      <p className="mt-2 text-sm text-muted">Last updated 28 September 2026</p>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-silver">
        <p>
          Street Garage is a car-spotting game from Hawkz Gaming. This page is the
          privacy policy for the app and the website.
        </p>
        <h2 className="font-display text-xl text-fg">What we collect</h2>
        <p>
          Photos you take to identify a car. Approximate make, model, colour and
          year returned by the identifier. Optional map coordinates if you allow
          location. Garage progress (parts, builds, decals, cogs) stored on your
          device. An account email if you sign in.
        </p>
        <h2 className="font-display text-xl text-fg">What we do not collect</h2>
        <p>
          Number plate text is never read or stored. People in a photo are not
          identified. We do not look up vehicle owners or DVLA records.
        </p>
        <h2 className="font-display text-xl text-fg">How photos are used</h2>
        <p>
          A scan photo is sent to our identify service so the app can name the
          car. Visible plates are covered on saved sightings. Photos are not sold
          and are not used to train public models for advertising.
        </p>
        <h2 className="font-display text-xl text-fg">Where data lives</h2>
        <p>
          Garage progress is saved in your browser on this device. If you create
          an account, login details are stored with our auth provider so you can
          sign back in.
        </p>
        <h2 className="font-display text-xl text-fg">Permissions</h2>
        <p>
          Camera is used only when you scan. Location is optional and only stored
          with a sighting if you allow it. You can refuse either permission and
          still use the rest of the garage.
        </p>
        <h2 className="font-display text-xl text-fg">Children</h2>
        <p>Street Garage is not directed at children under 13.</p>
        <h2 className="font-display text-xl text-fg">Contact</h2>
        <p>
          Hawkz Gaming. Use the Play Store listing contact email or the in-app
          settings page if you need data removed from a signed-in account.
        </p>
      </div>

      <Link
        to="/settings"
        className="mt-8 flex min-h-12 items-center justify-center rounded-md border border-border font-display text-lg"
      >
        Back to Settings
      </Link>
    </main>
  );
}
