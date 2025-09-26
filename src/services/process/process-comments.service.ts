import { authorizedAPI } from "@/config/axios.config";
import { UtilsService } from "../utils";

const utils = new UtilsService();

export interface ProcessCommentsTypes {
    processId?: string;
    applicantProcessId: string;
    formId: string;
    comments: any;
}

export interface CreateProcessCommentData {
    applicantProcessId: string;
    formId: string;
    comment: string;
    userId?: string;
}

export interface UpdateProcessCommentData {
    comment: string;
}

class ProcessCommentsService {
    // Create a new process comment
    createProcessComment(data: CreateProcessCommentData): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.post("/process-comments", data)
        );
    }

    // Get all process comments
    getAllProcessComments(): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get("/process-comments")
        );
    }

    // Get a specific process comment by ID
    getProcessCommentById(id: string): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get(`/process-comments/${id}`)
        );
    }

    // Update a process comment by ID
    updateProcessComment(id: string, data: UpdateProcessCommentData): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.patch(`/process-comments/${id}`, data)
        );
    }

    // Delete a process comment by ID
    deleteProcessComment(id: string): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.delete(`/process-comments/${id}`)
        );
    }

    // Submit process comment (alternative endpoint)
    submitProcessComment(data: CreateProcessCommentData): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.post("/process-comments/submit", data)
        );
    }

    // Get comments by applicant process and form
    getCommentsByApplicantProcessAndForm(applicantProcessId: string, formId: string): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get(`/process-comments/by-applicant-process-and-form/${applicantProcessId}/${formId}`)
        );
    }

    // Legacy methods for backward compatibility
    getAllProcessFormComments({ queryKey }: any): Promise<any> {
        const [_, , applicantProcessId, formId] = queryKey;
        return utils.handleApiRequest(() => 
            authorizedAPI.get(`/process-comments/by-applicant-process-and-form/${applicantProcessId}/${formId}`)
        );
    }

    submitProcessFormComments({ applicantProcessId, comments}: ProcessCommentsTypes): Promise<any> {
        // Extract the first comment from the array and send it properly
        const commentData = Array.isArray(comments) && comments.length > 0 ? comments[0] : comments;
        return utils.handleApiRequest(() => 
            authorizedAPI.post("/process-comments/submit", { 
                applicantProcessId, 
                userId: commentData.userId, 
                comment: commentData.comment 
            })
        );
    }
}

export const processCommentsService = new ProcessCommentsService();
