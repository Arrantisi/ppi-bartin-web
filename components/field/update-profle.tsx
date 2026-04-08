"use client";

import { TupdateProfileSchema, updateProfileSchema } from "@/schemas";
import "react-phone-number-input/style.css";
import { TgetProfileUser } from "@/server/data/users";
import { useForm } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import {
  IconBook2,
  IconBuilding,
  IconCalendar,
  IconFileCheck,
  IconGenderBigender,
  IconIdBadge2,
  IconLanguage,
  IconMail,
  IconPhone,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { TanggalLahitField } from "../event/profile/update/tanggal-lahir";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PhoneInput } from "../ui/phone-input";
import { updateProfile } from "@/server/actions/user";
import { goeyToast } from "../ui/goey-toaster";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { UploadPhotoProfile } from "../event/uploader/upload-photo-profile";
import {
  SelectAngkatan,
  SelectFakultas,
  SelectJurusan,
  SelectStatusPelajar,
} from "../selects";

const items = [{ value: "pria" }, { value: "wanita" }];

export const UpdateProfileField = ({ ...props }: TgetProfileUser) => {
  const [isFakultas, setIsFakultas] = useState(props.fakultas || "");
  const [lenghtOfBio, setLengthOfBio] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      fakultas: props.fakultas || "",
      statusPelajar: props.statusPelajar || "",
      angkatan: props.angkatan || "",
      jurusan: props.jurusan || "",
      fileKey: props.image || "",
      email: props.email,
      fullname: props.name || "",
      noSiswa: props.nomorSiswa || "",
      username: props.username || "",
      Bio: props.bio ?? undefined,
      alamat: props.alamat ?? undefined,
      jenisKelamin: props.jenisKelamin ?? undefined,
      telpon: props.noTelephone ?? undefined,
      tanggalLahir: props.tanggalLahir ?? undefined,
    },
    validators: {
      onChange: updateProfileSchema,
    },
    onSubmit: async ({ value }: { value: TupdateProfileSchema }) => {
      setIsLoading(true);
      const fetch = await updateProfile(value);
      if (fetch.status === "error") {
        goeyToast.error("kesalahan", { description: fetch.msg });
      } else if (fetch.status === "success") {
        goeyToast.success("Profile kamu sudah up to date");
        router.push("/home/profile");
      }
      setIsLoading(false);
    },
  });
  return (
    <div>
      <form
        id="update-profile-field"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="fileKey">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <UploadPhotoProfile
                  value={field.state.value}
                  onValueChange={(e) => field.handleChange(e)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="bg-accent/50 py-6 px-5 space-y-1 my-3">
          <h3 className="text-[15px] leading-3.75 font-semibold">
            Informasi Pribadi
          </h3>
          <p className="text-[12px] leading-4.5 text-foreground/40">
            Data diri yang akan ditampilkan di profil
          </p>
        </div>

        <div className="mx-3 space-y-5">
          <form.Field name="fullname">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="gap-1">
                    <IconUser size={18} className="text-primary" /> Nama Lengkap
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    disabled
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="username">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="gap-1">
                    <IconUser size={18} className="text-primary" />
                    Username
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="gap-1">
                    <IconMail size={18} className="text-primary" />
                    Email
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    disabled
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>
                    Username unik untuk profil kamu
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="telpon">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="gap-1">
                    <IconPhone size={18} className="text-primary" />
                    Nomor Telephone
                  </FieldLabel>
                  <PhoneInput
                    type="tel"
                    placeholder="masukkan nomor telpon"
                    defaultCountry="TR"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e)}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="noSiswa">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="gap-1">
                    <IconIdBadge2 size={18} className="text-primary" />
                    Nomor Siswa
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    disabled
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        {/* data akademik stage */}
        <div className="bg-accent/50 py-6 px-5 space-y-1 my-6">
          <h3 className="text-[15px] leading-3.75 font-semibold">
            Data Akademik
          </h3>
          <p className="text-[12px] leading-4.5 text-foreground/40">
            Informasi tambahan untuk akademik
          </p>
        </div>
        <div className="mx-3 space-y-5">
          <div className="grid grid-cols-2 items-center gap-2">
            <form.Field name="fakultas">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconBuilding size={18} className="text-primary" />
                      Fakultas <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(e) => {
                        field.handleChange(e);
                        setIsFakultas(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Fakultas" />
                      </SelectTrigger>
                      <SelectFakultas />
                    </Select>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="jurusan">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconBook2 size={18} className="text-primary" />
                      Jurusan <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="jurusan" />
                      </SelectTrigger>
                      <SelectJurusan fakultas={isFakultas} />
                    </Select>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>
          <div className="flex items-center gap-2">
            <form.Field name="angkatan">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconCalendar size={18} className="text-primary" />
                      Angkatan <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(e) => field.handleChange(e)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="angkatan" />
                      </SelectTrigger>
                      <SelectAngkatan />
                    </Select>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="statusPelajar">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconLanguage size={18} className="text-primary" />
                      Status Pelajar <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="status pelajar" />
                      </SelectTrigger>
                      <SelectStatusPelajar />
                    </Select>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>
        </div>

        {/* detail pribadi stage */}
        <div className="bg-accent/50 py-6 px-5 space-y-1 my-6">
          <h3 className="text-[15px] leading-3.75 font-semibold">
            Detail Pribadi
          </h3>
          <p className="text-[12px] leading-4.5 text-foreground/40">
            Informasi tambahan untuk profil
          </p>
        </div>

        <div className="mx-3 space-y-5">
          <div className="flex items-center gap-2">
            <form.Field name="tanggalLahir">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconCalendar size={18} className="text-primary" />
                      Tanggal Lahir
                    </FieldLabel>
                    <TanggalLahitField
                      value={field.state.value}
                      onChange={(e) => {
                        if (e) field.handleChange(e);
                      }}
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="jenisKelamin">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconGenderBigender size={18} className="text-primary" />
                      Jenis Kelamiin
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {items.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value || ""}
                            >
                              {item.value}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>
          <form.Field name="Bio">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="gap-1">
                    <IconUser size={18} className="text-primary" />
                    Bio
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Tulis bio singkat tentang diri kamu..."
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setLengthOfBio(e.target.value.length);
                    }}
                    className="min-h-29"
                  />
                  <div className="flex justify-between items-center">
                    <FieldDescription>
                      Ceritakan tentang diri kamu
                    </FieldDescription>
                    <FieldDescription>{lenghtOfBio}/200</FieldDescription>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="alamat">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconUsers size={18} className="text-primary" />
                    Alamat Lengkap
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Bartın, Turkey"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-18.75"
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
      </form>
      <div className="mx-3 mt-5">
        <Button
          type="submit"
          form="update-profile-field"
          className="text-[14px] leading-6 w-full rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className="size-4.5" />
          ) : (
            <IconFileCheck size={18} className="text-primary" />
          )}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
};
