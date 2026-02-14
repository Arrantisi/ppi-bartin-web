"use client";

import { CreateAcaraField } from "../field/create-acara";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import props from "@/data/create-acara-props.json";
import { UpdateAcaraField } from "../field/update-acara";

export const SheetForm = ({
  catagory,
  onClose,
  onLoading,
  content,
  date,
  judul,
  lokasi,
  slug,
}: {
  catagory: "create" | "update";
  onClose: () => void;
  onLoading?: (e: boolean) => void;
  judul: string;
  slug: string;
  date: Date;
  lokasi: string;
  content: string;
}) => {
  return (
    <SheetContent showCloseButton={false}>
      <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow">
        <SheetHeader>
          <SheetTitle>{props.title}</SheetTitle>
          <SheetDescription>{props.subtitle}</SheetDescription>
        </SheetHeader>
        <div className="space-y-2 mx-2 h-full">
          {catagory === "create" ? (
            <CreateAcaraField
              onClose={() => onClose()}
              onLoading={() => onLoading}
            />
          ) : (
            <UpdateAcaraField
              onClose={onClose}
              content={content}
              slug={slug}
              date={date}
              lokasi={lokasi}
              judul={judul}
            />
          )}
        </div>
      </ScrollArea>
    </SheetContent>
  );
};
