import { fetcher } from "@/lib/utils";
import { SWRConfig } from "swr";

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        
      }}
    >
      {children}
    </SWRConfig>
  );
}
