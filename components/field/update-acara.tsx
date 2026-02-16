"use client";

import { FormAcara, formAcara } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { Field, FieldLabel, FieldDescription, FieldError } from "../ui/field";
import { Button } from "../ui/button";
import { DatePickerField } from "../event/date-picker-field";
import { toastManager } from "../ui/toast";
import { updateAcara } from "@/actions/acara";
import { Textarea } from "../ui/textarea";
import props from "@/data/create-acara-props.json";
import slugify from "slugify";
import { IconSparkles } from "@tabler/icons-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export const UpdateAcaraField = ({
  onClose,
  content,
  date,
  judul,
  lokasi,
  slug,
  maxCapacity,
}: {
  onClose: () => void;
  judul: string;
  slug: string;
  date: Date;
  lokasi: string;
  content: string;
  maxCapacity: number;
}) => {
  // const { data: session } = useQuery({
  //   queryKey: ["getUpdateAcara", slug],
  //   queryFn: () => getAcaraPreview(slug),
  // });

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      slug,
      judul,
      lokasi,
      date,
      content,
      maxCapacity,
    },
    validators: { onSubmit: formAcara },
    onSubmit: async ({ value }: { value: FormAcara }) => {
      setIsLoading(true);
      const matched = await updateAcara(value);
      if (matched.status === "error") {
        toastManager.add({
          type: "error",
          title: "ada kesalahan",
          description: matched.msg,
        });
      } else if (matched.status === "success") {
        toastManager.add({
          type: "success",
          title: "berhasil update",
          description: matched.msg,
        });
        onClose();
      }
      setIsLoading(false);
    },
  });

  const handleSlug = () => {
    const titleValue = form.getFieldValue("judul");

    const slug = slugify(titleValue, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    form.setFieldValue("slug", slug);
  };

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

          <form.Field name="slug">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <div className="flex justify-between ">
                    <FieldLabel>{props.textarea[4].label}</FieldLabel>
                    <Button
                      size={"xs"}
                      className="rounded-full text-xs"
                      onClick={handleSlug}
                    >
                      Generate Slug <IconSparkles />
                    </Button>
                  </div>

                  <Textarea
                    id={field.name}
                    placeholder={props.textarea[4].placeholder}
                    className="focus-visible:ring-primary"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  <FieldDescription className="text-[12px] leading-tight">
                    {props.textarea[4].description}
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
                    className="min-h-[155px]"
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
      <div className="flex items-center justify-end gap-2">
        <Button
          variant={"outline"}
          className="text-sm rounded-full px-4 py-3 w-28"
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          className="text-sm rounded-full px-4 py-3 w-28"
          form="create-acara-form"
          type="submit"
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Spinner /> Uploading
            </span>
          ) : (
            "Upload"
          )}
        </Button>
      </div>
    </div>
  );
};
