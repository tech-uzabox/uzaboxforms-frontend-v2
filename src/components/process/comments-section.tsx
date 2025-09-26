import dayjs from "dayjs";
import {
  userGetAllProcessFormComments,
  useSubmitProcessFormComments,
} from "@/hooks";
import { toast } from "sonner";
import React, { useState } from "react";
import type { formParamsProps } from "@/types";
import { useTranslation } from "react-i18next";

const CommentsSection: React.FC<formParamsProps> = ({
  userId,
  processId,
  applicantProcessId,
  formId,
}) => {
  const { t } = useTranslation();
  const { data: commentsData, isLoading } = userGetAllProcessFormComments({
    processId,
    applicantProcessId,
    formId,
  });


  const submitMutation = useSubmitProcessFormComments();
  const [newComment, setNewComment] = useState<string>("");
  const handleCommentSubmit = async () => {
    try {
      if (newComment.trim() === "") return;
      
      const commentData = {
        processId,
        applicantProcessId,
        formId,
        comments: [{ userId, comment: newComment }],
      };
      
      const response = await submitMutation.mutateAsync(commentData);
      
      if (response) {
        setNewComment("");
        toast.success(t("processManagement.commentSubmitted"));
      }
    } catch (error) {
      console.error('🔍 CommentsSection - Comment submission error:', error);
      toast.error(t("processManagement.errorSubmittingComment"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-center py-4 text-primary">
          {t("processManagement.loadingComments")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-[#494C52] font-medium mb-3">
        {t("processManagement.comments")}
      </h2>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="rounded border-l-[2.4px] border-primary px-5 py-2 text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1"
        placeholder={t("processManagement.addAComment")}
        rows={4}
      />
      <button
        type="button"
        onClick={handleCommentSubmit}
        disabled={submitMutation.isPending}
        className="mt-2 main-dark-button text-sm"
      >
        {submitMutation.isPending
          ? t("processManagement.submittingComment")
          : t("processManagement.submitComment")}
      </button>
      {commentsData?.length > 0 && (
        <p className="py-4 text-sm text-textmain">
          {t("processManagement.commentsCount", {
            count: commentsData?.length || 0,
            plural: commentsData?.length > 1 ? "s" : "",
          })}
        </p>
      )}
      {commentsData?.length > 0 ? (
        <ul className="space-y-4">
          {commentsData.map((comment: any, index: number) => (
            <li key={index} className="p-4 rounded bg-subprimary">
              <div className="flex mb-3 justify-between">
                <span className="font-medium text-[#070B14]">
                  {comment.user?.firstName} {comment.user?.lastName}
                </span>
                <span className="text-[#494C52] text-sm">
                  {dayjs(comment.createdAt).format("MMMM D, YYYY h:mm A")}
                </span>
              </div>
              <p className="text-textmain text-[14px]">
                {comment.comment}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-4 text-primary">
          {t("processManagement.noCommentsYet")}
        </p>
      )}
    </div>
  );
};

export default CommentsSection;
