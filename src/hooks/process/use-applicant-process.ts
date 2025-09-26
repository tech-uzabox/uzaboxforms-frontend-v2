import { applicantProcessService } from "@/services/process";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllApplicantProcesses = () =>
  useQuery<any, Error>({
    queryKey: ["applicant-process"],
    queryFn: applicantProcessService.getAllApplicantProcesses,
  });

export const useCreateApplicantProcess = () => {
  return useMutation<any, Error, any>({
    mutationFn: applicantProcessService.createApplicantProcess,
  });
};

export const useUpdateApplicantProcess = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: applicantProcessService.updateApplicantProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-applications"] });
      queryClient.invalidateQueries({ queryKey: ["disabled-applications"] });

      queryClient.invalidateQueries({
        queryKey: ["pending-applications-process"],
      });
      queryClient.invalidateQueries({
        queryKey: ["disabled-applications-process"],
      });
    },
  });
};

export const useGetApplicantProcessByUserId = (userId: string) =>
  useQuery<any, Error, any>({
    queryKey: ["applicant-process", userId],
    queryFn: applicantProcessService.getApplicantProcessByUserId,
  });

export const useBulkCreateApplicantProcess = () => {
  return useMutation<any, Error, FormData>({
    mutationFn: applicantProcessService.bulkCreateApplicantProcess,
  });
};
