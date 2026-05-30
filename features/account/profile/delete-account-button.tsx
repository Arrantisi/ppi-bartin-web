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
			"Akun kamu akan dihapus permanen. Lanjutkan?",
		);

		if (!confirmed) return;

		setLoading(true);

		try {
			const result = await deleteAccount();

			if (result.status === "success") {
				toast.success(result.msg);
				await authClient.signOut({
					fetchOptions: {
						onSuccess: () => router.push("/login"),
					},
				});
				return;
			}

			toast.error(result.msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			type="button"
			variant="destructive"
			onClick={handleDelete}
			disabled={loading}
			className="w-full rounded-full"
		>
			{loading ? <Spinner className="size-4" /> : <IconTrash className="size-4" />}
			Hapus Akun
		</Button>
	);
};