"use client";

import { formSchema, FormSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { ButtonField } from "../buttons";
import { completeProfile } from "@/lib/action";
import { toastManager } from "../ui/toast";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";

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
      toastManager.promise(
        new Promise<string>(async (resolve, rejects) => {
          const matched = await completeProfile(
            value.nomor_siswa,
            value.nama_siswa,
          );
          if (matched.status === "success") {
            resolve(matched.msg);
            router.push("/");
          } else {
            // Kita tetap lempar matched.msg ke reject agar bisa kita log di console jika perlu
            rejects(new Error(matched.msg));
          }
        }),
        {
          loading: {
            title: "Sedang Memverifikasi",
            description: "Mencocokkan data kamu dengan database PPI Bartin...",
          },
          success: () => ({
            title: "Verifikasi Berhasil",
            description: `Mantap! Data kamu sudah sesuai.`, // Tidak menampilkan msg server secara mentah
          }),
          error: () => ({
            title: "Data Tidak Cocok",
            description:
              "NIS atau Nama yang kamu masukkan tidak ditemukan di sistem. Silakan hubungi admin jika ini kesalahan.",
          }),
        },
      );

      setLoading(false);
    },
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Section */}

      <Card className="p-6 shadow-sm border-zinc-200">
        {" "}
        {/* Atau pakai shadcn Card component */}
        <div className="space-y-6">
          <form
            className="space-y-4"
            id="register-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field name="nomor_siswa">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field className="space-y-2">
                    <FieldLabel className="text-sm font-medium">
                      Nomor Siswa (NIS)
                    </FieldLabel>
                    <div className="relative">
                      {/* Contoh nambahin icon (opsional) */}
                      <Input
                        id={field.name}
                        placeholder="Contoh: 12345678"
                        className="focus-visible:ring-primary"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                    <FieldDescription className="text-[12px] leading-tight">
                      Gunakan nomor induk resmi yang terdaftar di **PPI
                      Bartın**.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </form>

          <div className="pt-2">
            <ButtonField formId="register-form" loading={loading} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegisterField;
