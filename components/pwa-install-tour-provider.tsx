"use client";

import { useState, useEffect } from "react";
import { usePWAInstallTour } from "@/hooks/use-pwa-install-tour";
import { PWAInstallTourContextProvider } from "@/hooks/pwa-install-tour-context";
import { PWAInstallTour } from "@/components/pwa-install-tour";

export function PWAInstallTourProviderLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const {
    showTour,
    hasNativePrompt,
    dismissTour,
    completeTour,
    triggerInstall,
    replayTour,
  } = usePWAInstallTour();

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <PWAInstallTourContextProvider replayTour={replayTour}>
      {children}
      {showTour && (
        <PWAInstallTour
          onDismiss={dismissTour}
          onComplete={completeTour}
          onInstall={triggerInstall}
          hasNativePrompt={hasNativePrompt}
        />
      )}
    </PWAInstallTourContextProvider>
  );
}
