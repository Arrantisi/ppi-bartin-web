"use client";

import {
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/animate-ui/components/base/dialog";
import { Button } from "../ui/button";
import { toastManager } from "../ui/toast";
import { IconCloudUpload } from "@tabler/icons-react";
import { useState } from "react";

const PhotoUpload = ({
  catagory,
  onClose,
}: {
  catagory: "berita" | "acara";
  onClose: () => void;
}) => {
  const [fileState, setFileState] = useState(false);

  const handleUpload = () => {
    if (catagory === "acara") {
      toastManager.add({ description: catagory });
      setFileState(!fileState);
    } else if (catagory === "berita") {
      toastManager.add({ description: catagory });
      setFileState(!fileState);
    }
  };

  return (
    <DialogPopup showCloseButton={false} className={"p-3"}>
      {fileState ? (
        <div className="shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-center gap-2.5">
          <UploadingAnimation progress={70} />
          <DialogTitle className={"mt-4"}>
            Hp Nalendra Image 1477.HEIC
          </DialogTitle>
          <DialogDescription className={"text-xs"}>
            3.04 MB <span className="text-primary">45%</span>
          </DialogDescription>

          <Button
            variant={"outline"}
            className="p-2 text-sm w-2/3 rounded-full"
            onClick={handleUpload}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-center gap-2">
          <UploadIllustration />
          <DialogTitle>Tarik & Lepas Foto</DialogTitle>
          <DialogDescription className={"text-xs"}>
            Mendukung format SVG, PNG, JPG, atau GIF (Maks. 5 MB)
          </DialogDescription>

          <Button
            className="p-2 text-sm w-2/3 rounded-full mt-4"
            onClick={handleUpload}
          >
            Unggah File
            <IconCloudUpload />
          </Button>
          <Button
            variant={"outline"}
            className="p-2 text-sm w-2/3 rounded-full"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <DialogDescription className={"text-xs"}>
            Atau seret file ke sini
          </DialogDescription>
        </div>
      )}
    </DialogPopup>
  );
};

export default PhotoUpload;

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
  <div className="relative h-16 w-16">
    <svg
      aria-label={`Upload progress: ${Math.round(progress)}%`}
      className="h-full w-full"
      fill="none"
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Upload Progress Indicator</title>

      <defs>
        <mask id="progress-mask">
          <rect fill="black" height="240" width="240" />
          <circle
            cx="120"
            cy="120"
            fill="white"
            r="120"
            strokeDasharray={`${(progress / 100) * 754}, 754`}
            transform="rotate(-90 120 120)"
          />
        </mask>
      </defs>

      <style>
        {`
                    @keyframes rotate-cw {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotate-ccw {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .g-spin circle {
                        transform-origin: 120px 120px;
                    }
                    .g-spin circle:nth-child(1) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(2) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(3) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(4) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(5) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(6) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(7) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(8) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(9) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(10) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(11) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(12) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(13) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(14) { animation: rotate-ccw 8s linear infinite; }

                    .g-spin circle:nth-child(2n) { animation-delay: 0.2s; }
                    .g-spin circle:nth-child(3n) { animation-delay: 0.3s; }
                    .g-spin circle:nth-child(5n) { animation-delay: 0.5s; }
                    .g-spin circle:nth-child(7n) { animation-delay: 0.7s; }
                `}
      </style>

      <g
        className="g-spin"
        mask="url(#progress-mask)"
        strokeDasharray="18% 40%"
        strokeWidth="10"
      >
        <circle cx="120" cy="120" opacity="0.95" r="150" stroke="#FF2E7E" />
        <circle cx="120" cy="120" opacity="0.95" r="140" stroke="#FFD600" />
        <circle cx="120" cy="120" opacity="0.95" r="130" stroke="#00E5FF" />
        <circle cx="120" cy="120" opacity="0.95" r="120" stroke="#FF3D71" />
        <circle cx="120" cy="120" opacity="0.95" r="110" stroke="#4ADE80" />
        <circle cx="120" cy="120" opacity="0.95" r="100" stroke="#2196F3" />
        <circle cx="120" cy="120" opacity="0.95" r="90" stroke="#FFA726" />
        <circle cx="120" cy="120" opacity="0.95" r="80" stroke="#FF1493" />
        <circle cx="120" cy="120" opacity="0.95" r="70" stroke="#FFEB3B" />
        <circle cx="120" cy="120" opacity="0.95" r="60" stroke="#00BCD4" />
        <circle cx="120" cy="120" opacity="0.95" r="50" stroke="#FF4081" />
        <circle cx="120" cy="120" opacity="0.95" r="40" stroke="#76FF03" />
        <circle cx="120" cy="120" opacity="0.95" r="30" stroke="#448AFF" />
        <circle cx="120" cy="120" opacity="0.95" r="20" stroke="#FF3D00" />
      </g>
    </svg>
  </div>
);
