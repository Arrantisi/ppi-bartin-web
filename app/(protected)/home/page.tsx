"use client";

import { HomeContent } from "@/components/event/home/content";
import ProfileHome from "@/components/event/home/header";
import PWAInstallTour from "@/components/pwa-install-tour";
import { usePWAInstallTour } from "@/hooks/use-pwainstalltour";

const EventPage = () => {
  const { showTour, dismissTour, completeTour, triggerInstall } =
    usePWAInstallTour();
  return (
    <>
      <ProfileHome />
      <HomeContent />
      {showTour && (
        <PWAInstallTour
          onDismiss={dismissTour}
          onComplete={completeTour}
          onInstall={triggerInstall}
        />
      )}
    </>
  );
};

export default EventPage;
