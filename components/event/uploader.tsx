"use client";

import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  DialogDescription,
  DialogTitle,
} from "../animate-ui/components/base/dialog";
import { Button } from "../ui/button";
import { TcatagoryDialogEvent } from "@/types";
import { IconCloudUpload } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { Progress } from "../ui/progress";
import { toastManager } from "../ui/toast";
import { LoadingAnimation } from "../ui/loading-animation";

export const UploaderPhoto = ({ catagory, onClose }: TcatagoryDialogEvent) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const f = acceptedFiles[0];

      const previewUrl = URL.createObjectURL(f);
      setPreview(previewUrl);
      setFile(f);
    } else {
      console.log("File ditolak, tidak membuat preview.");
    }
  }, []);

  const catagoryType = catagory === "acara" ? "acaraUploud" : "beritaUpload";

  const { startUpload, isUploading } = useUploadThing(catagoryType, {
    onClientUploadComplete: () => {
      setFile(null);
      setPreview(null);
      setProgress(0);
    },
    onUploadProgress: setProgress,
  });

  const rejectedFiles = (fileRejections: FileRejection[]) => {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((err) => {
        if (err.code === "file-too-large") {
          toastManager.add({
            type: "info",
            title: "File Terlalu Besar",
            description: `File "${file.name}" sebesar ${(file.size / (1024 * 1024)).toFixed(2)}MB melebihi batas 4MB`,
          });
        }

        if (err.code === "too-many-files") {
          toastManager.add({
            type: "info",
            title: "Terlalu Banyak File",
            description: "Hanya diperbolehkan mengunggah 1 file saja",
          });
        }

        if (err.code === "file-invalid-type") {
          toastManager.add({
            type: "error",
            title: "Format Salah",
            description: "Hanya file gambar yang diperbolehkan",
          });
        }
        onClose();
      });
    });
  };
  const { isDragActive, getInputProps, getRootProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    onDropRejected: rejectedFiles,
    accept: { "image/*": [] },
  });

  return (
    <div {...getRootProps()}>
      {isUploading ? (
        <UploadingAnimation
          progress={progress}
          size={file?.size || 0}
          name={file?.name || ""}
        />
      ) : (
        <div
          className={cn(
            "shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-center gap-2 duration-300",
            isDragActive ? "bg-primary/15" : "bg-transparent",
          )}
        >
          {!preview ? (
            <>
              <input {...getInputProps()} />
              <UploadIllustration />
              <DialogTitle>Tarik & Lepas Foto</DialogTitle>
              <DialogDescription className={"text-xs"}>
                Mendukung format SVG, PNG, JPG, atau GIF (Maks. 4 MB)
              </DialogDescription>
              <Button className="p-2 text-sm w-2/3 rounded-full mt-4">
                Unggah File
                <IconCloudUpload />
              </Button>
              <DialogDescription className={"text-xs"}>
                Atau seret file ke sini
              </DialogDescription>
            </>
          ) : (
            file && (
              <>
                <Image src={preview} alt="" height={200} width={200} />
                <DialogTitle>{file.name}</DialogTitle>
                <div>
                  <DialogDescription className={"text-xs"}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </DialogDescription>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button
                    variant={"outline"}
                    className="p-2 text-sm  rounded-full mt-4"
                    onClick={() => setPreview(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="p-2 text-sm rounded-full mt-4"
                    onClick={() => startUpload([file])}
                  >
                    Upload <IconCloudUpload />
                  </Button>
                </div>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

const UploadIllustration = () => (
  <div className="relative h-16 w-16">
    <svg
      aria-label="Upload illustration"
      className="h-full w-full"
      fill="none"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Upload File Illustration</title>
      <circle
        className="stroke-gray-300 dark:stroke-gray-700"
        cx="50"
        cy="50"
        r="45"
        strokeDasharray="4 4"
        strokeWidth="2"
      >
        <animateTransform
          attributeName="transform"
          dur="60s"
          from="0 50 50"
          repeatCount="indefinite"
          to="360 50 50"
          type="rotate"
        />
      </circle>

      <path
        className="fill-primary/10 stroke-primary dark:fill-blue-900/30 dark:stroke-blue-400"
        d="M30 35H70C75 35 75 40 75 40V65C75 70 70 70 70 70H30C25 70 25 65 25 65V40C25 35 30 35 30 35Z"
        strokeWidth="2"
      >
        <animate
          attributeName="d"
          dur="2s"
          repeatCount="indefinite"
          values="
                        M30 35H70C75 35 75 40 75 40V65C75 70 70 70 70 70H30C25 70 25 65 25 65V40C25 35 30 35 30 35Z;
                        M30 38H70C75 38 75 43 75 43V68C75 73 70 73 70 73H30C25 73 25 68 25 68V43C25 38 30 38 30 38Z;
                        M30 35H70C75 35 75 40 75 40V65C75 70 70 70 70 70H30C25 70 25 65 25 65V40C25 35 30 35 30 35Z"
        />
      </path>

      <path
        className="stroke-primary dark:stroke-blue-400"
        d="M30 35C30 35 35 35 40 35C45 35 45 30 50 30C55 30 55 35 60 35C65 35 70 35 70 35"
        fill="none"
        strokeWidth="2"
      />

      <g className="translate-y-2 transform">
        <line
          className="stroke-primary dark:stroke-blue-400"
          strokeLinecap="round"
          strokeWidth="2"
          x1="50"
          x2="50"
          y1="45"
          y2="60"
        >
          <animate
            attributeName="y2"
            dur="2s"
            repeatCount="indefinite"
            values="60;55;60"
          />
        </line>
        <polyline
          className="stroke-primary dark:stroke-blue-400"
          fill="none"
          points="42,52 50,45 58,52"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <animate
            attributeName="points"
            dur="2s"
            repeatCount="indefinite"
            values="42,52 50,45 58,52;42,47 50,40 58,47;42,52 50,45 58,52"
          />
        </polyline>
      </g>
    </svg>
  </div>
);

const UploadingAnimation = ({
  progress,
  size,
  name,
}: {
  progress: number;
  size: number;
  name: string;
}) => (
  <div className="shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-center">
    <LoadingAnimation progress={progress} />
    <div className="flex items-center justify-between mt-3 mb-1 w-full">
      <h1>Mengaupload...</h1>
      <div>
        <DialogTitle>{name}</DialogTitle>
        <DialogDescription className={"text-xs"}>
          {(size / (1024 * 1024)).toFixed(2)} MB{" "}
          <span className="text-primary">{progress}%</span>
        </DialogDescription>
      </div>
    </div>

    <Progress value={progress} />
  </div>
);
