"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { registerPushSubscription } from "@/lib/push/client";
import {
  saveNotificationSubscription,
  getUserPushSubscriptions,
  deleteUserPushSubscriptions,
} from "@/server/actions/subscribe-notification";

export function usePushNotifications() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  useEffect(() => {
    getUserPushSubscriptions().then((res) => {
      setPushEnabled(res.hasSubscription);
    });
  }, []);

  const getSubtitle = useCallback(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      return "Browser tidak mendukung";
    }
    if (Notification.permission === "denied") {
      return "Izin diblokir — aktifkan lewat pengaturan browser";
    }
    return undefined;
  }, []);

  const toggle = useCallback(async (checked: boolean) => {
    if (pushLoading) return;

    if (checked) {
      setPushLoading(true);
      try {
        if (!("Notification" in window)) {
          toast.error("Browser tidak mendukung notifikasi");
          return;
        }

        let permission = Notification.permission;

        if (permission === "denied") {
          toast.error(
            "Izin notifikasi ditolak. Aktifkan melalui pengaturan browser.",
          );
          return;
        }

        if (permission === "default") {
          permission = await Notification.requestPermission();
          if (permission !== "granted") {
            toast.error("Izin notifikasi ditolak");
            return;
          }
        }

        const sub = await registerPushSubscription();
        if (!sub) {
          toast.error("Gagal mendaftarkan notifikasi");
          return;
        }

        const subJson = sub.toJSON();
        const result = await saveNotificationSubscription({
          endpoint: subJson.endpoint!,
          keys: {
            auth: subJson.keys!.auth,
            p256dh: subJson.keys!.p256dh,
          },
        });

        if (result.success) {
          setPushEnabled(true);
          toast.success("Notifikasi push telah diaktifkan");
        }
      } catch {
        toast.error("Terjadi kesalahan, coba lagi nanti");
      } finally {
        setPushLoading(false);
      }
    } else {
      setPushLoading(true);
      try {
        const result = await deleteUserPushSubscriptions();
        if (result.success) {
          setPushEnabled(false);
          toast.info("Notifikasi push dimatikan");
        }
      } catch {
        toast.error("Terjadi kesalahan, coba lagi nanti");
      } finally {
        setPushLoading(false);
      }
    }
  }, [pushLoading]);

  const isUnsupported =
    typeof window !== "undefined" &&
    (!("Notification" in window) || !("serviceWorker" in navigator));

  return {
    pushEnabled,
    pushLoading,
    toggle,
    getSubtitle,
    isUnsupported,
  };
}
