"use client";

import { IconCopy, IconShare } from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { handleShare, handleCopyLink } from "@/utils/copy-link";

export const SharePopover = ({ title }: { title?: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon-xl" className="rounded-full">
          <IconShare />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-1.5">
        <div className="flex flex-col gap-0.5">
          <Button
            variant="ghost"
            className="h-9 w-full justify-start gap-2"
            onClick={() => handleShare(title)}
          >
            <IconShare size={18} /> Bagikan
          </Button>
          <Button
            variant="ghost"
            className="h-9 w-full justify-start gap-2"
            onClick={handleCopyLink}
          >
            <IconCopy size={18} /> Salin Link
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
