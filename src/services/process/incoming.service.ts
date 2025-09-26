import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

class IncomingService {
  // 1. Get all applications by type
  getAllApplications(type: 'pending' | 'completed' | 'disabled' | 'processed', isAdmin: boolean = false): Promise<any> {
    const params = new URLSearchParams();
    params.append('type', type);
    if (isAdmin) params.append('admin', 'true');
    const queryString = params.toString();
    
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/incoming-applications?${queryString}`)
    );
  }

  // 2. Get applications for a specific process by type
  getApplicationsForProcess(
    processId: string, 
    type: 'pending' | 'completed' | 'disabled' | 'processed', 
    isAdmin: boolean = false, 
    status?: string
  ): Promise<any> {
    const params = new URLSearchParams();
    params.append('type', type);
    if (isAdmin) params.append('admin', 'true');
    if (status) params.append('status', status);
    const queryString = params.toString();
    
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/incoming-applications/process/${processId}?${queryString}`)
    );
  }

  // 3. Get single application details
  getSingleApplication(applicantProcessId: string): Promise<any> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/incoming-applications/single/${applicantProcessId}`)
    );
  }
}

export const incomingService = new IncomingService();