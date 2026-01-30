"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import {
  IconBrandGoogleFilled,
  IconLogout,
  IconTrash,
} from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toastManager } from "./ui/toast";
import { deleteAccount } from "@/lib/action";

export const ButtonField = ({
  formId,
  loading,
}: {
  formId: string;
  loading: boolean;
}) => {
  return (
    <Button type="submit" variant={"default"} form={formId} disabled={loading}>
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
    >
      {loading ? <Spinner /> : <IconBrandGoogleFilled />}
      Register with Google
    </Button>
  );
};

export const SignOutSessionButton = () => {
  const router = useRouter();

  const signout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/auth"),
      },
    });
  };

  return (
    <DropdownMenuItem onClick={signout}>
      <IconLogout />
      Log out
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
          router.refresh();
        } else {
          reject(fetch.msg);
        }
      }),
      {
        error: () => ({
          description: "Silahkan coba lagi",
          title: "Ada yang salah",
        }),
        loading: {
          description: "Mencocokkann data ke database",
          title: "Loading…",
        },
        success: (data: string) => ({
          description: `Berhasil: ${data}`,
          title: "Data kamu sesuai dengan database",
        }),
      },
    );
  };

  return (
    <DropdownMenuItem onClick={handleDeleteAccount} variant="destructive">
      <IconTrash />
      Hapus account
    </DropdownMenuItem>
  );
};
