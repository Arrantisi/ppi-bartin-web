import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Icon,
  IconSquareRoundedNumber1,
  IconSquareRoundedNumber2,
  IconSparkleHighlight,
  IconSquareRoundedNumber3,
  IconBolt,
  IconArrowDown,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Platform = "ios" | "android" | "desktop";

type VisualKey =
  | "ios-share"
  | "ios-add"
  | "ios-confirm"
  | "android-menu"
  | "android-add"
  | "desktop-bar"
  | "desktop-install";

interface Step {
  id: string;
  icon: Icon;
  title: string;
  desc: string;
  cta: string;
  isAction?: boolean;
  visual?: VisualKey;
}

interface PWAInstallTourProps {
  onDismiss?: () => void;
  onComplete?: () => void;
  onInstall?: (() => Promise<boolean>) & { supportsPrompt?: boolean };
}

// ─── Deteksi platform user ────────────────────────────────────────────────────
function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  return "desktop";
}

// ─── Steps berdasarkan platform ───────────────────────────────────────────────
function getSteps(platform: Platform, hasNativePrompt: boolean): Step[] {
  if (hasNativePrompt) {
    return [
      {
        id: "intro",
        icon: IconSparkleHighlight,
        title: "Buka sebagai Aplikasi",
        desc: "Install aplikasi ini ke perangkatmu. Lebih cepat, bisa dipakai offline, dan langsung buka dari layar utama.",
        cta: "Lanjut",
      },
      {
        id: "benefit",
        icon: IconBolt,
        title: "Kenapa install?",
        desc: "Tidak perlu buka browser lagi. Tampilan penuh tanpa address bar, notifikasi, dan loading lebih cepat karena data disimpan lokal.",
        cta: "Lanjut",
      },
      {
        id: "install",
        icon: IconArrowDown,
        title: "Install sekarang",
        desc: "Klik tombol di bawah — browser akan meminta konfirmasi, lalu ikon aplikasi muncul di layar utamamu.",
        cta: "Install Aplikasi",
        isAction: true,
      },
    ];
  }

  if (platform === "ios") {
    return [
      {
        id: "intro",
        icon: IconSparkleHighlight,
        title: "Buka sebagai Aplikasi",
        desc: "Kamu bisa install aplikasi ini langsung ke Home Screen iPhone/iPad-mu — tanpa App Store.",
        cta: "Cara install",
      },
      {
        id: "step1",
        icon: IconSquareRoundedNumber1,
        title: "Tap tombol Share",
        desc: "Di Safari, ketuk ikon Share (kotak dengan panah ke atas) di bagian bawah layar.",
        visual: "ios-share",
        cta: "Sudah",
      },
      {
        id: "step2",
        icon: IconSquareRoundedNumber2,
        title: 'Pilih "Add to Home Screen"',
        desc: 'Scroll ke bawah di menu Share, lalu ketuk "Add to Home Screen" (Tambahkan ke Layar Utama).',
        visual: "ios-add",
        cta: "Sudah",
      },
      {
        id: "step3",
        icon: IconSquareRoundedNumber3,
        title: "Ketuk Add / Tambahkan",
        desc: 'Konfirmasi dengan mengetuk "Add" di pojok kanan atas. Selesai! Ikon aplikasi sudah ada di Home Screen.',
        visual: "ios-confirm",
        cta: "Selesai ✓",
        isAction: true,
      },
    ];
  }

  if (platform === "android") {
    return [
      {
        id: "intro",
        icon: IconSparkleHighlight,
        title: "Buka sebagai Aplikasi",
        desc: "Install aplikasi ini ke HP Android-mu tanpa perlu Play Store.",
        cta: "Cara install",
      },
      {
        id: "step1",
        icon: IconSquareRoundedNumber1,
        title: "Ketuk menu Chrome",
        desc: "Tap ikon tiga titik (⋮) di pojok kanan atas browser Chrome.",
        visual: "android-menu",
        cta: "Sudah",
      },
      {
        id: "step2",
        icon: IconSquareRoundedNumber2,
        title: 'Pilih "Add to Home Screen"',
        desc: 'Cari dan ketuk opsi "Add to Home Screen" atau "Install App" di menu yang muncul.',
        visual: "android-add",
        cta: "Selesai ✓",
        isAction: true,
      },
    ];
  }

  // Desktop
  return [
    {
      id: "intro",
      icon: IconSparkleHighlight,
      title: "Install sebagai App",
      desc: "Buka aplikasi ini seperti software desktop biasa — tanpa browser, langsung dari taskbar atau Dock.",
      cta: "Cara install",
    },
    {
      id: "step1",
      icon: IconSquareRoundedNumber1,
      title: "Lihat ikon install di address bar",
      desc: "Di Chrome atau Edge, cari ikon ⊕ atau komputer kecil di ujung kanan address bar.",
      visual: "desktop-bar",
      cta: "Sudah",
    },
    {
      id: "step2",
      icon: IconSquareRoundedNumber2,
      title: 'Klik "Install"',
      desc: 'Klik ikon tersebut lalu pilih "Install". Aplikasi akan terbuka di jendela sendiri.',
      visual: "desktop-install",
      cta: "Selesai ✓",
      isAction: true,
    },
  ];
}

