"use client";

import { useState, useEffect } from "react";

const TOUR_KEY = "pwa_install_tour_v1";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  platforms: string[];
}

export function usePWAInstallTour() {
  const [showTour, setShowTour] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const hasNativePrompt = !!deferredPrompt;

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    const alreadySeen = localStorage.getItem(TOUR_KEY);
    if (alreadySeen) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowTour(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    const timer = setTimeout(() => {
      if (!localStorage.getItem(TOUR_KEY)) {
        setShowTour(true);
      }
    }, 1500);

    const handleInstalled = () => {
      setShowTour(false);
      localStorage.setItem(TOUR_KEY, "done");
    };

    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
      clearTimeout(timer);
    };
  }, []);

  const dismissTour = () => {
    setShowTour(false);
    localStorage.setItem(TOUR_KEY, "dismissed");
  };

  const completeTour = () => {
    setShowTour(false);
    localStorage.setItem(TOUR_KEY, "done");
  };

  const replayTour = () => {
    setShowTour(true);
  };

  const triggerInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      completeTour();
    }
  };

  return {
    showTour,
    hasNativePrompt,
    dismissTour,
    completeTour,
    triggerInstall,
    replayTour,
  };
}
