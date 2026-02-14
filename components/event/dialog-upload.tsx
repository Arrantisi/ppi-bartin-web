"use client";

import { DialogPopup } from "@/components/animate-ui/components/base/dialog";
import { UploaderPhoto } from "./uploader";
import { TcatagoryDialogEvent } from "@/types";

const PhotoUpload = ({ ...props }: TcatagoryDialogEvent) => {
  return (
    <DialogPopup className={"p-3"}>
      <UploaderPhoto {...props} />
    </DialogPopup>
  );
};

export default PhotoUpload;
