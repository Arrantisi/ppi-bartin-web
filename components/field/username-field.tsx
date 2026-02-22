"use client";

import { formUsername, FormUsername } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { postUsername } from "@/server/actions/user";
import { Field, FieldDescription, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import props from "@/props/username-props.json";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { goeyToast } from "../ui/goey-toaster";

export const UsernameField = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
    },
    validators: {
      onSubmit: formUsername,
    },
    onSubmit: async ({ value }: { value: FormUsername }) => {
      setLoading(true);
      goeyToast.promise(
        new Promise<string>(async (resolve, rejects) => {
          const matched = await postUsername(value);
          if (matched.status === "success") {
            resolve(matched.msg);
            onClose();
          } else {
            rejects(new Error(matched.msg));
          }
        }),
        {
          loading: "Memverifikasi...",
          success: "Verifikasi Berhasil",
          error: "Something went wrong",
          description: {
            success: `Mantap! kamu dah punya username baru ${value.username}`,
            error: "Username sudah ada yang make.",
          },
        },
      );

      setLoading(false);
    },
  });

  return (
    <div>
      <div className="relative flex items-center gap-2">
        <form
          className="space-y-4 w-full"
          id="username-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="username">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field className="space-y-2">
                  <Input
                    id={field.name}
                    placeholder={props.placeholder}
                    className="focus-visible:ring-primary"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </form>
        <Button
          className="text-xs rounded-full min-w-20"
          type="submit"
          form="username-form"
        >
          {loading ? <Spinner /> : props.submit}
        </Button>
      </div>
      <FieldDescription className="text-[12px] leading-tight text-center pt-4">
        {props.description}
      </FieldDescription>
    </div>
  );
};
