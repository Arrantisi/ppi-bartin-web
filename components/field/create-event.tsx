"use client";

import { TcreateEventSchema, createEventSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Field, FieldLabel, FieldError, FieldDescription } from "../ui/field";
import { Button, buttonVariants } from "../ui/button";
import { DatePickerField } from "../event/date-picker-field";
import { createAcara } from "@/server/actions/acara";
import { Textarea } from "../ui/textarea";
import props from "@/props/create-acara-props.json";
import { Input } from "../ui/input";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

import Link from "next/link";
import { goeyToast } from "../ui/goey-toaster";
import { UploaderPhoto } from "../event/uploader/upload-event-news";
import {
  IconCalendar,
  IconCoin,
  IconFileText,
  IconMapPin,
  IconTypography,
  IconUpload,
  IconUsers,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const catagoryTrigger = [
  { ctg: "beasiswa" },
  { ctg: "kegiatan" },
  { ctg: "pengumuman" },
];

export const CreateEventField = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lengthOfDeskripsi, setLengthOfDeskripsi] = useState(0);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      judul: "",
      lokasi: "",
      date: new Date(),
      deskripsi: "",
      maxCapacity: 0,
      batasDaftar: new Date(),
      biayaAcara: "",
      catagory: "",
      fileKey: "",
      persyaratan: "",
    },
    validators: { onSubmit: createEventSchema },
    onSubmit: async ({ value }: { value: TcreateEventSchema }) => {
      setIsLoading(true);
      const matched = await createAcara(value);
      if (matched.status === "error") {
        goeyToast.error("ada kesalahan", {
          description: matched.msg,
        });
      } else if (matched.status === "success") {
        goeyToast.success("Berhasil Membuat Acara", {
          description: matched.msg,
        });
        router.push(`/home/events`);
      }
      console.log(value);

      setIsLoading(false);
    },
  });

  return (
    <div className="flex flex-col justify-between h-full pb-4">
      <div>
        <form
          className="space-y-6"
          id="create-acara-form"
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
                  <FieldLabel>
                    <IconUpload size={18} color="#0088FF" />
                    Foto Acara
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <UploaderPhoto
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e)}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="judul">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconTypography size={18} color="#0088FF" />
                    Judul Acara
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <Textarea
                    id={field.name}
                    placeholder={props.textarea[0].placeholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <div className="flex items-center justify-center gap-3">
            <form.Field name="date">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconCalendar size={18} color="#0088FF" />
                      Tanggal
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <DatePickerField
                      onChange={(e) => {
                        if (e) field.handleChange(e);
                      }}
                      value={field.state.value}
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="catagory">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconFileText size={18} color="#0088FF" />
                      Catagory
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger
                        id="select-catagory-news"
                        data-invalid={isInvalid}
                        className="rounded-2xl"
                      >
                        <SelectValue placeholder={"select catagory"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {catagoryTrigger.map(({ ctg }) => (
                          <SelectItem
                            key={ctg}
                            className="rounded-2xl"
                            value={ctg}
                          >
                            {ctg}
                          </SelectItem>
                        ))}
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

          <form.Field name="lokasi">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconMapPin size={18} color="#0088FF" />
                    Lokasi <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder={props.textarea[2].placeholder}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="deskripsi">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconFileText size={18} color="#0088FF" />
                    Deskripsi <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder={props.textarea[0].placeholder}
                    value={field.state.value}
                    className="min-h-36"
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setLengthOfDeskripsi(e.target.value.length);
                    }}
                  />
                  <FieldDescription className="text-right">
                    {lengthOfDeskripsi}/200
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <div className="flex items-center justify-center gap-3">
            <form.Field name="maxCapacity">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconUsers size={18} color="#0088FF" />
                      Kuota <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Input
                      type="number"
                      id={field.name}
                      placeholder={props.textarea[5].placeholder}
                      className="focus-visible:ring-primary"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.valueAsNumber)
                      }
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="batasDaftar">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconCalendar size={18} color="#0088FF" />
                      Batas Daftar <span className="text-destructive">*</span>
                    </FieldLabel>

                    <DatePickerField
                      onChange={(e) => {
                        if (e) field.handleChange(e);
                      }}
                      value={field.state.value}
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Field name="biayaAcara">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconCoin size={18} color="#0088FF" />
                    Biaya Acara <span className="text-destructive">*</span>
                  </FieldLabel>

                  <Input
                    id={field.name}
                    placeholder={props.textarea[5].placeholder}
                    className="focus-visible:ring-primary"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="persyaratan">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconFileText size={18} color="#0088FF" />
                    Persyaratan Peserta{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <Textarea
                    id={field.name}
                    placeholder={props.textarea[3].placeholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </form>
      </div>
      <div className="flex flex-col-reverse items-center justify-center gap-2 mt-6">
        <Link
          href={"/home/events"}
          className={buttonVariants({
            variant: "outline",
            className: "text-sm px-4 py-3 w-full",
          })}
        >
          cancel
        </Link>
        <Button
          disabled={isLoading}
          className="text-sm px-4 py-3 w-full"
          form="create-acara-form"
          type="submit"
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Spinner /> Publishing
            </span>
          ) : (
            "Publish Acara"
          )}
        </Button>
      </div>
    </div>
  );
};
