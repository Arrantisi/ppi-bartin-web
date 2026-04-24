"use client";

import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "../animate-ui/components/base/alert-dialog";
import { AlertDialogClose } from "../animate-ui/primitives/base/alert-dialog";
import { deleteEvent } from "@/server/actions/acara";
import { deleteNews } from "@/server/actions/news";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AlertDEelete = ({
  type,
  id,
  onClick,
  href,
}: {
  type: "berita" | "acara";
  id: string;
  href: string;
  onClick: () => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const hendleDelete = async () => {
    setIsLoading(true);
    let deleteData;
    if (type === "acara") {
      deleteData = await deleteEvent(id);
    } else {
      deleteData = await deleteNews(id);
    }
    if (deleteData.status === "success") {
      toast.success(deleteData.msg);
      router.push(href);
      onClick();
    } else {
      toast.error(deleteData.msg);
      onClick();
    }
    setIsLoading(false);
  };

  return (
    <AlertDialogPopup>
      <AlertDialogHeader>
        <AlertDialogTitle>Hapus {type}</AlertDialogTitle>
        <AlertDialogDescription>
          Apakah kamu yakin ingin menghapus {type} ini
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogClose>Tutup</AlertDialogClose>
        <AlertDialogAction onClick={() => hendleDelete()} disabled={isLoading}>
          {isLoading && <Spinner />} Hapus
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogPopup>
  );
};
