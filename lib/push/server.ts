import webpush from "web-push";
import { prisma } from "@/lib/db";
import { studentAccount } from "@/server/actions/account";
import type { Role } from "@/lib/generated/prisma/enums";

export async function sendPushToAll({
	message,
	title,
	url,
}: {
	title: string;
	message: string;
	url: string;
}) {
	const { user } = await studentAccount();

	webpush.setVapidDetails(
		"mailto:admin@ppibartin.com",
		process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
		process.env.VAPID_PRIVATE_KEY!,
	);

	const subscriptions = await prisma.notificationSubscription.findMany({
		where: { userId: { not: user.id } },
	});

	if (subscriptions.length === 0) {
		console.log("Tidak ada user yang berlangganan.");
		return { success: true, count: 0 };
	}

	const notifications = subscriptions.map((sub) => {
		const pushConfig = {
			endpoint: sub.endpoint,
			keys: {
				auth: sub.auth,
				p256dh: sub.p256dh,
			},
		};

		const payload = JSON.stringify({
			title,
			body: message,
			url,
		});

		return webpush.sendNotification(pushConfig, payload).catch(async (error) => {
			if (error.statusCode === 410 || error.statusCode === 404) {
				await prisma.notificationSubscription.delete({
					where: { endpoint: sub.endpoint },
				});
			}
		});
	});

	await Promise.all(notifications);
	return { success: true, count: subscriptions.length };
}

export async function sendPushToRole({
	message,
	title,
	url,
	roles,
}: {
	title: string;
	message: string;
	url: string;
	roles: string[];
}) {
	webpush.setVapidDetails(
		"mailto:admin@ppibartin.com",
		process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
		process.env.VAPID_PRIVATE_KEY!,
	);

	const usersWithRole = await prisma.user.findMany({
		where: { role: { in: roles as Role[] } },
		select: { id: true },
	});

	if (usersWithRole.length === 0) return { success: true, count: 0 };

	const subscriptions = await prisma.notificationSubscription.findMany({
		where: { userId: { in: usersWithRole.map((u) => u.id) } },
	});

	if (subscriptions.length === 0) return { success: true, count: 0 };

	const notifications = subscriptions.map((sub) => {
		const pushConfig = {
			endpoint: sub.endpoint,
			keys: { auth: sub.auth, p256dh: sub.p256dh },
		};
		const payload = JSON.stringify({ title, body: message, url });

		return webpush.sendNotification(pushConfig, payload).catch(async (error) => {
			if (error.statusCode === 410 || error.statusCode === 404) {
				await prisma.notificationSubscription.delete({
					where: { endpoint: sub.endpoint },
				});
			}
		});
	});

	await Promise.all(notifications);
	return { success: true, count: subscriptions.length };
}
