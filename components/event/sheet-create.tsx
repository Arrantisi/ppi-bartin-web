"use client";

import { useState } from "react";
import { CreateAcaraField } from "../field/create-acara";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import props from "@/data/create-acara-props.json";

export const SheetCreate = ({
  onClose,
  onLoading,
}: {
  onClose: () => void;
  onLoading: (e: boolean) => void;
}) => {
  return (
    <SheetContent showCloseButton={false}>
      <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow">
        <SheetHeader>
          <SheetTitle>{props.title}</SheetTitle>
          <SheetDescription>{props.subtitle}</SheetDescription>
        </SheetHeader>
        <div className="space-y-2 mx-2 h-full">
          <CreateAcaraField
            onClose={() => onClose()}
            onLoading={() => onLoading}
          />
        </div>
      </ScrollArea>
    </SheetContent>
  );
};
