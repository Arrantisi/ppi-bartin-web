"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formUsername, type FormUsername } from "@/schemas";
import { postUsername } from "@/server/actions/user";
import { useForm } from "@tanstack/react-form";
import { IconAt, IconSparkles } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const CompleteProfileField = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			username: "",
		},
		validators: {
			onSubmit: formUsername,
		},
		onSubmit: async ({ value }: { value: FormUsername }) => {
			setLoading(true);

			try {
				const result = await postUsername(value);

				if (result.status === "success") {
					toast.success("Username tersimpan", { description: result.msg });
					router.push("/complete-profile");
				} else {
					toast.error("Gagal menyimpan username", { description: result.msg });
				}
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<div className="w-full max-w-md mx-auto">
			<form
				id="complete-profile-form"
				className="space-y-5"
				onSubmit={(event) => {
					event.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.Field name="username">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field>
								<FieldLabel className="gap-1">
									<IconAt size={18} className="text-primary" />
									Username
									<span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									placeholder="contoh: naufalr"
									value={field.state.value}
									onChange={(event) => field.handleChange(event.target.value)}
								/>
								<FieldDescription className="text-[12px] leading-tight">
									Username ini akan tampil di profil dan dipakai untuk identitas akun kamu.
								</FieldDescription>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<Button
					type="submit"
					disabled={loading}
					className="w-full rounded-full text-sm capitalize"
				>
					{loading ? (
						<>
							<Spinner className="size-4" />
							Menyimpan
						</>
					) : (
						<>
							<IconSparkles className="size-4" />
							Simpan Username
						</>
					)}
				</Button>
			</form>
		</div>
	);
};

export default CompleteProfileField;