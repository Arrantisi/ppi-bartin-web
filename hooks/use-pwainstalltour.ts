import { useState, useEffect } from "react";

const TOUR_KEY = "pwa_install_tour_v1";

// BeforeInstallPromptEvent tidak ada di tipe DOM standar, definisikan manual
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Fix 1: Cast Navigator untuk akses .standalone (Safari iOS)
const isRunningAsStandalone = (): boolean =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export function usePWAInstallTour() {
  // Fix 2: Hitung nilai awal di initializer useState, bukan di dalam useEffect
  // Ini menghindari setState sinkron dalam effect body
  const [isInstalled, setIsInstalled] = useState<boolean>(
    () => typeof window !== "undefined" && isRunningAsStandalone(),
  );
  const [showTour, setShowTour] = useState(false);
  // Fix 3 & 4: Tipe eksplisit untuk deferredPrompt
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Kalau sudah standalone, tidak perlu setup listener apapun
    if (isInstalled) return;

    // Cek apakah user sudah pernah lihat tour ini
    if (localStorage.getItem(TOUR_KEY)) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowTour(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Untuk Safari iOS / Firefox yang tidak support beforeinstallprompt
    const timer = setTimeout(() => {
      if (!localStorage.getItem(TOUR_KEY)) {
        setShowTour(true);
      }
    }, 1500);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowTour(false);
      localStorage.setItem(TOUR_KEY, "done");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const dismissTour = () => {
    setShowTour(false);
    localStorage.setItem(TOUR_KEY, "dismissed");
  };

  const completeTour = () => {
    setShowTour(false);
    localStorage.setItem(TOUR_KEY, "done");
  };

  const triggerInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      completeTour();
      return true;
    }
    return false;
  };

  return {
    showTour,
    isInstalled,
    deferredPrompt,
    dismissTour,
    completeTour,
    triggerInstall,
  };
}
