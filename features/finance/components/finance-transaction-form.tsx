"use client";

import { useForm } from "@tanstack/react-form";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  createFinanceTransactionSchema,
  type TCreateFinanceTransaction,
  type TUpdateFinanceTransaction,
} from "@/schemas/finance";
import type { TFinanceTransaction } from "@/types/finance";

const FinanceDatePicker = dynamic(
  () =>
    import("./finance-date-picker").then(
      (module) => module.FinanceDatePicker,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 w-full rounded-xl border border-border bg-surface" />
    ),
  },
);

type TFinanceSuggestions = {
  categories: string[];
  penanggungJawab: string[];
  rekeningPenampung: string[];
};

type TFinanceSubmitResult = {
  success: boolean;
  error?: string;
  message?: string;
};

type TFinanceTransactionFormProps = {
  mode: "create" | "edit";
  transaction?: TFinanceTransaction;
  suggestions: TFinanceSuggestions;
  onSubmit: (
    values: TCreateFinanceTransaction | TUpdateFinanceTransaction,
  ) => Promise<TFinanceSubmitResult>;
  onSuccess: () => void;
  onCancel: () => void;
};

/** Bagian state field yang dipakai helper tampilan/error di bawah. */
type TFinanceFieldLike = {
  state: {
    meta: {
      isTouched: boolean;
      isValid: boolean;
      errors: unknown[];
    };
  };
};

const toErrorList = (errors: unknown[]) =>
  errors.map((error) => {
    if (error && typeof error === "object" && "message" in error) {
      return {
        message: String((error as { message?: unknown }).message ?? ""),
      };
    }
    return { message: String(error) };
  });

const isFieldInvalid = (field: TFinanceFieldLike) =>
  field.state.meta.isTouched && !field.state.meta.isValid;

const describedBy = (field: TFinanceFieldLike, id: string) =>
  isFieldInvalid(field) ? `${id}-error` : undefined;

