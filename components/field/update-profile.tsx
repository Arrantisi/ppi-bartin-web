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
import { toast } from "sonner";

const jenisKelaminItems = ["laki-laki", "perempuan"];

export const UpdateProfileField = ({
  mode = "edit",
  ...props
}: Partial<TgetProfileUser> & { mode?: "edit" | "onboarding" } = {}) => {
  const isOnboarding = mode === "onboarding";
  const submitButtonLabel = isOnboarding ? "Selesaikan Profil" : "Simpan Perubahan";
  const loadingLabel = isOnboarding ? "Menyimpan..." : undefined;
  const successToastTitle = isOnboarding
    ? "Profil berhasil dilengkapi"
    : "Profile kamu sudah up to date";
  const successToastDescription = isOnboarding ? "Selamat datang!" : undefined;
  const successRedirectTo = isOnboarding ? "/home" : "/home/profile";
  const emailDescription = "Email yang terdaftar tidak dapat diubah. Hubungi admin jika ingin mengganti email.";
  const bioLabel = "Bio (Opsional)";
  const bioPlaceholder = "Tulis bio singkat tentang diri kamu...";
  const bioDescription = "Ceritakan tentang diri kamu";
  const bioCounterLimit = 200;
  const addressLabel = "Alamat (Opsional)";
  const addressPlaceholder = "Masukkan alamat lengkap anda";
  const genderLabel = "Jenis Kelamin";
  const telponFallback = "";
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
      email: props.email ?? "",
      fullname: props.name || "",
      noSiswa: props.nomorSiswa || "",
      username: props.username || "",
      Bio: props.bio ?? undefined,
      alamat: props.alamat ?? undefined,
      jenisKelamin: props.jenisKelamin || "",
      telpon: props.noTelephone ?? telponFallback,
      tanggalLahir: (props.tanggalLahir
        ? new Date(props.tanggalLahir)
        : (undefined as unknown as Date)) as Date,
    },
    validators: {
      onChange: updateProfileSchema,
    },
    onSubmit: async ({ value }: { value: TupdateProfileSchema }) => {
      setIsLoading(true);
      const fetch = await updateProfile(value);
      if (fetch.status === "error") {
        toast.error("kesalahan", { description: fetch.msg });
      } else if (fetch.status === "success") {
        if (successToastDescription) {
          toast.success(successToastTitle, { description: successToastDescription });
        } else {
          toast.success(successToastTitle);
        }
        router.push(successRedirectTo);
      }
      setIsLoading(false);
    },
  });
  return (
    <div className="w-full">
      <form
        className="space-y-6"
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

        <div className="w-full px-4 sm:px-6 space-y-5">
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
                    {emailDescription}
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
                    Nomor Whatsapp
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <PhoneInput
                    type="tel"
                    placeholder="masukkan whatsapp yang anda gunakan untuk grup PPI Bartin"
                    defaultCountry="TR"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e)}
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
        <div className="w-full px-4 sm:px-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center md:gap-4">
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
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center md:gap-4">
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
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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

        <div className="w-full px-4 sm:px-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center md:gap-4">
            <form.Field name="tanggalLahir">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field className="min-w-0 flex-1">
                    <FieldLabel>
                      <IconCalendar size={18} className="text-primary" />
                      Tanggal Lahir <span className="text-destructive">*</span>
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
                  <Field className="min-w-0 flex-1">
                    <FieldLabel>
                      <IconGenderBigender size={18} className="text-primary" />
                      {genderLabel} <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {jenisKelaminItems.map((item) => (
                            <SelectItem key={item} value={item || ""}>
                              {item}
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
                    {bioLabel}
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder={bioPlaceholder}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setLengthOfBio(e.target.value.length);
                    }}
                    className="min-h-29"
                    maxLength={isOnboarding ? bioCounterLimit : undefined}
                  />
                  <div className="flex justify-between items-center">
                    {bioDescription ? (
                      <FieldDescription>{bioDescription}</FieldDescription>
                    ) : (
                      <span />
                    )}
                    <FieldDescription>
                      {lenghtOfBio}/{bioCounterLimit}
                    </FieldDescription>
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
                    {addressLabel}
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder={addressPlaceholder}
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
      <div className="w-full px-4 sm:px-6 mt-5">
        <Button
          type="submit"
          form="update-profile-field"
          className={isOnboarding ? "w-full rounded-full" : "text-[14px] leading-6 w-full rounded-xl"}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner className={isOnboarding ? "size-4" : "size-4.5"} />
              {loadingLabel}
            </>
          ) : (
            <>
              {!isOnboarding && <IconFileCheck size={18} className="text-primary" />}
              {submitButtonLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdateProfileField;
