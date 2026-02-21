"use client";

import { postJudulSchema, TPostJudulSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { toastManager } from "../ui/toast";
import { useRouter } from "next/navigation";
import { postEvent } from "@/actions/acara";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export const PostJudulEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      judul: "",
    },
    validators: { onSubmit: postJudulSchema },
    onSubmit: async ({ value }: { value: TPostJudulSchema }) => {
      setIsLoading(true);
      const data = await postEvent(value);
      if (data.status === "error") {
        toastManager.add({
          type: "error",
          title: "ada yg salah coba ganti judul",
        });
      } else {
        router.push(`/home/events/uploader/${data.msg}`);
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
                  placeholder="Buat acara yang seru apa hari ini?"
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
