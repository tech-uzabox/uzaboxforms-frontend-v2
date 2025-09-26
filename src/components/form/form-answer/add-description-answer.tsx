import React from "react";
import "draft-js/dist/Draft.css";
import { Editor, EditorState, convertFromRaw } from "draft-js";
interface AddDescriptionProps {
  question: any;
}

export const AddDescriptionAnswer: React.FC<AddDescriptionProps> = ({ question }) => {
  let editorState;

  try {
    const contentState = convertFromRaw(JSON.parse(question.descriptionName));
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
    <div className="mb-4 text-sm text-[#494C52] description-content">
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
  
