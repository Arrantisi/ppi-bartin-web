"use client";

import { postJudulSchema, TPostJudulSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { postEvent } from "@/server/actions/acara";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { TCatagory } from "@/types";
import { postNews } from "@/server/actions/news";
import { goeyToast } from "../ui/goey-toaster";

export const PostEvent = ({ catagory }: TCatagory) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      judul: "",
    },
    validators: { onSubmit: postJudulSchema },
    onSubmit: async ({ value }: { value: TPostJudulSchema }) => {
      setIsLoading(true);
      let data;
      if (catagory === "events") {
        data = await postEvent(value);
      } else if (catagory === "news") {
        data = await postNews(value);
      }
      if (data?.status === "error") {
        goeyToast.error("Kesalahan", {
          description: "Judul kamu sudah ada yg punya",
        });
      } else if (data?.status === "success") {
        goeyToast.success("Berhasil", {
          description:
            catagory === "events"
              ? "Event kamu sudah di simpan di profile kamu"
              : "Berita kamu sudah di simpan di profile kamu",
        });
        router.push(
          catagory === "events"
            ? `/home/events/uploader/${data.msg}`
            : `/home/news/uploader/${data.msg}`,
        );
      }
      setIsLoading(false);
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
                  placeholder={
                    catagory === "events"
                      ? "Buat acara yang seru apa hari ini?"
                      : "Apa judul berita menarik yang ingin Anda bagikan?"
                  }
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
          disabled={isLoading}
          className="text-sm rounded-2xl flex items-center gap-2 w-32"
        >
          {isLoading && <Spinner />}
          Selanjutnya
        </Button>
      </div>
    </div>
  );
};
