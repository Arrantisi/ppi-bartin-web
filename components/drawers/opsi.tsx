import React from "react";
import { DrawerContent, DrawerTitle } from "../ui/drawer";
import { Button, buttonVariants } from "../ui/button";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { handleCopyLink } from "@/utils/copy-link";
import Link from "next/link";
import { AlertDialogTrigger } from "../animate-ui/components/base/alert-dialog";

export const DrawerOpsi = ({
  userId,
  creatorId,
  slug,
  title,
}: {
  userId: string;
  creatorId: string;
  slug: string;
  title: "berita" | "acara";
}) => {
  const matchCreator = userId === creatorId;

  return (
    <DrawerContent className="p-4">
      <div className="flex flex-col gap-2 pb-6">
        <DrawerTitle className="text-center text-sm font-medium text-muted-foreground mb-4 capitalize">
          Opsi {title}
        </DrawerTitle>

        <Button
          variant="ghost"
          className="justify-start gap-3 h-10"
          onClick={() => handleCopyLink()}
        >
          <IconCopy size={20} className="text-success" /> Salin Link
        </Button>

        {matchCreator && (
          <>
            <Link href={`/home/${title}/update/${slug}`}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10"
              >
                <IconEdit size={20} className="text-info" /> Edit Acara
              </Button>
            </Link>

            <AlertDialogTrigger
              className={buttonVariants({
                variant: "destructive-outline",
                className:
                  "w-full justify-start gap-3 h-10 border-none shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none",
              })}
            >
              <IconTrash size={20} />
              <span>Hapus Acara</span>
            </AlertDialogTrigger>
          </>
        )}
      </div>
    </DrawerContent>
  );
};
