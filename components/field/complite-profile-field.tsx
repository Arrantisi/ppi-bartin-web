"use client";

import { formSchema, FormSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
// import { matchingDataStudent } from "@/lib/action";
import { ButtonField } from "../buttons";
import { completeProfile } from "@/lib/action";
import { toastManager } from "../ui/toast";
import { useRouter } from "next/navigation";

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
            rejects(new Error(matched.msg));
          }
        }),
        {
          error: () => ({
            description: "Silahkan coba lagi",
            title: "Ada yang salah",
          }),
          loading: {
            description: "Mencocokkann data ke database",
            title: "Loading…",
          },
          success: (data: string) => ({
            description: `Berhasil: ${data}`,
            title: "Data kamu sesuai dengan database",
          }),
        },
      );

      setLoading(false);
    },
  });

  return (
    <div className=" w-full max-w-sm space-y-3">
      <div className="space-y-3">
        <form
          className="space-y-3"
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
                <Field aria-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="nomor siswa"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="nama_siswa">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field aria-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="nama kamu"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </form>

        <Field>
          <ButtonField formId="register-form" loading={loading} />
        </Field>
      </div>
    </div>
  );
};

export default RegisterField;
