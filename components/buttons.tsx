"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import {
  IconArrowLeft,
  IconArrowLeftDashed,
  IconHandClick,
  IconLogout,
  IconMoon,
  IconPlus,
  IconSun,
  IconTrash,
} from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/server/actions/setting-user";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import HoldButton from "./kokonutui/hold-button";
import { cancelParticipant, joinEvent } from "@/server/actions/acara";
import { toast } from "sonner";

export const HoldButtonCancel = ({
  eventId,
  participantId,
}: {
  eventId: string;
  participantId: string;
}) => {
  const [onLoading, setOnLoading] = useState(false);

  const handleCancelEvent = async () => {
    setOnLoading(true);
    const respons = await cancelParticipant(eventId, participantId);
    if (respons.status === "error") {
      toast.error("Gagal", { description: respons.msg });
    } else if (respons.status === "success") {
      toast.warning("Peringatan", { description: respons.msg });
    }
    setOnLoading(false);
  };

  return (
    <HoldButton
      holdDuration={1500}
      variant={"outline"}
      className="w-full text-center text-sm rounded-full capitalize py-2.5 px-3 select-none text-destructive border-destructive"
      onComplete={() => handleCancelEvent()}
      disabled={onLoading}
    >
      {onLoading ? (
        <h1 className="flex gap-2 items-center">
          <Spinner className="size-4" /> Memproses
        </h1>
      ) : (
        <h1 className="flex gap-2 items-center">
          <IconHandClick className="size-4" /> <span>Tekan Untuk Batal</span>
        </h1>
      )}
    </HoldButton>
  );
};

export const HoldButtonJoin = ({
  children,
  eventId,
}: {
  eventId: string;
  children: React.ReactNode;
}) => {
  const [onLoading, setOnLoading] = useState(false);

  const handleJoinEvent = async () => {
    setOnLoading(true);
    try {
      const fetch = await joinEvent(eventId);
      if (fetch.status === "error") {
        toast.error(`maaf ${fetch.msg}`);
      } else {
        toast.success("Selamat, kamu sudah join event");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOnLoading(false);
    }
  };
  return (
    <HoldButton
      holdDuration={1500}
      className="w-full text-center text-sm rounded-full capitalize py-2.5 px-3 select-none"
      onComplete={() => handleJoinEvent()}
      disabled={onLoading}
    >
      {onLoading ? (
        <h1 className="flex gap-2 items-center">
          <Spinner className="size-4" /> Memproses
        </h1>
      ) : (
        <h1 className="flex gap-2 items-center">
          <IconHandClick className="size-4" /> <span>{children}</span>
        </h1>
      )}
    </HoldButton>
  );
};

export const ButtonHeaderField = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center my-5">
      <Button
        onClick={() => router.push(href)}
        variant={"outline"}
        className="absolute left-2 rounded-full border-none"
      >
        <IconArrowLeft />
      </Button>
      <h1 className="title-tiga">{label}</h1>
    </div>
  );
};

export const ButtonCreate = ({ catagory }: { catagory: "news" | "events" }) => {
  const page =
    catagory === "events" ? "/home/events/create" : "/home/news/create";

  return (
    <Link href={page} className={"rounded-full bg-primary p-1.5 text-white"}>
      <IconPlus />
    </Link>
  );
};

export const ButtonSettings = ({
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      {...props}
      className="min-w-20
  "
    >
      {children}
    </Button>
  );
};

export const ButtonField = ({
  formId,
  loading,
}: {
  formId: string;
  loading: boolean;
}) => {
  return (
    <Button
      type="submit"
      variant={"default"}
      form={formId}
      disabled={loading}
      className="w-full text-sm capitalize"
    >
      {loading && <Spinner />} cocokkan data
    </Button>
  );
};

export const GoogleProvider = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/home",
    });
    setLoading(false);
  };

  return (
    <Button
      type="button"
      variant={"outline"}
      onClick={() => signIn()}
      disabled={loading}
      className="py-5 w-full"
    >
      {loading ? (
        <Spinner />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="0.98em"
          height="1em"
          viewBox="0 0 256 262"
        >
          <path
            fill="#4285f4"
            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          ></path>
          <path
            fill="#34a853"
            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          ></path>
          <path
            fill="#fbbc05"
            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
          ></path>
          <path
            fill="#eb4335"
            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          ></path>
        </svg>
      )}
      <span className="text-sm">Sign in with Google</span>
    </Button>
  );
};

export const SignOutSessionButton = () => {
  const router = useRouter();

  const signout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.refresh(),
      },
    });
  };

  return (
    <DropdownMenuItem onClick={signout}>
      <IconLogout />
      Keluar
    </DropdownMenuItem>
  );
};

export const DeleteAccount = () => {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const fetch = await deleteAccount();
    if (fetch.status === "success") {
      toast.success(fetch.msg);
      // Gunakan router.push atau refresh setelah berhasil
      router.refresh();
    } else {
      toast.error(fetch.msg);
    }
  };

  return (
    <Button onClick={handleDeleteAccount} variant="destructive">
      <IconTrash />
      Hapus account
    </Button>
  );
};

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  const handleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => handleTheme()}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <IconSun
        className={cn(
          "size-4 transition-all duration-300",
          theme === "dark"
            ? "scale-0 -rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100",
        )}
      />
      <IconMoon
        className={cn(
          "absolute size-4 transition-all duration-300",
          theme === "dark"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 rotate-90 opacity-0",
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export const ButtonPreviusePage = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()}>
      <IconArrowLeftDashed /> Kembali
    </Button>
  );
};
