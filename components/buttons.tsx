"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import {
  IconArrowLeftDashed,
  IconLogout,
  IconMoonStars,
  IconShareplay,
  IconSunHighFilled,
  IconTrash,
} from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toastManager } from "./ui/toast";
import { deleteAccount } from "@/lib/action";
import { useTheme } from "next-themes";
import Link from "next/link";

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
      className="w-full"
    >
      {loading && <Spinner />} Submit
    </Button>
  );
};

export const GoogleProvider = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
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
      <span>Sign in with Google</span>
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
    toastManager.promise(
      new Promise<string>(async (resolve, reject) => {
        const fetch = await deleteAccount();
        if (fetch.status === "success") {
          resolve(fetch.msg);
          // Gunakan router.push atau refresh setelah berhasil
          router.refresh();
        } else {
          reject(new Error(fetch.msg));
        }
      }),
      {
        loading: {
          title: "Menghapus Akun...",
          description: "Sedang membersihkan data kamu dari sistem PPI Bartın.",
        },
        success: () => ({
          title: "Akun Terhapus",
          description:
            "Semua data profil kamu telah berhasil dihapus secara permanen.",
        }),
        error: () => ({
          title: "Gagal Menghapus",
          description:
            "Terjadi kendala teknis. Silakan coba lagi atau hubungi admin.",
        }),
      },
    );
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
    <Button onClick={() => handleTheme()}>
      {theme === "dark" ? (
        <>
          <IconSunHighFilled /> <span>light mode</span>
        </>
      ) : (
        <>
          <IconMoonStars /> <span>dark mode</span>
        </>
      )}
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

export const AdminLink = () => {
  return (
    <Link
      href={""}
      className="font-sm text-sm flex items-center text-primary hover:underline underline-offset-4"
    >
      PPI Bartin
      <IconShareplay className="size-4 mx-1" />
    </Link>
  );
};
