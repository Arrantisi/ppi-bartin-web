"use client";

import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { IconCloudUpload } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { Progress } from "../ui/progress";
import { toastManager } from "../ui/toast";
import { LoadingAnimation } from "../ui/loading-animation";
import { useRouter } from "next/navigation";
import { CardDescription, CardTitle } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import { updateNewsPhoto } from "@/actions/news";
import { updateEventPhoto } from "@/actions/acara";
import Link from "next/link";

export const UploaderPhoto = ({
  catagory,
  slug,
}: {
  catagory: "news" | "events";
  slug: string;
}) => {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);

  const catagoryType = catagory === "events" ? "acaraUploud" : "beritaUpload";

  const { startUpload, isUploading } = useUploadThing("onOploadFile", {
    onClientUploadComplete: async (res) => {
      if (catagoryType === "beritaUpload") {
        await updateNewsPhoto(slug, res);
      } else if (catagoryType === "acaraUploud") {
        await updateEventPhoto(slug, res);
      }
      setProgress(0);
      router.refresh();
    },
    onUploadProgress: setProgress,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const f = acceptedFiles[0];

        const previewUrl = URL.createObjectURL(f);
        setPreview(previewUrl);
        startUpload([f]);
      } else {
        console.log("File ditolak, tidak membuat preview.");
      }
    },
    [startUpload],
  );

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
    <div>
      <AspectRatio
        {...getRootProps()}
        ratio={4 / 3}
        className="relative bg-muted rounded-4xl overflow-hidden border"
      >
        {isUploading ? (
          <UploadingAnimation progress={progress} />
        ) : (
          <div
            className={cn(
              "shadow-2xl rounded-3xl p-2 flex flex-col items-center justify-center gap-2 duration-300 h-full",
              isDragActive ? "bg-primary/15" : "bg-transparent",
            )}
          >
            {!preview ? (
              <>
                <input {...getInputProps()} />
                <UploadIllustration />
                <CardTitle>Tarik & Lepas Foto</CardTitle>
                <CardDescription className="text-xs text-center px-4">
                  Foto akan langsung diunggah (Maks. 4 MB)
                </CardDescription>
                <Button
                  variant="outline"
                  className="rounded-full mt-4 pointer-events-none text-sm"
                >
                  Pilih File <IconCloudUpload className="ml-2" />
                </Button>
              </>
            ) : (
              <div className=" w-full h-full">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                {/* Overlay Tombol Ganti Foto jika sudah selesai upload */}
                <div className=" absolute flex w-full left-0 justify-end pr-2">
                  <Button className=" rounded-2xl" variant={"destructive"}>
                    Hapus
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </AspectRatio>

      <Link
        href={
          catagory === "events"
            ? `/home/events/update/${slug}`
            : `/home/news/update/${slug}`
        }
        className={cn(
          "flex justify-end -mr-14 opacity-0",
          !isUploading &&
            preview &&
            "opacity-100 mr-3 transition-all duration-700 ease-in-out",
        )}
      >
        <Button className="text-sm rounded-2xl mt-3">ke menu update</Button>
      </Link>
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

const UploadingAnimation = ({ progress }: { progress: number }) => (
  <div className="flex flex-col items-center justify-center w-full h-full">
    <LoadingAnimation progress={progress} />
    <div className="mt-4 w-full max-w-[200px]">
      <div className="flex justify-between text-xs mb-1">
        <span>Mengunggah...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-1" />
    </div>
  </div>
);
