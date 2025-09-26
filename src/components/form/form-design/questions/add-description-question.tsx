import {
  convertFromRaw,
  convertToRaw,
  type DraftInlineStyleType,
  Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { useFormStore } from "@/store";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from "@/types";

export const AddDescriptionQuestion: React.FC<QuestionItemProps> = ({
  question,
  questionIndex,
  sectionIndex,
  isMinimized,
}) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();

  let initialEditorState;
  try {
    initialEditorState = question.descriptionName
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(question.descriptionName))
        )
      : EditorState.createEmpty();
  } catch (error) {
    console.error("Error parsing descriptionName:", error);
    initialEditorState = EditorState.createEmpty(); // Fallback to empty state
  }

  const [editorState, setEditorState] = useState(initialEditorState);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const updatedDescription = JSON.stringify(convertToRaw(contentState));
    const updatedQuestion = {
      ...question,
      descriptionName: updatedDescription,
    };
    const updatedSection = {
      ...sections[sectionIndex],
      questions: [...sections[sectionIndex].questions],
    };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style: DraftInlineStyleType) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const inlineStyles = [
    { label: "H1", style: "H1" },
    { label: "H2", style: "H2" },
    { label: "H3", style: "H3" },
    { label: "H4", style: "H4" },
    { label: "H5", style: "H5" },
    { label: "H6", style: "H6" },
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
  ];

  const blockTypes = [
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
  ];

  const customStyleMap = {
    H1: { fontSize: "2em" },
    H2: { fontSize: "1.75em" },
    H3: { fontSize: "1.5em" },
    H4: { fontSize: "1.25em" },
    H5: { fontSize: "1.1em" },
    H6: { fontSize: "1em" },
  };

  return (
    !isMinimized && (
      <div className="text-editor">
        <div className="toolbar">
          {inlineStyles.map((type) => (
            <button
              key={type.label}
              type="button"
              onClick={() => toggleInlineStyle(type.style as any)}
              className="toolbar-button"
            >
              {type.label}
            </button>
          ))}
          {blockTypes.map((type) => (
            <button
              key={type.label}
              type="button"
              onClick={() => toggleBlockType(type.style)}
              className="toolbar-button"
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="editor-container">
          {/* @ts-ignore */}
          <Editor
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            onChange={handleEditorChange}
            placeholder={t('questionDesign.addDescriptionContent')}
            customStyleMap={customStyleMap}
          />
        </div>
      </div>
    )
  );
};