"use client";

import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";

export const RichTextEditor = ({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyleKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: "text-primary underline" },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      transformPastedHTML(html) {
        return html.replace(/style="[^"]*"/g, "");
      },
      attributes: {
        class: cn(
          "field-sizing-content min-h-16 w-full resize-none rounded-2xl border border-transparent bg-input/50 px-3 py-3 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          "[&_p]:min-h-[1.5rem] [&_p+p]:mt-2",
          className,
        ),
      },
    },
  });

  return <EditorContent editor={editor} />;
};
