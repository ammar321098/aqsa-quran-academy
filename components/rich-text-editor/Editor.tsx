"use client";

import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Menubar } from "./Menubar";
import { useEffect, useState } from "react";

export function RichTextEditor({ field }: { field: any }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-4 focus:outline-none prose dark:prose-invert",
      },
    },

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },

    content: field.value ? JSON.parse(field.value) : "<p>Hello World 🚀</p>",
  });

  // Track undo/redo availability
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    };

    editor.on("update", update);
    editor.on("transaction", update);

    update(); // initial check

    return () => {
      editor.off("update", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      {editor && (
        <Menubar editor={editor} canUndo={canUndo} canRedo={canRedo} />
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
