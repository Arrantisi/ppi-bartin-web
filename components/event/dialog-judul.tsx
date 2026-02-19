import {
  DialogHeader,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "../animate-ui/components/base/dialog";
import { PostJudulNews } from "../field/post-judul-news";

export const DialogJudul = () => {
  return (
    <DialogPopup
      showCloseButton={false}
      className={"flex flex-col items-start"}
    >
      <DialogHeader>
        <DialogTitle className={"text-left"}>Apa Cerita Hari Ini?</DialogTitle>
        <DialogDescription className={"text-left"}>
          Mulai dengan judul yang memikat agar orang ingin mengekliknya.
        </DialogDescription>
      </DialogHeader>
      <div className="w-full">
        <PostJudulNews />
      </div>
    </DialogPopup>
  );
};
