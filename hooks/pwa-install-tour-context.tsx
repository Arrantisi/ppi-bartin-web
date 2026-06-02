"use client";

import { createContext, useContext } from "react";

type PWAInstallTourContextType = {
  replayTour: () => void;
};

const PWAInstallTourContext = createContext<PWAInstallTourContextType>({
  replayTour: () => {},
});

export function usePWAInstallTourContext() {
  return useContext(PWAInstallTourContext);
}

export function PWAInstallTourContextProvider({
  replayTour,
  children,
}: {
  replayTour: () => void;
  children: React.ReactNode;
}) {
  return (
    <PWAInstallTourContext.Provider value={{ replayTour }}>
      {children}
    </PWAInstallTourContext.Provider>
  );
}
