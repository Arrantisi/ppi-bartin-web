/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formPersonalSchema, FormPersonalSchema } from "@/schemas";
import "react-phone-number-input/style.css";
import { useForm } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook2,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconFileCheck,
  IconGenderBigender,
  IconLanguage,
  IconPhone,
  IconSchool,
  IconUser,
  IconUserScreen,
} from "@tabler/icons-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TanggalLahitField } from "../event/profile/update/tanggal-lahir";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PhoneInput } from "../ui/phone-input";
import { compliteProfile } from "@/server/actions/user";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import {
  SelectAngkatan,
  SelectFakultas,
  SelectJurusan,
  SelectStatusPelajar,
} from "../selects";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const jenisKelaminItems = ["laki-laki", "perempuan"];

const STEPS = [
  {
    id: "foto-pribadi",
    title: "Informasi Pribadi",
    description: "Data diri yang akan ditampilkan di profil",
    icon: IconUser,
  },
  {
    id: "data-akademik",
    title: "Data Akademik",
    description: "Informasi tambahan untuk akademik",
    icon: IconSchool,
  },
  {
    id: "detail-pribadi",
    title: "Detail Pribadi",
    description: "Informasi tambahan untuk profil",
    icon: IconUserScreen,
  },
] as const;

/**
 * Field name per step — dipakai untuk men-touch field sebelum validasi
 * saat user klik "Lanjut".
 */
const STEP_FIELDS = {
  0: ["fileKey", "fullname", "username", "email", "telpon", "noSiswa"],
  1: ["fakultas", "jurusan", "angkatan", "statusPelajar"],
  2: ["tanggalLahir", "jenisKelamin", "Bio", "alamat"],
} as const;

// ─── Variants Animasi ─────────────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const transition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
};

// ─── Komponen ─────────────────────────────────────────────────────────────────

