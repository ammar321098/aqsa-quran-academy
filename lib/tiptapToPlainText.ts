import { JSONContent } from "@tiptap/react";

export function tiptapToPlainText(doc: JSONContent): string {
  if (!doc || !doc.content) return "";

  let plainText = "";

  const parseNodes = (nodes: JSONContent["content"]) => {
    nodes?.forEach((node: any) => {
      if (node.type === "text") {
        plainText += node.text;
      } else if (node.content) {
        parseNodes(node.content);
        // Add line break for paragraphs
        if (node.type === "paragraph") plainText += "\n";
      }
    });
  };

  parseNodes(doc.content);

  return plainText.trim();
}
