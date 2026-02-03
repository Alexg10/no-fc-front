import type { BlocksContent } from "@strapi/blocks-react-renderer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextFromNode(node: any): string {
  if (!node || typeof node !== "object") return "";

  if (typeof node.text === "string") {
    return node.text;
  }

  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromNode).join("");
  }

  return "";
}

/**
 * Converts Strapi BlocksContent (rich text) to a plain string.
 * Useful for meta descriptions, mailto body, etc.
 */
export function blocksToPlainText(
  content: BlocksContent | null | undefined,
): string {
  if (!content || !Array.isArray(content)) return "";

  return content
    .map((block) => extractTextFromNode(block))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