function FieldMessage({
  id,
  field,
}: {
  id: string;
  field: TFinanceFieldLike;
}) {
  if (!isFieldInvalid(field)) return null;

  return <FieldError id={id} errors={toErrorList(field.state.meta.errors)} />;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export function FinanceTransactionForm({
  mode,
  transaction,
  suggestions,
  onSubmit,
  onSuccess,
  onCancel,
}: TFinanceTransactionFormProps) {
  const [serverError, setServerError] = useState("");

  const form = useForm({
    validators: { onSubmit: createFinanceTransactionSchema },
    defaultValues: {
      tanggal: transaction?.tanggal ?? todayIso(),
      keterangan: transaction?.keterangan ?? "",
      kategori: transaction?.kategori ?? "",
      arusKas: transaction?.arusKas ?? "Debit",
      mataUang: transaction?.mataUang ?? "IDR",
      nominalTry: transaction?.nominalTry || undefined,
      nominalIdr: transaction?.nominalIdr || undefined,
      metodeTransaksi: transaction?.metodeTransaksi ?? "Transfer",
      penanggungJawab: transaction?.penanggungJawab ?? "",
      rekeningPenampung: transaction?.rekeningPenampung ?? "",
      penerima: transaction?.penerima ?? "",
      pengirim: transaction?.pengirim ?? "",
      tautanDokumen: transaction?.tautanDokumen ?? "",
    } as TCreateFinanceTransaction,
    onSubmit: async ({ value }) => {
      setServerError("");

      const payload: TCreateFinanceTransaction | TUpdateFinanceTransaction =
        mode === "edit" && transaction
          ? { ...value, rowNumber: transaction.rowNumber }
          : value;

      const result = await onSubmit(payload);
      if (!result.success) {
        setServerError(result.error ?? "Gagal menyimpan transaksi");
        toast.error(result.error ?? "Gagal menyimpan transaksi");
        return;
      }

      toast.success(result.message ?? "Transaksi tersimpan");
      form.reset();
      onSuccess();
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <form.Field name="tanggal">
          {(field) => {
            const id = "finance-tanggal";
            const invalid = isFieldInvalid(field);

            return (
              <Field data-invalid={invalid}>
                <FieldLabel id={`${id}-label`} htmlFor={id}>
                  Tanggal
                </FieldLabel>
                <FinanceDatePicker
                  id={id}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  invalid={invalid}
                  describedBy={describedBy(field, id)}
                  labelledBy={`${id}-label`}
                />
                <FieldMessage id={`${id}-error`} field={field} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="metodeTransaksi">
          {(field) => {
            const id = "finance-metode";
            const invalid = isFieldInvalid(field);

            return (
              <Field data-invalid={invalid}>
                <FieldLabel id={`${id}-label`} htmlFor={id}>
                  Metode transaksi
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger
                    id={id}
                    aria-label="Metode transaksi"
                    aria-labelledby={`${id}-label`}
                    aria-invalid={invalid || undefined}
                    aria-describedby={describedBy(field, id)}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <FieldMessage id={`${id}-error`} field={field} />
              </Field>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="keterangan">
        {(field) => {
          const id = "finance-keterangan";
          const invalid = isFieldInvalid(field);

          return (
            <Field data-invalid={invalid}>
              <FieldLabel id={`${id}-label`} htmlFor={id}>
                Keterangan
              </FieldLabel>
              <Textarea
                id={id}
                rows={2}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy(field, id)}
              />
              <FieldMessage id={`${id}-error`} field={field} />
            </Field>
          );
        }}
      </form.Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <form.Field name="kategori">
          {(field) => {
            const id = "finance-kategori";
            const invalid = isFieldInvalid(field);

            return (
              <Field data-invalid={invalid}>
                <FieldLabel id={`${id}-label`} htmlFor={id}>
                  Kategori
                </FieldLabel>
                <Input
                  id={id}
                  list={`${id}-options`}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={invalid || undefined}
                  aria-describedby={describedBy(field, id)}
                />
                <datalist id={`${id}-options`}>
                  {suggestions.categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
                <FieldMessage id={`${id}-error`} field={field} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="penanggungJawab">
          {(field) => {
            const id = "finance-pic";
            const invalid = isFieldInvalid(field);

            return (
              <Field data-invalid={invalid}>
                <FieldLabel id={`${id}-label`} htmlFor={id}>
                  Penanggung jawab
                </FieldLabel>
                <Input
                  id={id}
                  list={`${id}-options`}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={invalid || undefined}
                  aria-describedby={describedBy(field, id)}
                />
                <datalist id={`${id}-options`}>
                  {suggestions.penanggungJawab.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
                <FieldMessage id={`${id}-error`} field={field} />
              </Field>
            );
          }}
        </form.Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <form.Field name="arusKas">
          {(field) => {
            const id = "finance-arus-kas";
            const invalid = isFieldInvalid(field);

            return (
              <Field data-invalid={invalid}>
                <FieldLabel id={`${id}-label`} htmlFor={id}>
                  Arus kas
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "Debit" | "Kredit")
                  }
                >
                  <SelectTrigger
                    id={id}
                    aria-label="Arus kas"
                    aria-labelledby={`${id}-label`}
                    aria-invalid={invalid || undefined}
                    aria-describedby={describedBy(field, id)}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Debit">Debit</SelectItem>
                    <SelectItem value="Kredit">Kredit</SelectItem>
                  </SelectContent>
                </Select>
                <FieldMessage id={`${id}-error`} field={field} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="mataUang">
          {(field) => {
            const id = "finance-mata-uang";
            const invalid = isFieldInvalid(field);

            return (
              <Field data-invalid={invalid}>
                <FieldLabel id={`${id}-label`} htmlFor={id}>
                  Mata uang
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "IDR" | "TRY")
                  }
                >
                  <SelectTrigger
                    id={id}
                    aria-label="Mata uang"
                    aria-labelledby={`${id}-label`}
                    aria-invalid={invalid || undefined}
                    aria-describedby={describedBy(field, id)}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IDR">IDR</SelectItem>
                    <SelectItem value="TRY">TRY</SelectItem>
                  </SelectContent>
                </Select>
                <FieldMessage id={`${id}-error`} field={field} />
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.mataUang}>
          {(mataUang) => (
            <form.Field
              name={mataUang === "TRY" ? "nominalTry" : "nominalIdr"}
            >
              {(field) => {
                const id = "finance-nominal";
                const invalid = isFieldInvalid(field);

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel id={`${id}-label`} htmlFor={id}>
                      Nominal ({mataUang})
                    </FieldLabel>
                    <Input
                      id={id}
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      value={field.state.value ?? ""}
                      onChange={(event) =>
                        field.handleChange(
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={invalid || undefined}
                      aria-describedby={describedBy(field, id)}
                    />
                    <FieldMessage id={`${id}-error`} field={field} />
                  </Field>
                );
              }}
            </form.Field>
          )}
        </form.Subscribe>
      </div>

      <form.Field name="rekeningPenampung">
        {(field) => {
          const id = "finance-rekening";
          const invalid = isFieldInvalid(field);

          return (
            <Field data-invalid={invalid}>
              <FieldLabel id={`${id}-label`} htmlFor={id}>
                Rekening penampung
              </FieldLabel>
              <Input
                id={id}
                list={`${id}-options`}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy(field, id)}
              />
              <datalist id={`${id}-options`}>
                {suggestions.rekeningPenampung.map((rekening) => (
                  <option key={rekening} value={rekening} />
                ))}
              </datalist>
              <FieldMessage id={`${id}-error`} field={field} />
            </Field>
          );
        }}
      </form.Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <form.Field name="penerima">
          {(field) => {
            const id = "finance-penerima";
            const invalid = isFieldInvalid(field);

            return (
              <Field data-invalid={invalid}>
                <FieldLabel id={`${id}-label`} htmlFor={id}>
                  Penerima
                </FieldLabel>
                <Input
                  id={id}
                  value={field.state.value ?? ""}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={invalid || undefined}
                  aria-describedby={describedBy(field, id)}
                />
                <FieldMessage id={`${id}-error`} field={field} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="pengirim">
          {(field) => {
            const id = "finance-pengirim";
            const invalid = isFieldInvalid(field);

            return (
              <Field data-invalid={invalid}>
                <FieldLabel id={`${id}-label`} htmlFor={id}>
                  Pengirim
                </FieldLabel>
                <Input
                  id={id}
                  value={field.state.value ?? ""}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={invalid || undefined}
                  aria-describedby={describedBy(field, id)}
                />
                <FieldMessage id={`${id}-error`} field={field} />
              </Field>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="tautanDokumen">
        {(field) => {
          const id = "finance-dokumen";
          const invalid = isFieldInvalid(field);

          return (
            <Field data-invalid={invalid}>
              <FieldLabel id={`${id}-label`} htmlFor={id}>
                Tautan dokumen
              </FieldLabel>
              <Input
                id={id}
                type="url"
                placeholder="https://drive.google.com/…"
                value={field.state.value ?? ""}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy(field, id)}
              />
              <FieldMessage id={`${id}-error`} field={field} />
            </Field>
          );
        }}
      </form.Field>

      {serverError ? (
        <Field data-invalid>
          <FieldError id="finance-server-error">{serverError}</FieldError>
        </Field>
      ) : null}

      <div className="sticky bottom-0 z-10 flex justify-end gap-2 border-t border-border bg-popover pt-3 pb-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner aria-hidden />}
              {mode === "edit" ? "Simpan perubahan" : "Simpan transaksi"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
