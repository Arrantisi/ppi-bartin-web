"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { Progress } from "@/components/ui/progress";
import { useConstruct } from "@/hooks/use-construct-url";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { IconCloudUpload } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";

export const UploaderPhoto = ({
  onChange,
  value,
}: {
  onChange?: (key: string) => void;
  value: string;
}) => {
  const router = useRouter();
  const valueUrl = useConstruct(value || "");

  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("onOploadFile", {
    onClientUploadComplete: async (res) => {
      const key = res[0].key;

      onChange?.(key);

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
          toast.warning("File Terlalu Besar", {
            description: `File kamu sebesar ${(file.size / (1024 * 1024)).toFixed(2)}MB melebihi batas 2MB`,
          });
        }

        if (err.code === "too-many-files") {
          toast.warning("Terlalu Banyak File", {
            description: "Hanya diperbolehkan mengunggah 1 file saja",
          });
        }

        if (err.code === "file-invalid-type") {
          toast.warning("Format Salah", {
            description: "Hanya file gambar yang diperbolehkan",
          });
        }
      });
    });
  };

  const { isDragActive, getInputProps, getRootProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2,
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
            {value ? (
              <div className=" w-full h-full">
                <Image
                  src={valueUrl}
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
            ) : !preview ? (
              <>
                <input {...getInputProps()} />
                <UploadIllustration />
                <CardTitle>Tarik & Lepas Foto</CardTitle>
                <CardDescription className="text-xs text-center px-4">
                  Foto akan langsung diunggah (Maks. 2 MB)
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
              </div>
            )}
          </div>
        )}
      </AspectRatio>
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
    <div className="mt-4 w-full max-w-50">
      <div className="flex justify-between text-xs mb-1">
        <span>Mengunggah...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-1" />
    </div>
  </div>
);
