"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  AdminLink,
  ButtonSettings,
  DeleteAccount,
  ThemeToggle,
} from "../buttons";
import { useForm } from "@tanstack/react-form";
import {
  GantiNamaSiswaSchema,
  gantiNamaSiswaSchema,
  GantiNomorSiswaSchema,
  gantiNomorSiswaSchema,
} from "@/schemas";
import { useState } from "react";
import { toastManager } from "../ui/toast";
import { gantiNamaSiswaAction, gantiNomorSiswaAction } from "@/lib/action";
import { Field, FieldError } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export const GantiNamaSiswaCard = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: { nama_siswa: "" },
    validators: { onSubmit: gantiNamaSiswaSchema },
    onSubmit: async ({ value }: { value: GantiNamaSiswaSchema }) => {
      setLoading(true);
      toastManager.promise(
        new Promise<string>(async (resolve, rejects) => {
          const matched = await gantiNamaSiswaAction(value.nama_siswa);
          if (matched.status === "success") {
            resolve(matched.msg);
            router.refresh();
            form.reset();
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
            description: "memasukan data ke database",
            title: "Loading…",
          },
          success: (data: string) => ({
            description: `Berhasil: ${data}`,
            title: "Data kamu sudah disimpan",
          }),
        },
      );
      setLoading(false);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-2xl">Nama Lengkap</CardTitle>
        <CardDescription>Ganti nama kamu sesuai yg kamu mau</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="ganti-nama-field"
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
                <Field aria-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="tulis nama kamu disini"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </form>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <p className="font-sm text-sm flex items-center">
            Ada masalah tanya admin &nbsp;
            <AdminLink />
          </p>{" "}
        </div>
        <ButtonSettings type="submit" form="ganti-nama-field">
          {loading && <Spinner />} Save
        </ButtonSettings>
      </CardFooter>
    </Card>
  );
};

export const GantiNomorSiswaCard = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: { nomor_siswa: "" },
    validators: { onSubmit: gantiNomorSiswaSchema },
    onSubmit: async ({ value }: { value: GantiNomorSiswaSchema }) => {
      setLoading(true);
      toastManager.promise(
        new Promise<string>(async (resolve, rejects) => {
          const matched = await gantiNomorSiswaAction(value.nomor_siswa);
          if (matched.status === "success") {
            resolve(matched.msg);
            router.refresh();
            form.reset();
          } else {
            rejects(new Error(matched.msg));
          }
        }),
        {
          error: (data: string) => ({
            description: `${data}`,
            title: "Ada yang salah",
          }),
          loading: {
            description: "memasukan data ke admin",
            title: "Loading…",
          },
          success: (data: string) => ({
            description: `Berhasil: ${data}`,
            title: "Data kamu sudah disimpan",
          }),
        },
      );
      setLoading(false);
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-2xl">Nomor Mahasiswa</CardTitle>
        <CardDescription>Ganti Nomor mahasiswa kamu disini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          id="ganti-nomor-field"
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
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="tulis nomor kamu disini"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </form>
        <div className="border rounded-lg flex items-center gap-3 p-3">
          <IconAlertSquareRounded className="text-warning" />
          <span className="text-foreground max-w-2xl text-sm">
            Gunakan nomor siswa resmi dari sekolah. Data ini penting untuk
            memverifikasi status keanggotaan kamu di sistem PPI Bartin.
          </span>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <p className="font-sm text-sm flex items-center">
            Ada masalah tanya admin &nbsp;
            <AdminLink />
          </p>{" "}
        </div>
        <ButtonSettings type="submit" form="ganti-nomor-field">
          {loading && <Spinner />} Save
        </ButtonSettings>
      </CardFooter>
    </Card>
  );
};

export const GantiTema = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-2xl">Tema</CardTitle>
        <CardDescription>Ganti tema kamu disini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ThemeToggle />
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <p className="font-sm text-sm flex items-center">
            Ada masalah tanya admin &nbsp;
            <AdminLink />
          </p>{" "}
        </div>
      </CardFooter>
    </Card>
  );
};

export const HapusAccount = () => {
  return (
    <Card className="border-destructive py-0 pt-6">
      <CardHeader>
        <CardTitle className="font-2xl">Hapus Account</CardTitle>
        <CardDescription>hapus akun kamu disini disini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="border rounded-lg flex items-center gap-3 p-3">
          <IconAlertSquareRounded className="text-warning" />
          <span className="text-foreground max-w-2xl text-sm">
            Gunakan nomor siswa resmi dari sekolah. Data ini penting untuk
            memverifikasi status keanggotaan kamu di sistem PPI Bartin.
          </span>
        </div>
      </CardContent>
      <div className="relative bg-destructive/40 py-4">
        <Separator className="absolute top-0 bg-destructive" />
        <CardFooter className="flex justify-end">
          <DeleteAccount />
        </CardFooter>
      </div>
    </Card>
  );
};
