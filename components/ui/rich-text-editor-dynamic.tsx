import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const RichTextEditor = dynamic(
  () =>
    import("@/components/ui/rich-text-editor").then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  },
);
