"use client";

import { updateEventField, TUpdateEventField } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Field, FieldLabel, FieldDescription, FieldError } from "../ui/field";
import { Button, buttonVariants } from "../ui/button";
import { DatePickerField } from "../event/date-picker-field";
import { toastManager } from "../ui/toast";
import { updateAcara } from "@/actions/acara";
import { Textarea } from "../ui/textarea";
import props from "@/data/create-acara-props.json";
import { Input } from "../ui/input";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { getEventBySlug } from "@/data/events";
import Link from "next/link";

export const UpdateAcaraField = ({ slug }: { slug: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["getEventBySlug"],
    queryFn: () => getEventBySlug(slug),
  });

  console.log(slug);

  const form = useForm({
    defaultValues: {
      judul: data?.judul || "",
      lokasi: data?.lokasi || "",
      date: data?.date || new Date(),
      content: data?.content || "",
      maxCapacity: data?.maxCapacity || 0,
    },
    validators: { onSubmit: updateEventField },
    onSubmit: async ({ value }: { value: TUpdateEventField }) => {
      setIsLoading(true);
      const matched = await updateAcara(slug, value);
      if (matched.status === "error") {
        toastManager.add({
          type: "error",
          title: "ada kesalahan",
          description: matched.msg,
        });
      } else if (matched.status === "success") {
        router.push(`/home/events`);
      }

      setIsLoading(false);
    },
  });

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between h-full pb-4">
      <div>
        <form
          className="space-y-4"
          id="create-acara-form"
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
                <Field>
                  <FieldLabel>{props.textarea[0].label}</FieldLabel>

                  <Textarea
                    id={field.name}
                    placeholder={props.textarea[0].placeholder}
                    className="focus-visible:ring-primary"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  <FieldDescription className="text-[12px] leading-tight">
                    {props.textarea[0].description}
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="date">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>{props.textarea[1].label}</FieldLabel>
                  <DatePickerField
                    onChange={(e) => {
                      if (e) field.handleChange(e);
                    }}
                    value={field.state.value}
                  />
                  <FieldDescription className="text-[12px] leading-tight">
                    {props.textarea[1].description}
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="maxCapacity">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>{props.textarea[5].label}</FieldLabel>

                  <Input
                    type="number"
                    id={field.name}
                    placeholder={props.textarea[5].placeholder}
                    className="focus-visible:ring-primary"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />

                  <FieldDescription className="text-[12px] leading-tight">
                    {props.textarea[5].description}
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="lokasi">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>{props.textarea[2].label}</FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder={props.textarea[2].placeholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription className="text-[12px] leading-tight">
                    {props.textarea[2].description}
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="content">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>{props.textarea[3].label}</FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder={props.textarea[3].placeholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-[350px]"
                  />
                  <FieldDescription className="text-[12px] leading-tight">
                    {props.textarea[3].description}
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </form>
      </div>
      <div className="grid grid-cols-2 items-center justify-center gap-2 mt-4">
        <Link
          href={"/home/events"}
          className={buttonVariants({
            variant: "secondary",
            className: "text-sm rounded-full px-4 py-3 w-full",
          })}
        >
          cancel
        </Link>
        <Button
          disabled={isLoading}
          className="text-sm rounded-full px-4 py-3 w-full"
          form="create-acara-form"
          type="submit"
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Spinner /> Publishing
            </span>
          ) : (
            "Publish"
          )}
        </Button>
      </div>
    </div>
  );
};
