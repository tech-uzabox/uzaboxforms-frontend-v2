import { useQuery } from "@tanstack/react-query";
import { groupProcessService } from "@/services/group-process";

export const useGetAllGroupAndProcesses = (userId: string) =>
  useQuery<any, Error, any>({
    queryKey: ["group-forms", userId],
    queryFn: groupProcessService.getAllGroupAndProcessesByUserId,
  });
