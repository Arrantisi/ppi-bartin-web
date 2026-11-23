"use client";

import { createAcara, updateAcara } from "@/server/actions/acara";
import { TcreateEventSchema, createEventSchema } from "@/schemas/event";
import { TupdateEventProps } from "@/types";
import { DatePickerField } from "../dates/date-picker-future";
import { Button, buttonVariants } from "../ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { RichTextEditor } from "../ui/rich-text-editor-dynamic";
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
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentUserRole } from "@/hooks/use-current-role";
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
  backHref?: string;
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

const SectionHeading = ({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-bg font-mono text-[0.6875rem] text-text-secondary">
      {index}
    </span>
    <div className="space-y-1">
      <h2 className="subheadline text-text-primary">{title}</h2>
      <p className="footnote text-text-secondary">{description}</p>
    </div>
  </div>
);

export const EventFormField = ({
  mode,
  slug,
  data,
  backHref = "/home/acara",
}: EventFormFieldProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lengthOfDeskripsi, setLengthOfDeskripsi] = useState(0);
  const [isDate, setIsDate] = useState<Date>(new Date());
  const { data: role } = useCurrentUserRole();
  const envOptions = ENVIRONMENT_OPTIONS[role ?? "USER"] || [];

  const today = new Date();
  const router = useRouter();

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

      if (!matched.success) {
        toast.error("ada kesalahan", {
          description: matched.error,
        });
      } else {
        toast.success(
          mode === "update"
            ? "Selamat Kamu Telah Berhasil Memperbarui Acara"
            : "Berhasil Membuat Acara",
        );
        router.push(backHref);
      }

      setIsLoading(false);
    },
  });

  return (
    <div className="space-y-8">
      <form
        id={formId}
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <section className="space-y-5">
          <SectionHeading
            index="01"
            title="Detail acara"
            description="Judul, lokasi, dan deskripsi yang akan dilihat peserta."
          />

          <div className="grid grid-cols-1 gap-5">
            <form.Field name="judul">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      <IconTypography size={18} className="text-accent" />
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

            <form.Field name="lokasi">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      <IconMapPin size={18} className="text-accent" />
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
                    <FieldLabel htmlFor={field.name}>
                      <IconFileText size={18} className="text-accent" />
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
          </div>
        </section>

        <section className="space-y-5 border-t border-border pt-8">
          <SectionHeading
            index="02"
            title="Jadwal & kuota"
            description="Tentukan waktu acara, batas daftar, dan jumlah peserta."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <form.Field name="date">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field className="md:col-span-2">
                    <FieldLabel>
                      <IconCalendar size={18} className="text-accent" />
                      Tanggal Acara
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
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
                            <label
                              htmlFor="event-date-time"
                              className="mb-1 block text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-text-disabled"
                            >
                              Jam Mulai
                            </label>
                            <Input
                              id="event-date-time"
                              type="time"
                              value={dateTime ?? ""}
                              onChange={(e) =>
                                form.setFieldValue(
                                  "dateTime",
                                  e.target.value,
                                )
                              }
                              className="focus-visible:ring-accent"
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
                  <Field className="md:col-span-2">
                    <FieldLabel>
                      <IconCalendar size={18} className="text-accent" />
                      Batas Daftar <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
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
                            <label
                              htmlFor="event-deadline-time"
                              className="mb-1 block text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-text-disabled"
                            >
                              Jam Tutup
                            </label>
                            <Input
                              id="event-deadline-time"
                              type="time"
                              value={batasDaftarTime ?? ""}
                              onChange={(e) =>
                                form.setFieldValue(
                                  "batasDaftarTime",
                                  e.target.value,
                                )
                              }
                              className="focus-visible:ring-accent"
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

            <form.Field name="maxCapacity">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      <IconUsers size={18} className="text-accent" />
                      Kuota Peserta <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      type="number"
                      id={field.name}
                      inputMode="numeric"
                      placeholder={props.textarea[5].placeholder}
                      className="focus-visible:ring-accent"
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
        </section>

        <section className="space-y-5 border-t border-border pt-8">
          <SectionHeading
            index="03"
            title="Publikasi"
            description="Atur sampul acara dan lingkungan publikasi."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <form.Field name="fileKey">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconUpload size={18} className="text-accent" />
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

            {envOptions.length > 0 && (
              <form.Field name="environment">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor="select-environment-event">
                        <IconWorld size={18} className="text-accent" />
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
                          className="rounded-xl"
                        >
                          <SelectValue placeholder={"Pilih Environment"} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          {envOptions.map(({ label, value }) => (
                            <SelectItem
                              key={value}
                              className="rounded-xl"
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
          </div>
        </section>
      </form>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
          Batal
        </Link>
        <Button
          disabled={isLoading}
          className="w-full sm:w-auto"
          form={formId}
          type="submit"
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Spinner /> Publishing
            </span>
          ) : mode === "update" ? (
            "Simpan Perubahan"
          ) : (
            "Publish Acara"
          )}
        </Button>
      </div>
    </div>
  );
};
