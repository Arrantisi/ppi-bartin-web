export async function registerPushSubscription() {
  if (!("serviceWorker" in navigator)) return;

  // 1. Daftar
  const registration = await navigator.serviceWorker.register("/sw.js");

  // 2. Tunggu sampai benar-benar READY
  await navigator.serviceWorker.ready;

  // 3. Subscribe
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  return subscription;
}
