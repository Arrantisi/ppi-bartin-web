import { TupdateProfileSchema, updateProfileSchema } from "@/schemas";
import "react-phone-number-input/style.css";

import { TgetProfileUser } from "@/server/data/users";
import { useForm } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import {
  IconCalendar,
  IconFileCheck,
  IconIdBadge2,
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

const items = [{ value: "pria" }, { value: "wanita" }];

export const UpdateProfileField = ({ ...props }: TgetProfileUser) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
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
        goeyToast.success("Berhasil", { description: fetch.msg });
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
        <div className="bg-accent/50 py-[24px] px-[20px] space-y-[4px] my-3">
          <h3 className="text-[15px] leading-[15px] font-semibold">
            Informasi Pribadi
          </h3>
          <p className="text-[12px] leading-[18px] text-foreground/40">
            Data diri yang akan ditampilkan di profil
          </p>
        </div>
        <div className="mx-3 space-y-[20px]">
          <form.Field name="fullname">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="gap-1">
                    <IconUser size={18} /> Nama Lengkap
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
                    <IconUser size={18} />
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
                    <IconMail size={18} />
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
                    <IconPhone size={18} />
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
                    <IconIdBadge2 size={18} />
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
          <form.Field name="Bio">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="gap-1">
                    <IconUser size={18} />
                    Bio
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Tulis bio singkat tentang diri kamu..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-[116px]"
                  />
                  <div className="flex justify-between items-center">
                    <FieldDescription>
                      Ceritakan tentang diri kamu
                    </FieldDescription>
                    <FieldDescription>80/200</FieldDescription>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
        <div className="bg-accent/50 py-[24px] px-[20px] space-y-[4px] my-3">
          <h3 className="text-[15px] leading-[15px] font-semibold">
            Detail Pribadi
          </h3>
          <p className="text-[12px] leading-[18px] text-foreground/40">
            Informasi tambahan untuk profil
          </p>
        </div>
        <div className="mx-3 space-y-[20px]">
          <div className="flex items-center gap-2">
            <form.Field name="tanggalLahir">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconCalendar size={18} />
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
                      <IconUsers size={18} />
                      Jenis Kelamiin
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="select catagory" />
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
          <form.Field name="alamat">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconUsers size={18} />
                    Alamat Lengkap
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Bartın, Turkey"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-[75px]"
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
          className="text-[14px] leading-[24px] w-full rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className="size-[18px]" />
          ) : (
            <IconFileCheck size={18} />
          )}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
};
