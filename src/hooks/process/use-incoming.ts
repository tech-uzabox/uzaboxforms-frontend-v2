import { ProcessTypes } from "@/types";
import { processService } from "@/services/process";
import { incomingService } from "@/services/process/incoming.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Application Types
type ApplicationType = "pending" | "completed" | "disabled" | "processed";

// 1. Get all applications by type
export const useGetApplications = (
  type: ApplicationType,
  isAdmin: boolean = false
) =>
  useQuery<any, Error, any>({
    queryKey: [`${type}-applications`, isAdmin],
    queryFn: () => incomingService.getAllApplications(type, isAdmin),
  });

// 2. Get applications for a specific process by type
export const useGetApplicationsForProcess = (
  processId: string,
  type: ApplicationType,
  isAdmin: boolean = false,
  status?: string
) =>
  useQuery<any, Error, any>({
    queryKey: [`${type}-applications-process`, processId, isAdmin, status],
    queryFn: () =>
      incomingService.getApplicationsForProcess(
        processId,
        type,
        isAdmin,
        status
      ),
    enabled: !!processId,
  });

// 3. Get single application details
export const useGetSingleApplication = (applicantProcessId: string) =>
  useQuery<any, Error, any>({
    queryKey: ["single-application", applicantProcessId],
    queryFn: () => incomingService.getSingleApplication(applicantProcessId),
    enabled: !!applicantProcessId,
  });

// Sendback Process Mutation
export const useSendbackProcess = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, ProcessTypes>({
    mutationFn: processService.sendbackProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["single-application"] });
    },
  });
};