export const UpdateProfileField = () => {
  const [isFakultas, setIsFakultas] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  // direction: +1 = maju, -1 = mundur
  const [direction, setDirection] = useState(1);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      fakultas: "",
      statusPelajar: "",
      angkatan: "",
      jurusan: "",
      telpon: "",
      username: "",
      tanggalLahir: new Date(),
      jenisKelamin: "",
    },
    validators: {
      onSubmit: formPersonalSchema,
    },
    onSubmit: async ({ value }: { value: FormPersonalSchema }) => {
      setIsLoading(true);
      const fetch = await compliteProfile(value);
      if (fetch.status === "error") {
        toast.error("Kesalahan", { description: fetch.msg });
      } else if (fetch.status === "success") {
        toast.success("Profil kamu sudah up to date");
        router.push("/home");
      }
      setIsLoading(false);
    },
  });

  // ── Navigasi step ──────────────────────────────────────────────────────────

  const handleNextStep = () => {
    const fields = STEP_FIELDS[currentStep as keyof typeof STEP_FIELDS];

    fields.forEach((fieldName) => {
      form.setFieldMeta(fieldName as any, (prev) => ({
        ...prev,
        isTouched: true,
      }));
    });

    const state = form.state;
    const hasError = fields.some((f) => {
      const meta = state.fieldMeta[f as keyof typeof state.fieldMeta];
      return meta?.errors && meta.errors.length > 0;
    });

    if (!hasError) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const isLastStep = currentStep === STEPS.length - 1;

  // ── date today ─────────────────────────────────────────────────────────────────
  const isDateToday = (date: Date | undefined) => {
    if (!date) return true; // kosong = tidak valid
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Step Indicator ── */}
      <div className="flex items-center justify-between px-5 py-4 gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              animate={{
                scale: i === currentStep ? 1.5 : 1.4,
                backgroundColor:
                  i < currentStep
                    ? "var(--primary)"
                    : i === currentStep
                      ? "var(--primary)"
                      : "var(--card)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                i <= currentStep
                  ? "text-primary-foreground"
                  : "text-card-foreground shadow",
                i === currentStep && "ring-2 ring-primary/30",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {i < currentStep ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <IconCheck size={14} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="number"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <s.icon size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            <span className="text-[10px] text-center hidden sm:block text-foreground/60">
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* ── Step Header ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`header-${currentStep}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="bg-accent/50 py-6 px-5 space-y-1 mb-3 mt-2"
        >
          <h3 className="text-[15px] leading-3.75 font-semibold">
            {STEPS[currentStep].title}
          </h3>
          <p className="text-[12px] leading-4.5 text-foreground/40">
            {STEPS[currentStep].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <form
        id="update-profile-field"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* ── Animated Step Content ── */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              {/* ════════════════════════════════════════════════════════════ */}
              {/* STEP 0 — Informasi Pribadi                                  */}
              {/* ════════════════════════════════════════════════════════════ */}
              {currentStep === 0 && (
                <div className="space-y-5">
                  <div className="mx-3 space-y-5">
                    {/* Username */}
                    <form.Field name="username">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <FieldLabel className="gap-1">
                              <IconUser size={18} className="text-primary" />
                              Username
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>

                    {/* Nomor Telephone */}
                    <form.Field name="telpon">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <FieldLabel className="gap-1">
                              <IconPhone size={18} className="text-primary" />
                              Nomor Whatsapp
                            </FieldLabel>
                            <PhoneInput
                              type="tel"
                              placeholder="masukkan nomor telpon"
                              defaultCountry="TR"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e)}
                            />
                            <FieldDescription className="text-[12px] leading-tight">
                              Gunakan nomor whatsapp anda untuk komunikasi.
                            </FieldDescription>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>
                    <p className="text-[12px] leading-4.5 text-foreground/40">
                      Tekan Tombol &quot;Lanjut&quot; untuk step selanjutnya.
                    </p>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* STEP 1 — Data Akademik                                      */}
              {/* ════════════════════════════════════════════════════════════ */}
              {currentStep === 1 && (
                <div className="mx-3 space-y-5">
                  {/* Fakultas & Jurusan */}
                  <div className="grid grid-cols-2 items-center gap-2">
                    <form.Field name="fakultas">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <FieldLabel>
                              <IconBuilding
                                size={18}
                                className="text-primary"
                              />
                              Fakultas{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={(e) => {
                                field.handleChange(e);
                                setIsFakultas(e);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Fakultas" />
                              </SelectTrigger>
                              <SelectFakultas />
                            </Select>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>

                    <form.Field name="jurusan">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <FieldLabel>
                              <IconBook2 size={18} className="text-primary" />
                              Jurusan{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={field.handleChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="jurusan" />
                              </SelectTrigger>
                              <SelectJurusan fakultas={isFakultas} />
                            </Select>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>
                  </div>

                  {/* Angkatan & Status Pelajar */}
                  <div className="flex items-center gap-2">
                    <form.Field name="angkatan">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <FieldLabel>
                              <IconCalendar
                                size={18}
                                className="text-primary"
                              />
                              Angkatan{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={(e) => field.handleChange(e)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="angkatan" />
                              </SelectTrigger>
                              <SelectAngkatan />
                            </Select>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>

                    <form.Field name="statusPelajar">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <FieldLabel>
                              <IconLanguage
                                size={18}
                                className="text-primary"
                              />
                              Status Pelajar{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={field.handleChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="status pelajar" />
                              </SelectTrigger>
                              <SelectStatusPelajar />
                            </Select>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>
                  </div>
                  <p className="text-[12px] leading-4.5 text-foreground/40">
                    Tekan Tombol &quot;Lanjut&quot; untuk step selanjutnya.
                  </p>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* STEP 2 — Detail Pribadi                                     */}
              {/* ════════════════════════════════════════════════════════════ */}
              {currentStep === 2 && (
                <div className="mx-3 space-y-5">
                  {/* Tanggal Lahir & Jenis Kelamin */}
                  <div className="flex items-center gap-2">
                    <form.Field
                      name="tanggalLahir"
                      validators={{
                        onChange: ({ value }) => {
                          if (!value) return "Tanggal lahir wajib diisi";
                          if (isDateToday(value))
                            return "Tanggal lahir tidak boleh hari ini";
                          return undefined;
                        },
                      }}
                    >
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <FieldLabel>
                              <IconCalendar
                                size={18}
                                className="text-primary"
                              />
                              Tanggal Lahir{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <TanggalLahitField
                              value={field.state.value}
                              onChange={(e) => {
                                if (e) field.handleChange(e);
                                else
                                  field.handleChange(
                                    undefined as unknown as Date,
                                  );
                              }}
                            />
                            {isInvalid && (
                              <FieldError
                                errors={field.state.meta.errors.map((e) =>
                                  typeof e === "string" ? { message: e } : e,
                                )}
                              />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>

                    <form.Field name="jenisKelamin">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <FieldLabel>
                              <IconGenderBigender
                                size={18}
                                className="text-primary"
                              />
                              Jenis Kelamin{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={field.handleChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Kelamin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {jenisKelaminItems.map((item) => (
                                    <SelectItem key={item} value={item || ""}>
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>
                  </div>
                  <p className="text-[12px] leading-4.5 text-foreground/40">
                    Jika tombol &quot;Simpan Peruabahan&quot; tidak berfungsi
                    silahkan cek step sebelum nya, mungkin ada input yg nggk
                    sesuai.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </form>

      {/* ── Tombol Navigasi ── */}
      <div className="mx-3 mt-5 flex gap-2">
        <AnimatePresence initial={false}>
          {currentStep > 0 && (
            <motion.div
              key="prev-btn"
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex-1 overflow-hidden"
            >
              <Button
                type="button"
                variant="outline"
                className="w-full text-[14px] leading-6 rounded-xl"
                onClick={handlePrevStep}
                disabled={isLoading}
              >
                <IconArrowLeft size={18} />
                Kembali
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="flex-1"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!isLastStep ? (
              <motion.div
                key="next-btn"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <Button
                  type="button"
                  className="w-full text-[14px] leading-6 rounded-xl"
                  onClick={handleNextStep}
                >
                  Lanjut
                  <IconArrowRight size={18} />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="submit-btn"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <Button
                  type="submit"
                  form="update-profile-field"
                  className="w-full text-[14px] leading-6 rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner className="size-4.5" />
                  ) : (
                    <IconFileCheck size={18} />
                  )}
                  Simpan Perubahan
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {/* ── Progress bar ──
      <div className="rounded-xl border my-3 py-4 px-3">
        <h1 className="font-semibold text-xl">Selesaikan pendaftaran Anda</h1>
        <div className=" h-1 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{
              width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div> */}
    </div>
  );
};
