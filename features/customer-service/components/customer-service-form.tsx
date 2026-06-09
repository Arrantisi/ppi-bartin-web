"use client";

import { customerServiceSchema, TcustomerServiceSchema } from "@/schemas/customer-service";
import { customerService } from "@/server/actions/customer-service";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconChartDots3,
  IconFileText,
  IconTag,
  IconTypography,
  IconPhoto,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { imageUrl } from "@/utils/image-url";

const catagoryTrigger = [
  { ctg: "dokumen", label: "Ikamet & Legalitas" },
  { ctg: "akademik", label: "Masalah Kampus/TÖMER" },
  { ctg: "akomodasi", label: "Masalah Asrama/Ev" },
  { ctg: "teknis", label: "Error Web/Aplikasi" },
  { ctg: "finansial", label: "Dana & Beasiswa" },
  { ctg: "saran", label: "Kritik & Saran" },
];

const levelTrigger = [
  { ctg: "rendah", label: "Santai (Informasi Umum)" },
  { ctg: "sedang", label: "Sedang (Butuh Bantuan)" },
  { ctg: "darurat", label: "Darurat (Penting Sekali)" },
];

const MAX_FILES = 5;

export const CustomerServiceForm = () => {
  const [lengthOfDeskripsi, setLengthOfDeskripsi] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<{ key: string; url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const { startUpload } = useUploadThing("onOploadCustomerService", {
    onClientUploadComplete: (res) => {
      const newFiles = res.map((r) => ({
        key: r.key,
        url: imageUrl(r.key),
        name: r.name ?? r.key,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      setUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
    },
    onUploadError: () => {
      toast.error("Gagal mengunggah file");
      setUploading(false);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > MAX_FILES) {
        toast.error(`Maksimal ${MAX_FILES} file`);
        return;
      }
      setUploading(true);
      await startUpload(acceptedFiles);
    },
    [files.length, startUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 4 * 1024 * 1024,
    maxFiles: MAX_FILES,
    onDropRejected: (rejected) => {
      const err = rejected[0]?.errors[0];
      if (err?.code === "file-too-large") toast.error("Maksimal 4MB per file");
      else if (err?.code === "too-many-files") toast.error(`Maksimal ${MAX_FILES} file`);
      else toast.error("File tidak didukung");
    },
  });

  const removeFile = (key: string) => {
    setFiles((prev) => prev.filter((f) => f.key !== key));
  };

  const form = useForm({
    validators: { onSubmit: customerServiceSchema },
    onSubmit: async ({ value }: { value: TcustomerServiceSchema }) => {
      setIsLoading(true);
      const payload = { ...value, fileKeys: files.map((f) => f.key) };
      const fetch = await customerService(payload);
      if (fetch.status === "error") {
        toast.error(fetch.msg);
      } else if (fetch.status === "success") {
        toast.success(fetch.msg);
        router.push("/home/profile");
        form.reset();
      }
      setIsLoading(false);
    },
    defaultValues: {
      catagory: "",
      level: "",
      message: "",
      subject: "",
    },
  });

  return (
    <div>
      <form
        id="customer-service-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(e);
        }}
        className="space-y-6"
      >
        <div className="flex items-center justify-center gap-3">
          <form.Field name="catagory">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconTag size={18} className="text-primary" />
                    kategori
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id="select-catagory-cs" data-invalid={isInvalid}>
                      <SelectValue placeholder={"Pilih Kategori"} />
                    </SelectTrigger>
                    <SelectContent>
                      {catagoryTrigger.map(({ ctg, label }) => (
                        <SelectItem key={ctg} value={ctg}>
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
          <form.Field name="level">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>
                    <IconChartDots3 size={18} className="text-primary" />
                    Level
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id="select-level-cs" data-invalid={isInvalid}>
                      <SelectValue placeholder={"level prioritas"} />
                    </SelectTrigger>
                    <SelectContent>
                      {levelTrigger.map(({ ctg, label }) => (
                        <SelectItem key={ctg} value={ctg}>
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
        </div>

        <form.Field name="subject">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>
                  <IconTypography size={18} className="text-primary" />
                  Subject
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  id={field.name}
                  placeholder={"Subject kalian"}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="message">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>
                  <IconFileText size={18} className="text-primary" />
                  Pesan <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  id={field.name}
                  placeholder={"tulis pesan kamu di sini"}
                  value={field.state.value}
                  className="min-h-36"
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setLengthOfDeskripsi(e.target.value.length);
                  }}
                />
                <FieldDescription className="text-right">
                  {lengthOfDeskripsi} karakter
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div>
          <FieldLabel>
            <IconPhoto size={18} className="text-primary" />
            Lampiran foto
            <span className="text-text-disabled text-[0.625rem] font-normal ml-1">
              (opsional, maks {MAX_FILES} foto)
            </span>
          </FieldLabel>

          <div
            {...getRootProps()}
            className={`mt-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-accent bg-accent-subtle"
                : "border-border hover:border-border-strong bg-surface"
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Spinner />
                <p className="text-sm text-text-secondary">Mengunggah... {uploadProgress}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <IconUpload className="size-8 text-text-disabled" />
                <p className="text-sm text-text-secondary">
                  Tarik & lepas foto di sini, atau klik untuk memilih
                </p>
                <p className="text-xs text-text-disabled">JPG, PNG, WebP · Maks 4MB per file</p>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
              {files.map((file) => (
                <div key={file.key} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    sizes="(max-width: 640px) 33vw, 20vw"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(file.key)}
                    className="absolute top-1 right-1 size-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IconTrash className="size-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>

      <Button
        form="customer-service-form"
        disabled={isLoading || uploading}
        className="w-full mt-6"
        type="submit"
      >
        {isLoading ? (
          <>
            <Spinner /> Mengirim
          </>
        ) : (
          "Kirim"
        )}
      </Button>
    </div>
  );
};
