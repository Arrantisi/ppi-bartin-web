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
import { goeyToast } from "../ui/goey-toaster";
import { UploaderPhoto } from "../event/uploader/upload-event-news";
import {
  IconClipboardText,
  IconFileText,
  IconPhotoScan,
  IconTags,
  IconTypography,
} from "@tabler/icons-react";
import Link from "next/link";

const catagoryTrigger = [
  { ctg: "beasiswa" },
  { ctg: "kegiatan" },
  { ctg: "pengumuman" },
];

const desckripsiPlacholder = `Tulis isi berita secara lengkap dan detail...

Tips menulis berita yang baik:
• Gunakan bahasa yang jelas dan mudah dipahami
• Sertakan fakta dan informasi yang akurat
• Struktur: Pembukaan, Isi, Penutup
• Gunakan paragraf untuk memudahkan pembacaan`;

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
        goeyToast.error("error", {
          description: "Ada Masalah mohon hubungi admin ppi bartin",
        });
      } else if (data.status === "success") {
        goeyToast.success("Berahail Membuat Berita");
        router.push("/home/news");
      }
      console.log(value);
      setIsLoading(false);
    },
  });

  return (
    <div className="space-y-3">
      <form
        id="create-news-field"
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
                  <IconPhotoScan size={18} color="#0088FF" />
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
                  <IconTypography size={18} color="#0088FF" />
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
                  <IconTags size={18} color="#0088FF" />
                  Catagory Berita
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
                  <IconClipboardText size={18} color="#0088FF" />
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
                  <IconFileText size={18} color="#0088FF" />
                  Deskripsi Berita
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  name={field.name}
                  placeholder={desckripsiPlacholder.trim()}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setLenghtOfDeskripsi(e.target.value.length);
                  }}
                  className="min-h-78.5"
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
          href={"/home/news"}
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
