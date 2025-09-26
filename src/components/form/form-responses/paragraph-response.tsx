import { convertFromRaw, Editor, EditorState } from "draft-js";
import React from "react";

interface ParagraphResponseProps {
  response: string;
}
const ParagraphResponse: React.FC<ParagraphResponseProps> = ({ response }) => {
  let editorState;

  try {
    const contentState = convertFromRaw(JSON.parse(response));
    editorState = EditorState.createWithContent(contentState);
  } catch (error) {
    editorState = EditorState.createEmpty();
  }

  // Custom style map for inline styles (e.g., Bold and Underline)
  const customStyleMap = {
    BOLD: { fontWeight: "bold" },
    UNDERLINE: { textDecoration: "underline" },
  };

  // Style function for handling block types (e.g., H4, H5, H6)
  const blockStyleFn = (block: any) => {
    switch (block.getType()) {
      case "header-four":
        return "custom-header-four";
      case "header-five":
        return "custom-header-five";
      case "header-six":
        return "custom-header-six";
      default:
        return "";
    }
  };

  return (
    <div className="main-response-container">
      {/* @ts-ignore */}
      <Editor
        editorState={editorState}
        readOnly={true}
        onChange={() => {}}
        customStyleMap={customStyleMap}
        blockStyleFn={blockStyleFn}
      />
    </div>
  );
};

export default ParagraphResponse;
