import { useQuery } from "@tanstack/react-query";
import { authorizedAPI } from "@/config/axios.config";

export function useFormsWithCountries() {
  return useQuery({
    queryKey: ["forms-with-countries"],
    queryFn: async () => {
      const res = await authorizedAPI.get("/forms/with-countries");
      return res.data;
    },
  });
}

