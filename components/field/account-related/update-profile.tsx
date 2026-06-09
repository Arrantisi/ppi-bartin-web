"use client";

import { TupdateProfileSchema, updateProfileSchema } from "@/schemas/profile";
import "react-phone-number-input/style.css";
import { TgetProfileUser } from "@/server/data/users";
import { useForm } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TanggalLahitField } from "@/components/field/account-related/tanggal-lahir";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { updateProfile } from "@/server/actions/user";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { UploadPhotoProfile } from "@/features/uploads/upload-photo-profile";
import {
  SelectAngkatan,
  SelectFakultas,
  SelectJurusan,
  SelectStatusPelajar,
} from "@/components/selects";
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
    : "Perubahan kamu berhasil disimpan";
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

        <div className="form-section-header px-4 sm:px-6">
          <h3 className="form-section-title">
            Informasi Pribadi
          </h3>
          <p className="form-section-subtitle">
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
                    <IconIdBadge2 size={14} className="text-text-disabled" />
                    Nomor Siswa
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    readOnly
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
                    <IconUser size={14} className="text-text-disabled" /> Nama Lengkap
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    readOnly
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
                    <IconMail size={14} className="text-text-disabled" />
                    Email
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    readOnly
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription className="field-helper">
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
                    <IconPhone size={14} className="text-text-disabled" />
                    Nomor Whatsapp
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <PhoneInput
                    type="tel"
                    placeholder="+62xxx atau +90xxx"
                    defaultCountry="TR"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e)}
                  />
                  <FieldDescription className="field-helper">
                    Masukkan nomor Whatsapp yang anda gunakan untuk grup PPI Bartin
                  </FieldDescription>

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
                    <IconUser size={14} className="text-text-disabled" />
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
        <div className="form-section-header px-4 sm:px-6 mt-2">
          <h3 className="form-section-title">
            Data Akademik
          </h3>
          <p className="form-section-subtitle">
            Informasi tambahan terkait akademik
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
                      <IconBuilding size={14} className="text-text-disabled" />
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
                        <SelectValue placeholder="Pilih fakultas dari menu" />
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
                      <IconBook2 size={14} className="text-text-disabled" />
                      Jurusan <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih jurusan dari menu" />
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
                      <IconCalendar size={14} className="text-text-disabled" />
                      Angkatan <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(e) => field.handleChange(e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tahun kedatangan" />
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
                      <IconLanguage size={14} className="text-text-disabled" />
                      Status Pelajar <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih status pelajar" />
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
        <div className="form-section-header px-4 sm:px-6 mt-2">
          <h3 className="form-section-title">
            Detail Pribadi
          </h3>
          <p className="form-section-subtitle">
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
                      <IconCalendar size={14} className="text-text-disabled" />
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
                      <IconGenderBigender size={14} className="text-text-disabled" />
                      {genderLabel} <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
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
                    <IconUser size={14} className="text-text-disabled" />
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
                    <IconUsers size={14} className="text-text-disabled" />
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
          className={isOnboarding ? "w-full rounded-full" : "w-full rounded-xl"}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner className={isOnboarding ? "size-4" : "size-4.5"} />
              {loadingLabel}
            </>
          ) : (
            <>
              {!isOnboarding && <IconFileCheck size={18} />}
              {submitButtonLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdateProfileField;
