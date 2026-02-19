"use client";

import { postJudulNewsSchema, TPostJudulNewsSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { postNews } from "@/actions/news";
import { toastManager } from "../ui/toast";
import { useRouter } from "next/navigation";

export const PostJudulNews = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      judul: "",
    },
    validators: { onSubmit: postJudulNewsSchema },
    onSubmit: async ({ value }: { value: TPostJudulNewsSchema }) => {
      const data = await postNews(value);
      if (data.status === "error") {
        toastManager.add({
          type: "error",
          title: "ada yg salah coba ganti judul",
        });
      } else if (data.status === "success") {
        router.push(`/home/news/uploader/${data.msg}`);
      }
    },
  });

  return (
    <div className="w-full space-y-3">
      <form
        id="post-judul-news"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="judul">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <Textarea
                  className="w-full h-24"
                  data-invalid={isInvalid}
                  name={field.name}
                  placeholder="Apa judul berita menarik yang ingin Anda bagikan?"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </form>
      <div className="flex justify-end">
        <Button
          form="post-judul-news"
          type="submit"
          className="text-sm rounded-2xl"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
};
