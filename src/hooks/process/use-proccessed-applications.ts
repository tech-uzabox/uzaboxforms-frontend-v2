import { useMutation, useQuery } from "@tanstack/react-query";
import { processedApplicationsService } from "@/services/process";

export const usecreateProcessedApplication = () => useMutation<any, Error, any>({ mutationFn: processedApplicationsService.createProcessedApplication })

export const useGetProcessedApplications  = (userId: string) => useQuery<any, Error, any>({ queryKey: ['processed-applications', userId], queryFn: processedApplicationsService.getProcessedApplications });

export const useGetProcessedApplicationsForProcess = ({ userId, processId }: { userId: string, processId: string }) => useQuery<any, Error, any>({ queryKey: ['processed-process', userId, processId], queryFn: processedApplicationsService.getProcessedApplicationsForProcess });

export const useGetSingleProcessedApplication = ({ userId, processId, applicantProcessId }: { userId: string, processId: string, applicantProcessId: string }) => useQuery<any, Error, any>({ queryKey: ['single-applicant-process', userId, processId, applicantProcessId], queryFn: processedApplicationsService.getSingleProcessedApplication });