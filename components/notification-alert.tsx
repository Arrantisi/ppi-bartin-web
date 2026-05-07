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
import { toast } from "sonner";
import { saveNotificationSubscription } from "@/server/actions/subscribe-notification";

export function NotificationAlert() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Cek apakah browser mendukung notifikasi
    if (!("Notification" in window)) return;

    // 2. Cek apakah user belum pernah memilih (status masih 'default')
    // Jika sudah 'granted' atau 'denied', jangan ganggu user lagi.
    if (Notification.permission === "default") {
      // Tambahkan sedikit delay agar tidak terlalu agresif saat web baru terbuka
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = async () => {
    try {
      // A. Ambil token dari browser
      const sub = await registerPushSubscription();

      if (!sub) return;

      const subJson = sub.toJSON();

      // B. Kirim ke API Route kita pake fetch
      const result = await saveNotificationSubscription({
        endpoint: subJson.endpoint!,
        keys: {
          auth: subJson.keys!.auth,
          p256dh: subJson.keys!.p256dh,
        },
      });

      if (result.success) {
        toast.success("Notifikasi telah aktif");
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
          <div className="bg-primary-100 p-3 rounded-full mb-2">
            <BellRing className="h-6 w-6 text-primary-600" />
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
          <AlertDialogAction onClick={handleAllow}>
            Ya, Aktifkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
