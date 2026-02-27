import { TCatagory } from "@/types";
import {
  DialogHeader,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "../animate-ui/components/base/dialog";
import { PostEvent } from "../field/post-judul";

export const DialogJudul = ({ catagory }: TCatagory) => {
  return (
    <DialogPopup
      showCloseButton={false}
      className={"flex flex-col items-start"}
    >
      <DialogHeader>
        <DialogTitle className={"text-left"}>
          {catagory === "news" ? "Apa Cerita Hari Ini?" : "Event Apa hari ini"}
        </DialogTitle>
        <DialogDescription className={"text-left"}>
          {catagory === "news"
            ? "Mulai dengan judul yang memikat agar orang ingin mengekliknya."
            : "Mulai dengan judul yang memikat agar orang ingin mengekliknya."}
        </DialogDescription>
      </DialogHeader>
      <div className="w-full">
        <PostEvent catagory={catagory} />
      </div>
    </DialogPopup>
  );
};
