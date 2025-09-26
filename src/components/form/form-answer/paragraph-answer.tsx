import {
  convertFromRaw,
  convertToRaw,
  type DraftInlineStyleType,
  Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { useTranslation } from "react-i18next";
import { useFormResponseStore } from "@/store";
import React, { useEffect, useState } from "react";

interface ParagraphProps {
  question: any;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (
    sectionId: string,
    questionId: string,
    error: string | null
  ) => void;
}

export const ParagraphAnswer: React.FC<ParagraphProps> = ({
  question,
  sectionId,
  sectionName,
  setValidationErrors,
}) => {
  const { t } = useTranslation();
  const { setResponse, formResponses } = useFormResponseStore();

  const existingSection = formResponses[sectionId];
  const existingResponse = existingSection?.questions[question.id]?.response || "";
  const initialEditorState = existingResponse
    ? EditorState.createWithContent(
        convertFromRaw(JSON.parse(existingResponse))
      )
    : EditorState.createEmpty();

  const [editorState, setEditorState] = useState(initialEditorState);

  useEffect(() => {
    const content = editorState.getCurrentContent();
    const inputValue = JSON.stringify(convertToRaw(content));

    setResponse(
      sectionId,
      sectionName,
      question.id,
      question.type,
      question.label,
      inputValue
    );

    if (question.required == "yes" && !inputValue) {
      setValidationErrors(
        sectionId,
        question.id,
        `${question.label} is required`
      );
    } else if (inputValue.length < question.minCharacters) {
      setValidationErrors(
        sectionId,
        question.id,
        `${question.label} must be at least ${question.minCharacters} characters`
      );
    } else if (inputValue.length > question.maxCharacters) {
      setValidationErrors(
        sectionId,
        question.id,
        `${question.label} must be less than ${question.maxCharacters} characters`
      );
    } else {
      setValidationErrors(sectionId, question.id, null);
    }
  }, [editorState]); // Update validation errors whenever editorState changes

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
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
    { label: t('forms.bold'), style: "BOLD" },
    { label: t('forms.italic'), style: "ITALIC" },
    { label: t('forms.underline'), style: "UNDERLINE" },
  ];

  const blockTypes = [
    { label: t('forms.unorderedList'), style: "unordered-list-item" },
    { label: t('forms.orderedList'), style: "ordered-list-item" },
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
    <div className="mb-4 ">
      <label className="main-label">
        {question.label}{" "}
        {question.required == "yes" && <span className="text-red-500">*</span>}
      </label>
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
            placeholder="Add description content"
            customStyleMap={customStyleMap}
          />
        </div>
      </div>
    </div>
  );
};
