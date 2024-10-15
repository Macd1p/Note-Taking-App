"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useTheme } from "next-themes";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  documentId: string;
}

async function saveToStorage(documentId: string, jsonBlocks: Block[]) {
  localStorage.setItem(`editorContent_${documentId}`, JSON.stringify(jsonBlocks));
}

async function loadFromStorage(documentId: string) {
  const storageString = localStorage.getItem(`editorContent_${documentId}`);
  return storageString ? (JSON.parse(storageString) as PartialBlock[]) : undefined;
}

const Editor = ({ onChange, initialContent, editable, documentId }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const [initialEditorContent, setInitialEditorContent] = useState<PartialBlock[] | undefined | "loading">("loading");

  useEffect(() => {
    loadFromStorage(documentId).then((content) => {
      setInitialEditorContent(content);
    });
  }, [documentId]);

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const editor = useMemo(() => {
    if (initialEditorContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({
      initialContent: initialEditorContent,
      uploadFile: handleUpload,
    });
  }, [initialEditorContent]);

  if (editor === undefined) {
    return "Loading content...";
  }

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={() => {
          saveToStorage(documentId, editor.document);
          onChange(JSON.stringify(editor.document));
        }}
      />
    </div>
  );
};

export default Editor;
