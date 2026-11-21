"use client";

import { useForm } from "@tanstack/react-form";
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

  const renderError = (errors: unknown[], isInvalid: boolean) => {
    if (!isInvalid) return null;

    const fieldErrors = errors.map((error) => {
      if (error && typeof error === "object" && "message" in error) {
        return {
          message: String((error as { message?: unknown }).message ?? ""),
        };
      }
      return { message: String(error) };
    });

    return <FieldError errors={fieldErrors} />;
  };

  const fieldError = (field: {
    state: { meta: { isTouched: boolean; isValid: boolean; errors: unknown[] } };
  }) =>
    renderError(
      field.state.meta.errors,
      field.state.meta.isTouched && !field.state.meta.isValid,
    );

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="tanggal">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="finance-tanggal">Tanggal</FieldLabel>
              <Input
                id="finance-tanggal"
                type="date"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={!field.state.meta.isValid}
              />
              {fieldError(field)}
            </Field>
          )}
        </form.Field>

        <form.Field name="metodeTransaksi">
          {(field) => (
            <Field>
              <FieldLabel>Metode transaksi</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
              >
                <SelectTrigger
                  aria-label="Metode transaksi"
                  onBlur={field.handleBlur}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              {fieldError(field)}
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field name="keterangan">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="finance-keterangan">Keterangan</FieldLabel>
            <Textarea
              id="finance-keterangan"
              rows={3}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              aria-invalid={!field.state.meta.isValid}
            />
            {fieldError(field)}
          </Field>
        )}
      </form.Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="kategori">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="finance-kategori">Kategori</FieldLabel>
              <Input
                id="finance-kategori"
                list="finance-kategori-options"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={!field.state.meta.isValid}
              />
              <datalist id="finance-kategori-options">
                {suggestions.categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              {fieldError(field)}
            </Field>
          )}
        </form.Field>

        <form.Field name="penanggungJawab">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="finance-pic">Penanggung jawab</FieldLabel>
              <Input
                id="finance-pic"
                list="finance-pic-options"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={!field.state.meta.isValid}
              />
              <datalist id="finance-pic-options">
                {suggestions.penanggungJawab.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {fieldError(field)}
            </Field>
          )}
        </form.Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <form.Field name="arusKas">
          {(field) => (
            <Field>
              <FieldLabel>Arus kas</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as "Debit" | "Kredit")
                }
              >
                <SelectTrigger aria-label="Arus kas" onBlur={field.handleBlur}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Debit">Debit</SelectItem>
                  <SelectItem value="Kredit">Kredit</SelectItem>
                </SelectContent>
              </Select>
              {fieldError(field)}
            </Field>
          )}
        </form.Field>

        <form.Field name="mataUang">
          {(field) => (
            <Field>
              <FieldLabel>Mata uang</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as "IDR" | "TRY")
                }
              >
                <SelectTrigger aria-label="Mata uang" onBlur={field.handleBlur}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR</SelectItem>
                  <SelectItem value="TRY">TRY</SelectItem>
                </SelectContent>
              </Select>
              {fieldError(field)}
            </Field>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.mataUang}>
          {(mataUang) => (
            <form.Field name={mataUang === "TRY" ? "nominalTry" : "nominalIdr"}>
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="finance-nominal">
                    Nominal ({mataUang})
                  </FieldLabel>
                  <Input
                    id="finance-nominal"
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
                    aria-invalid={!field.state.meta.isValid}
                  />
                  {fieldError(field)}
                </Field>
              )}
            </form.Field>
          )}
        </form.Subscribe>
      </div>

      <form.Field name="rekeningPenampung">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="finance-rekening">Rekening penampung</FieldLabel>
            <Input
              id="finance-rekening"
              list="finance-rekening-options"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              aria-invalid={!field.state.meta.isValid}
            />
            <datalist id="finance-rekening-options">
              {suggestions.rekeningPenampung.map((rekening) => (
                <option key={rekening} value={rekening} />
              ))}
            </datalist>
            {fieldError(field)}
          </Field>
        )}
      </form.Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="penerima">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="finance-penerima">Penerima</FieldLabel>
              <Input
                id="finance-penerima"
                value={field.state.value ?? ""}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="pengirim">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="finance-pengirim">Pengirim</FieldLabel>
              <Input
                id="finance-pengirim"
                value={field.state.value ?? ""}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field name="tautanDokumen">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="finance-dokumen">Tautan dokumen</FieldLabel>
            <Input
              id="finance-dokumen"
              type="url"
              placeholder="https://drive.google.com/…"
              value={field.state.value ?? ""}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              aria-invalid={!field.state.meta.isValid}
            />
            {fieldError(field)}
          </Field>
        )}
      </form.Field>

      {serverError && (
        <p role="alert" className="footnote text-danger">
          {serverError}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
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