// ─── Visual ilustrasi per step ────────────────────────────────────────────────
function StepVisual({ type }: { type: VisualKey }) {
  const base =
    "flex items-center justify-center rounded-lg bg-muted h-18 mb-4 text-sm text-muted-foreground gap-2.5 font-mono";

  const visuals: Record<VisualKey, React.ReactElement> = {
    "ios-share": (
      <div className={base}>
        <span className="text-xl">⎦</span>
        <span>Tombol Share — bawah layar Safari</span>
      </div>
    ),
    "ios-add": (
      <div className={base}>
        <span className="text-xl">＋</span>
        <span>&quot;Add to Home Screen&quot; di menu</span>
      </div>
    ),
    "ios-confirm": (
      <div className={base}>
        <span className="text-xl">✓</span>
        <span>Ketuk &quot;Add&quot; → ikon muncul</span>
      </div>
    ),
    "android-menu": (
      <div className={base}>
        <span className="text-xl">⋮</span>
        <span>Menu tiga titik Chrome</span>
      </div>
    ),
    "android-add": (
      <div className={base}>
        <span className="text-xl">↓</span>
        <span>&quot;Add to Home Screen&quot;</span>
      </div>
    ),
    "desktop-bar": (
      <div className={cn(base, "font-sans tracking-tight")}>
        <span className="text-xs opacity-60">https://app.kamu.com</span>
        <span className="text-base ml-1.5">⊕</span>
      </div>
    ),
    "desktop-install": (
      <div className={base}>
        <span className="text-xl">🖥</span>
        <span>Klik Install — buka di window sendiri</span>
      </div>
    ),
  };

  return visuals[type] ?? null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PWAInstallTour({
  onDismiss,
  onComplete,
  onInstall,
}: PWAInstallTourProps) {
  const [step, setStep] = useState(0);
  const [platform] = useState<Platform>(() => detectPlatform());
  const [visible, setVisible] = useState(false);

  const hasNativePrompt =
    typeof onInstall === "function" && !!onInstall.supportsPrompt;

  const steps = getSteps(platform, hasNativePrompt);
  const current = steps[step];
  const isDesktop = platform === "desktop";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleNext = async () => {
    if (current.isAction) {
      if (hasNativePrompt) {
        const installed = await onInstall?.();
        if (!installed) return;
      }
      handleComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleComplete = () => {
    setVisible(false);
    setTimeout(() => onComplete?.(), 300);
  };

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        className={cn(
          "fixed inset-0 bg-black/50 z-999 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-tour-title"
        className={cn(
          "fixed z-1000 bg-background box-border",
          "transition-[transform,opacity] duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]",
          // Desktop: center modal
          isDesktop
            ? cn(
                "bottom-1/2 left-1/2 w-[360px] rounded-2xl px-6 pb-8 pt-6",
                visible
                  ? "translate-x-[-50%] translate-y-[50%] opacity-100"
                  : "translate-x-[-50%] translate-y-[60%] opacity-0",
              )
            : // Mobile: bottom sheet
              cn(
                "bottom-0 left-0 right-0 rounded-t-[20px] px-6 pb-8 pt-6",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0",
              ),
        )}
      >
        {/* Handle bar — mobile only */}
        {!isDesktop && (
          <div className="w-9 h-1 bg-border rounded-full mx-auto -mt-2 mb-5" />
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg font-semibold text-primary">
            <current.icon />
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Tutup"
            className="text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none px-1 -mt-0.5 cursor-pointer bg-transparent border-none"
          >
            ×
          </button>
        </div>

        {/* Title */}
        <h2
          id="pwa-tour-title"
          className="text-lg font-semibold text-foreground tracking-tight m-0 mb-2"
        >
          {current.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed m-0 mb-4">
          {current.desc}
        </p>

        {/* Visual */}
        {current.visual && <StepVisual type={current.visual} />}

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5 items-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                i < step
                  ? "w-1.5 bg-base-300"
                  : i === step
                    ? "w-5 bg-primary"
                    : "w-1.5 bg-border",
              )}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 items-center">
          {step === 0 ? (
            <button
              onClick={handleDismiss}
              className="text-xs text-muted-foreground bg-transparent border-none cursor-pointer shrink-0 hover:text-foreground transition-colors"
            >
              Lewati
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-xs text-muted-foreground border border-border rounded-xl cursor-pointer px-3.5 py-2.5 shrink-0 bg-transparent hover:bg-muted transition-colors"
            >
              ← Kembali
            </button>
          )}

          <button
            onClick={handleNext}
            className={cn(
              "flex-1 text-primary-foreground border-none rounded-xl px-5 py-3 text-sm font-medium cursor-pointer tracking-tight transition-opacity hover:opacity-85",
              current.isAction ? "bg-primary" : "bg-foreground",
            )}
          >
            {current.cta}
          </button>
        </div>

        {/* Step counter */}
        <p className="text-center text-[11px] text-muted-foreground/50 mt-3.5 mb-0 tracking-widest">
          {step + 1} / {steps.length}
        </p>
      </div>
    </>
  );
}
