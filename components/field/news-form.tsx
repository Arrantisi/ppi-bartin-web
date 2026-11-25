"use client";

import { UploaderPhoto } from "@/features/uploads/upload-event-news";
import { createNews, updateNews } from "@/server/actions/news";
import { createNewsSchema, TcreateNewsSchema } from "@/schemas/news";
import { TupdateNewsProps } from "@/types";
import { useForm } from "@tanstack/react-form";
import {
  IconClipboardText,
  IconFileText,
  IconPhotoScan,
  IconTags,
  IconTypography,
  IconWorld,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentUserRole } from "@/hooks/use-current-role";
import { Button, buttonVariants } from "../ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { RichTextEditor } from "../ui/rich-text-editor-dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

type NewsFormMode = "create" | "update";

type NewsFormFieldProps = {
  mode: NewsFormMode;
  slug?: string;
  data?: TupdateNewsProps["data"];
  backHref?: string;
};

const catagoryTrigger = [
  { ctg: "beasiswa" },
  { ctg: "kegiatan" },
  { ctg: "berita-utama" },
  { ctg: "kabar-kampus" },
  { ctg: "prestasi" },
  { ctg: "artikel" },
  { ctg: "pengumuman" },
];

const ENVIRONMENT_OPTIONS: Record<string, { label: string; value: string }[]> = {
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

export const NewsFormField = ({
  mode,
  slug,
  data,
  backHref = "/home/berita",
}: NewsFormFieldProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lenghtOfJudul, setLenghtOfJudul] = useState(0);
  const [lenghtOfRingkasan, setLenghtOfRingkasan] = useState(0);
  const [lenghtOfDeskripsi, setLenghtOfDeskripsi] = useState(0);
  const { data: role } = useCurrentUserRole();

  const envOptions = ENVIRONMENT_OPTIONS[role ?? "USER"] || [];

  const router = useRouter();

  const formId = mode === "update" ? "update-news-field" : "create-news-field";

  const form = useForm({
    validators: { onSubmit: createNewsSchema },
    defaultValues: {
      judul: data?.judul || "",
      desckripsi: data?.desckripsi || "",
      catagory: data?.catagory || "",
      fileKey: data?.fileKey || "",
      ringkasan: data?.ringkasan || "",
      environment: (data?.environment || "production") as "local" | "preview" | "production",
    },
    onSubmit: async ({ value }: { value: TcreateNewsSchema }) => {
      setIsLoading(true);

      const response =
        mode === "update" && slug
          ? await updateNews(slug, value)
          : await createNews(value);

      if (!response.success) {
        toast.error(response.error);
      } else {
        toast.success(
          mode === "update"
            ? "Selamat Kamu Telah Berhasil Memperbarui Berita"
            : "Berahail Membuat Berita",
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
            title="Informasi berita"
            description="Judul dan kategori membantu pembaca menemukan berita ini."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <form.Field name="judul">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        <IconTypography size={18} className="text-accent" />
                        Judul Berita
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Textarea
                        name={field.name}
                        id={field.name}
                        placeholder="Masukkan judul berita yang menarik"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setLenghtOfJudul(e.target.value.length);
                        }}
                      />
                      <FieldDescription className="text-right">
                        {lenghtOfJudul}/100
                      </FieldDescription>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="catagory">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="select-catagory-news">
                      <IconTags size={18} className="text-accent" />
                      Kategori Berita
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
                        className="rounded-xl"
                      >
                        <SelectValue placeholder={"Pilih Kategori"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {catagoryTrigger.map(({ ctg }) => (
                          <SelectItem key={ctg} className="rounded-xl" value={ctg}>
                            {ctg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <FieldLabel htmlFor="select-environment-news">
                        <IconWorld size={18} className="text-accent" />
                        Environment
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value as "local" | "preview" | "production")}
                      >
                        <SelectTrigger
                          id="select-environment-news"
                          data-invalid={isInvalid}
                          className="rounded-xl"
                        >
                          <SelectValue placeholder={"Pilih Environment"} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          {envOptions.map(({ label, value }) => (
                            <SelectItem key={value} className="rounded-xl" value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            )}

            <div className="md:col-span-2">
              <form.Field name="ringkasan">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        <IconClipboardText size={18} className="text-accent" />
                        Ringkasan Berita
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Textarea
                        name={field.name}
                        id={field.name}
                        placeholder="Ringkasan berita anda dalam satu paragraf singkat"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setLenghtOfRingkasan(e.target.value.length);
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <FieldDescription>
                          Ringkasan singkat yang akan muncul di preview berita
                        </FieldDescription>
                        <FieldDescription className="text-right">
                          {lenghtOfRingkasan}/100
                        </FieldDescription>
                      </div>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
          </div>
        </section>

        <section className="space-y-5 border-t border-border pt-8">
          <SectionHeading
            index="02"
            title="Sampul & isi"
            description="Gambar cover dan tulisan lengkap akan tampil di halaman detail."
          />

          <div className="grid grid-cols-1 gap-5">
            <form.Field name="fileKey">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>
                      <IconPhotoScan size={18} className="text-accent" />
                      Gambar Cover
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

            <form.Field name="desckripsi">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      <IconFileText size={18} className="text-accent" />
                      Isi Berita
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <RichTextEditor
                      onChange={(e) => {
                        field.handleChange(e);
                        setLenghtOfDeskripsi(e.length);
                      }}
                      placeholder="Tulis isi beritamu di sini..."
                      value={field.state.value}
                    />
                    <FieldDescription className="text-right">
                      {lenghtOfDeskripsi} kata
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </div>
        </section>
      </form>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Link
          href={backHref}
          className={buttonVariants({ variant: "outline" })}
        >
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
            "Publish Berita"
          )}
        </Button>
      </div>
    </div>
  );
};
