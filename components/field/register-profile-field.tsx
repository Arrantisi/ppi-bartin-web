"use client";

import { formSchema, FormSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { ButtonField } from "../buttons";
import { completeProfile } from "@/server/actions/setting-user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const RegisterField = () => {
  const [loading, setLoading] = useState(false);
  // const [isVerified, setIsVerified] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      nomor_siswa: "",
      nama_siswa: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }: { value: FormSchema }) => {
      setLoading(true);

      const matched = await completeProfile(
        value.nomor_siswa,
        value.nama_siswa,
      );
      if (matched.status === "success") {
        toast.success("Berhasil", { description: matched.msg });
        router.push("/home");
      } else {
        toast.error("Gagal", { description: matched.msg });
      }

      setLoading(false);
    },
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <form
          className="space-y-4"
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="nama_siswa">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field className="space-y-2">
                  <FieldLabel className="text-sm font-medium">
                    Nama Lengkap
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="Masukkan nama sesuai ijazah/paspor"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription className="text-[12px] leading-tight">
                    Nama lengkap membantu sinkronisasi database lebih akurat.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="nomor_siswa">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field className="space-y-2">
                  <FieldLabel className="text-sm font-medium">
                    Nomor Öğrenci
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      placeholder="Contoh: 12345678"
                      className="focus-visible:ring-primary"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  <FieldDescription className="text-[12px] leading-tight">
                    Gunakan nomor öğrenci yang anda daftarkan saat pendaftaran
                    data diri di **PPI Bartın**.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </form>

        <div className="pt-2">
          <ButtonField formId="register-form" loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default RegisterField;
