"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  IconRocket,
  IconBolt,
  IconDownload,
  IconShare3,
  IconPlus,
  IconDotsVertical,
  IconBrowser,
  IconCheck,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

type Step = {
  icon: Icon;
  title: string;
  desc: string;
  cta: string;
  isAction?: boolean;
};

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  return "desktop";
}

const nativeSteps: Step[] = [
  {
    icon: IconRocket,
    title: "Buka sebagai Aplikasi",
    desc: "Install aplikasi ini ke perangkatmu. Lebih cepat, bisa dipakai offline, dan langsung buka dari layar utama.",
    cta: "Lanjut",
  },
  {
    icon: IconBolt,
    title: "Kenapa install?",
    desc: "Tidak perlu buka browser lagi. Tampilan penuh tanpa address bar, notifikasi, dan loading lebih cepat karena data disimpan lokal.",
    cta: "Lanjut",
  },
  {
    icon: IconDownload,
    title: "Install sekarang",
    desc: "Klik tombol di bawah — browser akan meminta konfirmasi, lalu ikon aplikasi muncul di layar utamamu.",
    cta: "Install Aplikasi",
    isAction: true,
  },
];

const iosSteps: Step[] = [
  {
    icon: IconRocket,
    title: "Buka sebagai Aplikasi",
    desc: "Kamu bisa install aplikasi ini langsung ke Home Screen iPhone/iPad-mu — tanpa App Store.",
    cta: "Cara install",
  },
  {
    icon: IconShare3,
    title: "Tap tombol Share",
    desc: "Di Safari, ketuk ikon Share (kotak dengan panah ke atas) di bagian bawah layar.",
    cta: "Sudah",
  },
  {
    icon: IconPlus,
    title: 'Pilih "Add to Home Screen"',
    desc: 'Scroll ke bawah di menu Share, lalu ketuk "Add to Home Screen".',
    cta: "Sudah",
  },
  {
    icon: IconCheck,
    title: "Ketuk Add / Tambahkan",
    desc: 'Konfirmasi dengan mengetuk "Add" di pojok kanan atas. Selesai! Ikon aplikasi sudah ada di Home Screen.',
    cta: "Selesai",
    isAction: true,
  },
];

const androidSteps: Step[] = [
  {
    icon: IconRocket,
    title: "Buka sebagai Aplikasi",
    desc: "Install aplikasi ini ke HP Android-mu tanpa perlu Play Store.",
    cta: "Cara install",
  },
  {
    icon: IconDotsVertical,
    title: "Ketuk menu Chrome",
    desc: "Tap ikon tiga titik (⋮) di pojok kanan atas browser Chrome.",
    cta: "Sudah",
  },
  {
    icon: IconDownload,
    title: 'Pilih "Add to Home Screen"',
    desc: 'Cari dan ketuk opsi "Add to Home Screen" atau "Install App" di menu yang muncul.',
    cta: "Selesai",
    isAction: true,
  },
];

const desktopSteps: Step[] = [
  {
    icon: IconRocket,
    title: "Install sebagai App",
    desc: "Buka aplikasi ini seperti software desktop biasa — tanpa browser, langsung dari taskbar atau Dock.",
    cta: "Cara install",
  },
  {
    icon: IconBrowser,
    title: "Lihat ikon install di address bar",
    desc: "Di Chrome atau Edge, cari ikon ⊕ atau komputer kecil di ujung kanan address bar.",
    cta: "Sudah",
  },
  {
    icon: IconDownload,
    title: 'Klik "Install"',
    desc: 'Klik ikon tersebut lalu pilih "Install". Aplikasi akan terbuka di jendela sendiri.',
    cta: "Selesai",
    isAction: true,
  },
];

type TourContentProps = {
  steps: Step[];
  onDismiss: () => void;
  onComplete: () => void;
  onInstall: () => Promise<void>;
};

function TourContent({
  steps,
  onDismiss,
  onComplete,
  onInstall,
}: TourContentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [installing, setInstalling] = useState(false);
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const Icon = step.icon;

  const handlePrimary = async () => {
    if (step.isAction) {
      if (steps === nativeSteps) {
        setInstalling(true);
        await onInstall();
        setInstalling(false);
        onComplete();
      } else {
        onComplete();
      }
    } else {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  return (
    <div className="flex flex-col gap-6 px-1 py-2">
      <div className="flex items-center justify-center">
        <div
          className="flex items-center justify-center size-16 rounded-2xl"
          style={{ backgroundColor: "var(--accent-subtle)" }}
        >
          <Icon className="size-8" style={{ color: "var(--accent)" }} />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-text-primary">
          {step.title}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {step.desc}
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {steps.map((_, idx) => (
          <span
            key={idx}
            className={`rounded-full transition-all duration-300 ${
              idx === currentStep
                ? "w-8 h-2"
                : idx < currentStep
                  ? "w-2 h-2"
                  : "w-2 h-2"
            }`}
            style={{
              backgroundColor:
                idx === currentStep
                  ? "var(--accent)"
                  : idx < currentStep
                    ? "var(--accent)"
                    : "var(--text-disabled)",
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        {!isFirst && (
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
            className="flex-1"
          >
            Kembali
          </Button>
        )}
        {isFirst && (
          <Button variant="ghost" onClick={onDismiss} className="flex-1">
            Lewati
          </Button>
        )}
        <Button
          variant="default"
          onClick={handlePrimary}
          disabled={installing}
          className="flex-1"
          style={
            step.isAction
              ? {
                  backgroundColor: "var(--accent)",
                  borderColor: "var(--accent)",
                }
              : undefined
          }
        >
          {installing ? "Memasang..." : step.cta}
        </Button>
      </div>
    </div>
  );
}

interface PWAInstallTourProps {
  onDismiss: () => void;
  onComplete: () => void;
  onInstall: () => Promise<void>;
  hasNativePrompt: boolean;
}

export function PWAInstallTour({
  onDismiss,
  onComplete,
  onInstall,
  hasNativePrompt,
}: PWAInstallTourProps) {
  const isMobile = useIsMobile();

  const steps = hasNativePrompt ? nativeSteps : getManualSteps();

  const content = (
    <TourContent
      steps={steps}
      onDismiss={onDismiss}
      onComplete={onComplete}
      onInstall={onInstall}
    />
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) onDismiss();
  };

  if (isMobile) {
    return (
      <Sheet defaultOpen onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="rounded-t-2xl px-5 pb-8 pt-6"
        >
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog defaultOpen onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        {content}
      </DialogContent>
    </Dialog>
  );
}

function getManualSteps(): Step[] {
  const platform = detectPlatform();
  switch (platform) {
    case "ios":
      return iosSteps;
    case "android":
      return androidSteps;
    default:
      return desktopSteps;
  }
}
