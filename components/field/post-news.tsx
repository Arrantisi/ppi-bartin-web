"use client";

import { updateNewsSchema, TUpdateNewsSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { toastManager } from "../ui/toast";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { updateNewsContent } from "@/actions/news";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

const catagoryTrigger = [
  { ctg: "beasiswa" },
  { ctg: "kegiatan" },
  { ctg: "pengumuman" },
];

export const PostNewsField = ({
  judul,
  urlImage,
  slug,
}: {
  judul: string;
  urlImage: string;
  slug: string;
}) => {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const form = useForm({
    validators: { onSubmit: updateNewsSchema },
    defaultValues: {
      judul,
      content: "",
      catagory: "",
    },
    onSubmit: async ({ value }: { value: TUpdateNewsSchema }) => {
      setIsPending(true);
      const data = await updateNewsContent(slug, value);
      if (data.status === "error") {
        toastManager.add({
          type: "error",
          description: "Ada Masalah mohon hubungi admin ppit bartin",
        });
      } else if (data.status === "success") {
        router.push("/home/news");
      }
      setIsPending(false);
    },
  });

  return (
    <div className="space-y-3">
      <form
        id="post-news-field"
        className="space-y-4 my-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="catagory">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} orientation={"responsive"}>
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
        <form.Field name="judul">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <Textarea
                  name={field.name}
                  placeholder="judul: badminton festival seruuuu"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="text-2xl md:text-3xl font-bold leading-tight min-h-28"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="w-full max-w-md mt-4">
          <AspectRatio
            ratio={4 / 3}
            className="bg-muted rounded-4xl overflow-hidden border"
          >
            <Image src={urlImage} alt="4:3" fill className="object-cover" />
          </AspectRatio>
        </div>
        <form.Field name="content">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <Textarea
                  name={field.name}
                  placeholder="judul: badminton festival seruuuu"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="text-foreground/90 leading-relaxed whitespace-pre-line text-base md:text-lg tracking-wide min-h-96"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </form>
      <div>
        <Button
          type="submit"
          form="post-news-field"
          disabled={isPending}
          className="text-sm w-full rounded-2xl"
        >
          {isPending && <Spinner />} Upload Berita Ini
        </Button>
      </div>
    </div>
  );
};
