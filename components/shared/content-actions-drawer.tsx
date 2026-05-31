import React from "react";
import Link from "next/link";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";

import { handleCopyLink } from "@/utils/copy-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { DrawerContent, DrawerTitle } from "@/components/ui/drawer";

export const DrawerOpsi = ({
  userId,
  creatorId,
  slug,
  title,
  onDelete,
}: {
  userId: string;
  creatorId: string;
  slug: string;
  title: "berita" | "acara";
  onDelete?: () => void;
}) => {
  const matchCreator = userId === creatorId;

  return (
    <DrawerContent className="p-4">
      <div className="flex flex-col gap-2 pb-6">
        <DrawerTitle className="mb-4 text-center text-sm font-medium capitalize text-muted-foreground">
          Opsi {title}
        </DrawerTitle>

        <Button
          variant="ghost"
          className="h-10 justify-start gap-3"
          onClick={() => handleCopyLink()}
        >
          <IconCopy size={20} className="text-success" /> Salin Link
        </Button>

        {matchCreator && (
          <>
            <Link href={`/home/${title}/update/${slug}`}>
              <Button variant="ghost" className="h-10 w-full justify-start gap-3">
                <IconEdit size={20} className="text-info" /> Edit <span className="capitalize">{title}</span>
              </Button>
            </Link>

            <Button
              className={buttonVariants({
                variant: "destructive-outline",
                className:
                  "h-10 w-full justify-start gap-3 border-none shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none",
              })}
              onClick={onDelete}
            >
              <IconTrash size={20} />
              <span>
                Hapus <span className="capitalize">{title}</span>
              </span>
            </Button>
          </>
        )}
      </div>
    </DrawerContent>
  );
};

export const ContentActionsDrawer = DrawerOpsi;
