export async function registerPushSubscription() {
	if (!("serviceWorker" in navigator)) return;

	const registration = await navigator.serviceWorker.register("/sw.js");
	await navigator.serviceWorker.ready;

	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
	});

	return subscription;
}
