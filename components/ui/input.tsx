import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "input-editable h-9 w-full min-w-0 rounded-xl px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-disabled/70 focus-visible:ring-3 focus-visible:ring-accent/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 read-only:bg-transparent read-only:border-x-0 read-only:border-t-0 read-only:border-b read-only:border-border read-only:rounded-none read-only:px-0 read-only:text-text-secondary read-only:shadow-none read-only:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
