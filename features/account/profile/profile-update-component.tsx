"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateProfileField } from "@/components/field/account-related/update-profile";
import { getProfileUser } from "@/server/data/users";
import { useQuery } from "@tanstack/react-query";
import { IconArrowNarrowLeft, IconShieldLock } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { DeleteAccountButton } from "./delete-account-button";

export const UpdateProfileComponent = () => {
	const router = useRouter();

	const { data: user } = useQuery({
		queryKey: ["getUpdateProfile"],
		queryFn: () => getProfileUser(),
	});

	if (!user) {
		return null;
	}

	return (
		<div className="mb-16 space-y-6">
			<div className="relative flex items-center justify-center m-3">
				<h1 className="title-tiga">Edit Profile</h1>
				{user.username && (
					<Button
						variant="outline"
						onClick={() => router.push("/home/profile")}
						className="absolute left-0 top-0 rounded-full shadow-xl"
					>
						<IconArrowNarrowLeft />
					</Button>
				)}
			</div>

			<UpdateProfileField {...user} />

			<Card className="border-destructive/30 bg-destructive/5">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-destructive">
						<IconShieldLock className="size-5 text-destructive" />
						Danger Zone
					</CardTitle>
					<CardDescription>
						Tindakan ini akan menghapus akun dan semua data terkait akun kamu. Tindakan ini tidak dapat dibatalkan.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DeleteAccountButton />
				</CardContent>
			</Card>
		</div>
	);
};