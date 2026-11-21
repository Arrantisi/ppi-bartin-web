"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { deleteAccount } from "@/server/actions/profile";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteAccountButton = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleDelete = async () => {
		const confirmed = window.confirm(
			"Akun kamu akan dihapus permanen. Data yang hilang tidak dapat dipulihkan. Lanjutkan?",
		);

		if (!confirmed) return;

		setLoading(true);

		try {
			const result = await deleteAccount();

			if (result.success) {
				toast.success(result.message);
				await authClient.signOut({
					fetchOptions: {
						onSuccess: () => router.push("/login"),
					},
				});
				return;
			}

			toast.error(result.error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			variant="destructive"
			onClick={handleDelete}
			disabled={loading}
			className="w-full rounded-full border-transparent bg-danger text-bg hover:bg-danger/90"
		>
			{loading ? <Spinner className="size-4" /> : <IconTrash className="size-4" />}
			Hapus Akun
		</Button>
	);
};