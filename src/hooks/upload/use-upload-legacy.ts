import { uploadLegacyService } from "@/services/upload";
import { useMutation, useQuery } from "@tanstack/react-query";

// ------------ REACT QUERY HOOKS ------------
export const useUploadFiles = () => {
  return useMutation({
    mutationFn: uploadLegacyService.uploadFilesApi,
  });
};

export const useGetJobStatus = (jobId: string) => {
  return useQuery({
    queryKey: ["job-status", jobId],
    queryFn: () => uploadLegacyService.getJobStatusApi(jobId),
    enabled: !!jobId,
    refetchInterval: 500,
  });
};
