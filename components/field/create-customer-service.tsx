"use client";

import { customerServiceSchema, TcustomerServiceSchema } from "@/schemas";
import { customerService } from "@/server/actions/customer-service";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  IconChartDots3,
  IconFileText,
  IconTag,
  IconTypography,
} from "@tabler/icons-react";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

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

export const CustomerServiceCreate = () => {
  const [lengthOfDeskripsi, setLengthOfDeskripsi] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm({
    validators: { onSubmit: customerServiceSchema },
    onSubmit: async ({ value }: { value: TcustomerServiceSchema }) => {
      setIsLoading(true);
      const fetch = await customerService(value);
      if (fetch.status === "error") {
        toast.error(fetch.msg);
      } else if (fetch.status === "success") {
        toast.success(fetch.msg);
        router.refresh();
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
        id="custumor-service-create"
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
                    katagori
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
                    <SelectTrigger
                      id="select-catagory-news"
                      data-invalid={isInvalid}
                      className="rounded-2xl"
                    >
                      <SelectValue placeholder={"level prioritas"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {levelTrigger.map(({ ctg }) => (
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
                  {lengthOfDeskripsi} kata
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </form>

      <Button
        form="custumor-service-create"
        disabled={isLoading}
        className="w-full"
        type="submit"
      >
        {isLoading ? (
          <>
            <Spinner /> Mengirim
          </>
        ) : (
          "kirim"
        )}
      </Button>
    </div>
  );
};
