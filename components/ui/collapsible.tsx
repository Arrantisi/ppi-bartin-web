"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";

type TCollapsibleContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
};

const CollapsibleContext =
  React.createContext<TCollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("Bagian Collapsible harus berada di dalam <Collapsible>.");
  }
  return context;
}

type TCollapsibleProps = React.ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
};

/** Collapsible ringan dengan API ala shadcn; memakai Slot yang sudah ada. */
function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  asChild = false,
  className,
  children,
  ...props
}: TCollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const id = React.useId();
  const triggerId = `${id}-trigger`;
  const contentId = `${id}-content`;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const contextValue = React.useMemo(
    () => ({ open, setOpen, triggerId, contentId }),
    [open, setOpen, triggerId, contentId],
  );

  const Comp = asChild ? Slot : "div";

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <Comp
        data-state={open ? "open" : "closed"}
        className={cn("group/collapsible", className)}
        {...props}
      >
        {children}
      </Comp>
    </CollapsibleContext.Provider>
  );
}

type TCollapsibleTriggerProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

function CollapsibleTrigger({
  asChild = false,
  onClick,
  ...props
}: TCollapsibleTriggerProps) {
  const { open, setOpen, triggerId, contentId } = useCollapsibleContext();

  const triggerProps = {
    id: triggerId,
    type: "button" as const,
    "aria-expanded": open,
    "aria-controls": contentId,
    "data-state": open ? ("open" as const) : ("closed" as const),
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) setOpen(!open);
    },
    ...props,
  };

  return asChild ? (
    <Slot {...triggerProps} />
  ) : (
    <button {...triggerProps} />
  );
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, contentId, triggerId } = useCollapsibleContext();

  return (
    <div
      id={contentId}
      aria-labelledby={triggerId}
      hidden={!open}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
