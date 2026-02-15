// components/auth/username-force-dialog.tsx
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/animate-ui/components/base/alert-dialog";
import { UsernameField } from "./field/username-field";
import props from "@/data/username-props.json";

export function UsernameForceDialog() {
  const [open, setOpen] = useState(true);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogPopup className={"rounded-2xl"}>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.subtitle}</AlertDialogDescription>
        </AlertDialogHeader>

        <UsernameField onClose={() => setOpen(false)} />
      </AlertDialogPopup>
    </AlertDialog>
  );
}
