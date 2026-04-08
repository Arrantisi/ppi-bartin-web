"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogPopup,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/animate-ui/components/base/alert-dialog"; // Pastikan path ini sesuai projectmu
import { BellRing } from "lucide-react";
import { registerPushSubscription } from "@/lib/notifications";

export function NotificationAlert() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Cek apakah browser mendukung notifikasi
    if (!("Notification" in window)) return;

    // 2. Cek apakah user belum pernah memilih (status masih 'default')
    // Jika sudah 'granted' atau 'denied', jangan ganggu user lagi.
    if (Notification.permission === "default") {
      // Tambahkan sedikit delay agar tidak terlalu agresif saat web baru terbuka
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = async () => {
    try {
      // A. Ambil token dari browser
      const sub = await registerPushSubscription();

      if (!sub) return;

      // B. Kirim ke API Route kita pake fetch
      const response = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify(sub.toJSON()),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        alert("Alhamdulillah, Notif Aktif!");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Gagal:", error);
      alert("Terjadi kesalahan, cek console.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogPopup>
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="bg-blue-100 p-3 rounded-full mb-2">
            <BellRing className="h-6 w-6 text-blue-600" />
          </div>
          <AlertDialogTitle>Aktifkan Notifikasi?</AlertDialogTitle>
          <AlertDialogDescription>
            Jangan ketinggalan info kegiatan, berita penting, dan layanan
            terbaru dari PPI Bartin langsung di HP kamu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Nanti Saja
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAllow}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ya, Aktifkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
