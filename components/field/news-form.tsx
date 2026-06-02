"use client";

import { UploaderPhoto } from "@/features/uploads/upload-event-news";
import { createNews, updateNews } from "@/server/actions/news";
import { createNewsSchema, TcreateNewsSchema } from "@/schemas";
import { TupdateNewsProps } from "@/types";
import { useForm } from "@tanstack/react-form";
import {
  IconClipboardText,
  IconFileText,
  IconPhotoScan,
  IconTags,
  IconTypography,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "../ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { RichTextEditor } from "../ui/rich-text-editor";
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

export const NewsFormField = ({ mode, slug, data }: NewsFormFieldProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lenghtOfJudul, setLenghtOfJudul] = useState(0);
  const [lenghtOfRingkasan, setLenghtOfRingkasan] = useState(0);
  const [lenghtOfDeskripsi, setLenghtOfDeskripsi] = useState(0);

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
    },
    onSubmit: async ({ value }: { value: TcreateNewsSchema }) => {
      setIsLoading(true);

      const response =
        mode === "update" && slug
          ? await updateNews(slug, value)
          : await createNews(value);

      if (response.status === "error") {
        toast.error(response.msg);
      } else {
        toast.success(
          mode === "update"
            ? "Selamat Kamu Telah Berhasil Memperbarui Berita"
            : "Berahail Membuat Berita",
        );
        router.push("/home/berita");
      }

      setIsLoading(false);
    },
  });

  return (
    <div className="space-y-3">
      <form
        id={formId}
        className="space-y-6 my-5"
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
                  <IconPhotoScan size={18} className="text-primary" />
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

        <form.Field name="judul">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>
                  <IconTypography size={18} className="text-primary" />
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

        <form.Field name="catagory">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} orientation={"responsive"}>
                <FieldLabel>
                  <IconTags size={18} className="text-primary" />
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
                    className="rounded-2xl"
                  >
                    <SelectValue placeholder={"Pilih Kategori"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {catagoryTrigger.map(({ ctg }) => (
                      <SelectItem key={ctg} className="rounded-2xl" value={ctg}>
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

        <form.Field name="ringkasan">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>
                  <IconClipboardText size={18} className="text-primary" />
                  Ringkasan Berita
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  name={field.name}
                  id={field.name}
                  placeholder="Masukkan judul berita yang menarik"
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

        <form.Field name="desckripsi">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>
                  <IconFileText size={18} className="text-primary" />
                  Isi Berita
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldDescription>
                  masukan isi beritamu disini
                </FieldDescription>
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
      </form>
      <div className="flex flex-col-reverse items-center justify-center gap-2 mt-6">
        <Link
          href="/home/berita"
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
          form={formId}
          type="submit"
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Spinner /> Publishing
            </span>
          ) : (
            "Publish Berita"
          )}
        </Button>
      </div>
    </div>
  );
};
