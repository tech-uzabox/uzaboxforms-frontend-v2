import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

class ApplicantProcessService {
  getAllApplicantProcesses(): Promise<any> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get("/applicant-processes")
    );
  }

  createApplicantProcess(applicantProcessData: any): Promise<any> {
    return utils.handleApiRequest(() =>
      authorizedAPI.post("/applicant-processes", applicantProcessData)
    );
  }

  updateApplicantProcess({
    comment,
    id,
    status,
    processId: _processId,
    userId: _userId,
  }: {
    comment: string;
    id: string;
    status: string;
    processId?: string;
    userId?: string;
  }): Promise<any> {
    // Note: processId and userId are only used for frontend query invalidation, not sent to backend
    return utils.handleApiRequest(() =>
      authorizedAPI.patch(`/applicant-processes/${id}`, { comment, status })
    );
  }

  getApplicantProcessByUserId({ queryKey }: any) {
    const [_, userId] = queryKey;
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/applicant-processes/by-user/${userId}`)
    );
  }

  bulkCreateApplicantProcess(formData: FormData): Promise<any> {
    return utils.handleApiRequest(() =>
      authorizedAPI.post('/applicant-processes/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }
}

export const applicantProcessService = new ApplicantProcessService();
