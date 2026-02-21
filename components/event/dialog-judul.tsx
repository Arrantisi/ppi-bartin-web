import {
  DialogHeader,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "../animate-ui/components/base/dialog";
import { PostJudulEvent } from "../field/post-judul-event";
import { PostJudulNews } from "../field/post-judul-news";

export const DialogJudul = ({ catagory }: { catagory: "news" | "event" }) => {
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
        {catagory === "news" ? <PostJudulNews /> : <PostJudulEvent />}
      </div>
    </DialogPopup>
  );
};
