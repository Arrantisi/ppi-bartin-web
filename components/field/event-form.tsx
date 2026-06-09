"use client";

import { createAcara, updateAcara } from "@/server/actions/acara";
import { TcreateEventSchema, createEventSchema } from "@/schemas";
import { TupdateEventProps } from "@/types";
import { DatePickerField } from "../dates/date-picker-future";
import { Button, buttonVariants } from "../ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { RichTextEditor } from "../ui/rich-text-editor";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { useForm } from "@tanstack/react-form";
import {
  IconCalendar,
  IconFileText,
  IconMapPin,
  IconTypography,
  IconUpload,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentUserRole } from "@/server/actions/account";
import { UploaderPhoto } from "@/features/uploads/upload-event-news";
import { mergeTime } from "@/utils/date-format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import props from "@/props/create-acara-props.json";

type EventFormMode = "create" | "update";

type EventFormFieldProps = {
  mode: EventFormMode;
  slug?: string;
  data?: TupdateEventProps["data"];
};

const ENVIRONMENT_OPTIONS: Record<string, { label: string; value: string }[]> =
  {
    ADMIN: [
      { label: "Local", value: "local" },
      { label: "Preview", value: "preview" },
      { label: "Production", value: "production" },
    ],
    PENGURUS: [
      { label: "Preview", value: "preview" },
      { label: "Production", value: "production" },
    ],
  };

export const EventFormField = ({ mode, slug, data }: EventFormFieldProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lengthOfDeskripsi, setLengthOfDeskripsi] = useState(0);
  const [isDate, setIsDate] = useState<Date>(new Date());
  const [role, setRole] = useState<string>("USER");

  useEffect(() => {
    getCurrentUserRole().then(setRole);
  }, []);
  const envOptions = ENVIRONMENT_OPTIONS[role] || [];

  const today = new Date();
  const router = useRouter();

  console.log(role);

  const formId = mode === "update" ? "update-acara-form" : "create-acara-form";

  const extractTime = (date?: Date) => {
    if (!date) return "";
    const d = new Date(date);
    if (d.getHours() === 0 && d.getMinutes() === 0) return "";
    return format(d, "HH:mm");
  };

  const form = useForm({
    defaultValues: {
      judul: data?.judul || "",
      lokasi: data?.lokasi || "",
      date: data?.date || new Date(),
      deskripsi: data?.deskripsi || "",
      maxCapacity: data?.maxCapacity || 0,
      batasDaftar: data?.batasDaftar || new Date(),
      dateTime: extractTime(data?.date),
      batasDaftarTime: extractTime(data?.batasDaftar),
      fileKey: data?.fileKey || "",
      environment: (data?.environment || "production") as
        | "local"
        | "preview"
        | "production",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validators: { onSubmit: createEventSchema as any },
    onSubmit: async ({ value }: { value: TcreateEventSchema }) => {
      setIsLoading(true);

      const mergedDate = mergeTime(value.date, value.dateTime);
      const mergedBatasDaftar = mergeTime(
        value.batasDaftar,
        value.batasDaftarTime,
      );

      if (mergedBatasDaftar > mergedDate) {
        toast.error("Batas pendaftaran tidak boleh melewati tanggal acara");
        setIsLoading(false);
        return;
      }

      const matched =
        mode === "update" && slug
          ? await updateAcara(slug, {
              ...value,
              date: mergedDate,
              batasDaftar: mergedBatasDaftar,
            })
          : await createAcara({
              ...value,
              date: mergedDate,
              batasDaftar: mergedBatasDaftar,
            });

      if (matched.status === "error") {
        toast.error("ada kesalahan", {
          description: matched.msg,
        });
      } else {
        toast.success(
          mode === "update"
            ? "Selamat Kamu Telah Berhasil Memperbarui Acara"
            : "Berhasil Membuat Acara",
        );
        router.push("/home/acara");
      }

      setIsLoading(false);
    },
  });

  return (
    <div className="flex flex-col justify-between h-full pb-4">
      <div>
        <form
          className="space-y-6"
          id={formId}
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

          <div className="space-y-4">
            <form.Field name="date">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconCalendar size={18} className="text-primary" />
                      Tanggal Acara
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                      <div className="min-w-0 flex-1">
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
                      </div>
                      <form.Subscribe
                        selector={(state) => ({ dateTime: state.values.dateTime })}
                      >
                        {({ dateTime }) => (
                          <div className="sm:w-36 shrink-0">
                            <label className="block text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-text-disabled mb-1">
                              Jam Mulai
                            </label>
                            <Input
                              type="time"
                              value={dateTime ?? ""}
                              onChange={(e) =>
                                form.setFieldValue(
                                  "dateTime",
                                  e.target.value,
                                )
                              }
                              className="focus-visible:ring-primary"
                            />
                          </div>
                        )}
                      </form.Subscribe>
                    </div>
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
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                      <div className="min-w-0 flex-1">
                        <DatePickerField
                          onChange={(e) => {
                            if (e) field.handleChange(e);
                          }}
                          disabled={[{ before: today }, { after: isDate }]}
                          value={field.state.value}
                        />
                      </div>
                      <form.Subscribe
                        selector={(state) => ({ batasDaftarTime: state.values.batasDaftarTime })}
                      >
                        {({ batasDaftarTime }) => (
                          <div className="sm:w-36 shrink-0">
                            <label className="block text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-text-disabled mb-1">
                              Jam Tutup
                            </label>
                            <Input
                              type="time"
                              value={batasDaftarTime ?? ""}
                              onChange={(e) =>
                                form.setFieldValue(
                                  "batasDaftarTime",
                                  e.target.value,
                                )
                              }
                              className="focus-visible:ring-primary"
                            />
                          </div>
                        )}
                      </form.Subscribe>
                    </div>
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
                    Caption <span className="text-destructive">*</span>
                  </FieldLabel>

                  <RichTextEditor
                    onChange={(e) => {
                      field.handleChange(e);
                      setLengthOfDeskripsi(e.length);
                    }}
                    placeholder="Ketik isi pesan/caption/deskripsi acaramu disini..."
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
                      Kuota Peserta <span className="text-destructive">*</span>
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

          {envOptions.length > 0 && (
            <form.Field name="environment">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconWorld size={18} className="text-primary" />
                      Environment
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(
                          value as "local" | "preview" | "production",
                        )
                      }
                    >
                      <SelectTrigger
                        id="select-environment-event"
                        data-invalid={isInvalid}
                        className="rounded-md"
                      >
                        <SelectValue placeholder={"Pilih Environment"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {envOptions.map(({ label, value }) => (
                          <SelectItem
                            key={value}
                            className="rounded-2xl"
                            value={value}
                          >
                            {label}
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
          )}
        </form>
      </div>

      <div className="flex flex-col-reverse items-center justify-center gap-2 mt-6">
        <Link
          href="/home/acara"
          className={buttonVariants({
            variant: "outline",
            className: "text-sm px-4 py-3 w-full",
          })}
        >
          Batal
        </Link>
        <Button
          disabled={isLoading}
          className="text-sm px-4 py-3 w-full"
          form={formId}
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
