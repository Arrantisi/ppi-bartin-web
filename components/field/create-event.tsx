"use client";

import { TcreateEventSchema, createEventSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Field, FieldLabel, FieldError, FieldDescription } from "../ui/field";
import { Button, buttonVariants } from "../ui/button";
import { DatePickerField } from "../dates/date-picker-future";
import { createAcara } from "@/server/actions/acara";
import { Textarea } from "../ui/textarea";
import props from "@/props/create-acara-props.json";
import { Input } from "../ui/input";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import { UploaderPhoto } from "../event/uploader/upload-event-news";
import {
  IconCalendar,
  IconFileText,
  IconMapPin,
  IconTypography,
  IconUpload,
  IconUsers,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { RichTextEditor } from "../ui/rich-text-editor";

export const CreateEventField = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lengthOfDeskripsi, setLengthOfDeskripsi] = useState(0);
  const [isDate, setIsDate] = useState<Date>(new Date());

  const today = new Date();

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      judul: "",
      lokasi: "",
      date: new Date(),
      deskripsi: "",
      maxCapacity: 0,
      batasDaftar: new Date(),
      fileKey: "",
    },
    validators: { onSubmit: createEventSchema },
    onSubmit: async ({ value }: { value: TcreateEventSchema }) => {
      setIsLoading(true);
      const matched = await createAcara(value);
      if (matched.status === "error") {
        toast.error("ada kesalahan", {
          description: matched.msg,
        });
      } else if (matched.status === "success") {
        toast.success("Berhasil Membuat Acara");
        router.push(`/home/acara`);
      }
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
                    <IconUpload size={18} className="text-primary" />
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
                    <IconTypography size={18} className="text-primary" />
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
                      <IconCalendar size={18} className="text-primary" />
                      Tanggal
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <DatePickerField
                      onChange={(e) => {
                        if (e) {
                          field.handleChange(e);
                          setIsDate(e);
                        }
                      }}
                      disabled={[{ before: today }]}
                      value={field.state.value}
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
                      <IconCalendar size={18} className="text-primary" />
                      Batas Daftar <span className="text-destructive">*</span>
                    </FieldLabel>

                    <DatePickerField
                      onChange={(e) => {
                        if (e) field.handleChange(e);
                      }}
                      disabled={[{ before: today }, { after: isDate }]}
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

          <form.Field name="lokasi">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconMapPin size={18} className="text-primary" />
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
                    <IconFileText size={18} className="text-primary" />
                    Deskripsi <span className="text-destructive">*</span>
                  </FieldLabel>

                  <RichTextEditor
                    onChange={(e) => {
                      field.handleChange(e);
                      setLengthOfDeskripsi(e.length);
                    }}
                    value={field.state.value}
                  />

                  <FieldDescription className="text-right">
                    {lengthOfDeskripsi} kata
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
                      <IconUsers size={18} className="text-primary" />
                      Kuota <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Input
                      type="number"
                      id={field.name}
                      inputMode="numeric"
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
          </div>
        </form>
      </div>
      <div className="flex flex-col-reverse items-center justify-center gap-2 mt-6">
        <Link
          href={"/home/acara"}
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
