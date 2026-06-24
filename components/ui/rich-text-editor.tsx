"use client";

import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";

import {
  IconBold,
  IconItalic,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconEraser,
} from "@tabler/icons-react";

export type RichTextEditorProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
};

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Tulis isi konten...",
  className,
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      BubbleMenuExtension,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class:
            "text-accent underline hover:text-accent/80 transition-colors cursor-pointer",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      transformPastedHTML(html) {
        return html.replace(/style="[^"]*"/g, "").replace(/<img[^>]*>/gi, "");
      },
      handlePaste: (_view, event) => {
        return Array.from(event.clipboardData?.files || []).some((file) =>
          file.type.startsWith("image/"),
        );
      },
      handleDrop: (_view, event) => {
        return Array.from(event.dataTransfer?.files || []).some((file) =>
          file.type.startsWith("image/"),
        );
      },
      attributes: {
        class: cn(
          "input-editable min-h-40 w-full rounded-2xl border border-border px-3 py-3 text-sm outline-none transition-[color,box-shadow,background-color]",
          "focus-visible:ring-3 focus-visible:ring-accent/10",
          "[&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-text-primary/70 [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold",
          "[&_p]:min-h-[1.25rem] [&_p+p]:mt-2",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-text-secondary",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5",
          "[&_li]:my-1",
          className,
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="space-y-2 relative">
      {/* BUBBLE MENU DENGAN ICON */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
        <div className="flex items-center gap-0.5 rounded-xl border border-border bg-background p-1 shadow-md backdrop-blur-sm">
          <button
            type="button"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              editor.isActive("bold")
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-muted",
            )}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <IconBold className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              editor.isActive("italic")
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-muted",
            )}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <IconItalic className="h-4 w-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              editor.isActive("heading", { level: 2 })
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-muted",
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <IconH2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              editor.isActive("bold")
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-muted",
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <IconH3 className="h-4 w-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              editor.isActive("bulletList")
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-muted",
            )}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <IconList className="h-4 w-4" />
          </button>

          <button
            type="button"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              editor.isActive("orderedList")
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-muted",
            )}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List"
          >
            <IconListNumbers className="h-4 w-4" />
          </button>
        </div>
      </BubbleMenu>

      {/* AREA EDITOR */}
      <EditorContent editor={editor} />

      {/* TOOLBAR UTAMA STICKY DENGAN ICON */}
      <div
        className={cn(
          // 1. GAYA DASAR & SCROLL (Punya lo, tetep murni sticky)
          "sticky z-10 flex flex-nowrap items-center justify-center gap-1 rounded-2xl border border-border p-1.5 overflow-x-auto scrollbar-none snap-x",
          "bg-background/95 backdrop-blur-sm shadow-sm",

          // 2. DI LAYAR MOBILE (HP)
          // w-auto + mx-4 bikin dia otomatis nyesuaiin lebar layar HP tapi ga bakal jebol ke pinggir
          "w-auto mx-4 bottom-[var(--toolbar-bottom)]",

          // 3. DI LAYAR DESKTOP (md ke atas)
          // Balik ke ukuran pas sesuai tombol dan posisinya di tengah form
          "md:w-max md:mx-auto md:bottom-2",
        )}
        style={
          {
            "--toolbar-bottom": "calc(4.5rem + env(safe-area-inset-bottom))",
          } as React.CSSProperties
        }
      >
        <button
          type="button"
          className={cn(
            "rounded-xl border p-2 transition-colors",
            editor.isActive("bold")
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-secondary hover:bg-muted",
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <IconBold className="h-4 w-4" />
        </button>

        <button
          type="button"
          className={cn(
            "rounded-xl border p-2 transition-colors",
            editor.isActive("italic")
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-secondary hover:bg-muted",
          )}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <IconItalic className="h-4 w-4" />
        </button>

        <div className="h-5 w-[1px] bg-border mx-0.5" />

        <button
          type="button"
          className={cn(
            "rounded-xl border p-2 transition-colors",
            editor.isActive("heading", { level: 2 })
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-secondary hover:bg-muted",
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <IconH2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          className={cn(
            "rounded-xl border p-2 transition-colors",
            editor.isActive("heading", { level: 3 })
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-secondary hover:bg-muted",
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <IconH3 className="h-4 w-4" />
        </button>

        <div className="h-5 w-[1px] bg-border mx-0.5" />

        <button
          type="button"
          className={cn(
            "rounded-xl border p-2 transition-colors",
            editor.isActive("bulletList")
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-secondary hover:bg-muted",
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <IconList className="h-4 w-4" />
        </button>

        <button
          type="button"
          className={cn(
            "rounded-xl border p-2 transition-colors",
            editor.isActive("orderedList")
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-secondary hover:bg-muted",
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <IconListNumbers className="h-4 w-4" />
        </button>

        <div className="h-5 w-[1px] bg-border mx-0.5" />

        <button
          type="button"
          className={cn(
            "rounded-xl border p-2 transition-colors",
            editor.isActive("undo")
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-secondary hover:bg-muted",
          )}
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <IconArrowBackUp className="h-4 w-4" />
        </button>

        <button
          type="button"
          className={cn(
            "rounded-xl border p-2 transition-colors",
            editor.isActive("redo")
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-secondary hover:bg-muted",
          )}
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <IconArrowForwardUp className="h-4 w-4" />
        </button>

        <button
          type="button"
          className={cn(
            "rounded-xl border p-2 transition-colors",
            editor.isActive("clearNodes")
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-secondary hover:bg-muted",
          )}
          onClick={() => editor.chain().focus().clearNodes().run()}
          title="Clear Nodes"
        >
          <IconEraser className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
