"use client";

import { deleteEvent } from "@/server/actions/acara";
import { deleteNews } from "@/server/actions/news";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";

export const AlertDEelete = ({
  type,
  id,
  onClick,
  href,
  open,
  onOpenChange,
}: {
  type: "berita" | "acara";
  id: string;
  href: string;
  onClick: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onOpenChange?.(false);
    onClick();
  };

  const handleDelete = async () => {
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
      handleClose();
    } else {
      toast.error(deleteData.msg);
      handleClose();
    }
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-accent transition-colors"
            >
              <IconX size={16} />
            </button>

            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <IconAlertTriangle size={24} className="text-destructive" />
            </div>

            {/* Header */}
            <h2 className="mb-1 text-base font-semibold text-foreground capitalize">
              Hapus {type}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Apakah kamu yakin ingin menghapus {type} ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>

            {/* Footer */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={isLoading}
              >
                Tutup
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                Hapus
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
