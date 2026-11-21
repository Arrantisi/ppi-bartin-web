import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "input-editable flex field-sizing-content min-h-16 w-full resize-none rounded-2xl px-3 py-3 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 read-only:bg-transparent read-only:border-x-0 read-only:border-t-0 read-only:border-b read-only:border-border read-only:rounded-none read-only:px-0 read-only:text-text-secondary read-only:shadow-none read-only:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
