"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/animate-ui/components/base/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

type TAdminConfirmDeleteProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  disabled?: boolean;
  onConfirm: () => Promise<void> | void;
  children?: React.ReactNode;
  /** Mode terkontrol dipakai dari dalam dropdown menu. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AdminConfirmDelete({
  title,
  description,
  confirmLabel = "Hapus",
  disabled = false,
  onConfirm,
  children,
  open,
  onOpenChange,
}: TAdminConfirmDeleteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={currentOpen} onOpenChange={setOpen}>
      {!isControlled ? (
        <AlertDialogTrigger
          className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
          disabled={disabled || isLoading}
        >
          {children ?? confirmLabel}
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? <Spinner /> : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
