import type { ProcessApplication, Processes } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { reportsService } from "@/services/process";

export const useGetApplicationProcessesReport = () => useQuery<Processes, Error, Processes>({ queryKey: ['reporting/processes'], queryFn: reportsService.getProcesses });

export const useGetApplicationProcessesPerProcessReport = (processId: string) => useQuery<ProcessApplication[], Error, ProcessApplication[]>({ queryKey: ['reporting/processes', processId], queryFn: () => reportsService.getAllApplicantProcessesPerProcess(processId) });