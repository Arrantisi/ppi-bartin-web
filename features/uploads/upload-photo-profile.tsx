import { useUploadThing } from "@/lib/uploadthing";
import { IconCamera } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";

type TuploadPhotoProfileProps = {
  value?: string;
  onValueChange?: (key: string) => void;
};

export const UploadPhotoProfile = ({
  value,
  onValueChange,
}: TuploadPhotoProfileProps) => {
  const [preview, setPreview] = useState<string | null>("");

  const { startUpload } = useUploadThing("onOploadProfile", {
    onClientUploadComplete: (res) => {
      const url = res[0].ufsUrl;

      onValueChange?.(url);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const f = acceptedFiles[0];

        const previewUrl = URL.createObjectURL(f);

        setPreview(previewUrl);
        startUpload([f]);
      }
    },
    [startUpload],
  );

  const rejectedFiles = (fileRejections: FileRejection[]) => {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((err) => {
        if (err.code === "file-too-large") {
          toast.warning("File Terlalu Besar", {
            description: `File "${file.name}" sebesar ${(file.size / (1024 * 1024)).toFixed(2)}MB melebihi batas 4MB`,
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

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 1,
    multiple: false,
    onDropRejected: rejectedFiles,
  });

  return (
    <div className="flex items-center flex-col space-y-3 my-5">
      <div className="p-1 rounded-full relative bg-card border border-border">
        <Image
          src={preview || value || ""}
          alt=""
          width={200}
          height={200}
          className="rounded-full size-[120px]"
        />
        {!preview && (
          <div
            className="flex items-center justify-center absolute bg-surface-hover rounded-full text-text-primary border border-border size-[36px] top-[90px] left-[90px]"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <IconCamera size={20} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <h3 className="footnote text-text-secondary">
          Tap untuk ganti foto profil
        </h3>
        <p className="footnote text-text-disabled">
          JPG, PNG (Max 1MB)
        </p>
      </div>
    </div>
  );
};
