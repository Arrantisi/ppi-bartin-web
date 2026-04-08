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
import { goeyToast } from "../ui/goey-toaster";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export const AlertDEelete = ({
  type,
  id,
  onClick,
}: {
  type: "berita" | "acara";
  id: string;
  onClick: () => void;
}) => {
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
      goeyToast.success(deleteData.msg);
      onClick();
    } else {
      goeyToast.error(deleteData.msg);
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
