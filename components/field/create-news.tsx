"use client";

import { createNewsSchema, TcreateNewsSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel, FieldDescription } from "../ui/field";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button, buttonVariants } from "../ui/button";
import { createNews } from "@/server/actions/news";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { UploaderPhoto } from "../event/uploader/upload-event-news";
import {
  IconClipboardText,
  IconFileText,
  IconPhotoScan,
  IconTags,
  IconTypography,
} from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import { RichTextEditor } from "../ui/rich-text-editor";

const catagoryTrigger = [
  // --- KATEGORI ACARA/KEGIATAN ---
  { ctg: "beasiswa" }, // Info beasiswa (YTB, kampus, dll)
  { ctg: "kegiatan" }, // Event yang akan datang (Makrab, Futsal)

  // --- KATEGORI BERITA/INFO ---
  { ctg: "berita-utama" }, // Berita penting/headline PPI
  { ctg: "kabar-kampus" }, // Berita seputar Bartın Üniversitesi
  { ctg: "prestasi" }, // Berita mahasiswa berprestasi di Bartin
  { ctg: "artikel" }, // Tulisan edukatif atau opini mahasiswa

  // --- KATEGORI UMUM ---
  { ctg: "pengumuman" }, // Urgent (Verifikasi, admin, dll)
];

export const CreateNewsField = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lenghtOfJudul, setLenghtOfJudul] = useState(0);
  const [lenghtOfRingkasan, setLenghtOfRingkasan] = useState(0);
  const [lenghtOfDeskripsi, setLenghtOfDeskripsi] = useState(0);

  const router = useRouter();

  const form = useForm({
    validators: { onSubmit: createNewsSchema },
    defaultValues: {
      judul: "",
      desckripsi: "",
      catagory: "",
      fileKey: "",
      ringkasan: "",
    },
    onSubmit: async ({ value }: { value: TcreateNewsSchema }) => {
      setIsLoading(true);
      const data = await createNews(value);
      if (data.status === "error") {
        toast.error(data.msg);
      } else if (data.status === "success") {
        toast.success("Berahail Membuat Berita");
        router.push("/home/berita");
      }
      setIsLoading(false);
    },
  });

  return (
    <div className="space-y-3">
      <form
        id="create-news-field"
        className="space-y-3 my-5"
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
                  Deskripsi Berita
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <RichTextEditor
                  onChange={(e) => {
                    field.handleChange(e);
                    setLenghtOfDeskripsi(e.length);
                  }}
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
          href={"/home/berita"}
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
          form="create-news-field"
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
