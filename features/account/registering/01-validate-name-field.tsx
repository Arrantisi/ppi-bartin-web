"use client";

import { formSchema, FormSchema } from "@/schemas/auth";
import { useForm } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ButtonField } from "@/components/buttons";
import { completeProfile } from "@/server/actions/setting-user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconUserCircle } from "@tabler/icons-react";

const ValidateNameField = () => {
  const [loading, setLoading] = useState(false);

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

      const matched = await completeProfile(value.nomor_siswa, value.nama_siswa);
      if (matched.success) {
        toast.success("Berhasil", { description: matched.message });
        router.push("/home");
      } else {
        toast.error("Gagal", { description: matched.error });
      }

      setLoading(false);
    },
  });

  return (
    <div className="w-full">
      <div className="space-y-6">
        <form
          className="space-y-6"
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="nomor_siswa">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconUserCircle size={18} className="text-primary" />
                    Nomor Öğrenci
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      id={field.name}
                      inputMode="numeric"
                      placeholder="Contoh: 12345678"
                      className="focus-visible:ring-primary"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  <FieldDescription className="footnote">
                    Gunakan nomor öğrenci yang anda daftarkan saat pendaftaran
                    data diri di **PPI Bartın**.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="nama_siswa">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconUserCircle size={18} className="text-primary" /> Nama
                    Lengkap
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="Masukkan nama sesuai ijazah/paspor"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription className="footnote">
                    Nama lengkap membantu sinkronisasi database lebih akurat.
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

export default ValidateNameField;
