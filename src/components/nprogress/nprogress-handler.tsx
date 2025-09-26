import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FullScreenLoader } from "@/components/ui";
import NProgress from "../../config/nprogress.config";

// Component to handle route changes and NProgress
export function RouteChangeHandler() {
  const location = useLocation();

  useEffect(() => {
    NProgress.done();
  }, [location]);

  return null;
}

// Loading component with NProgress
export function LoadingFallback() {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return <FullScreenLoader label="Loading application..." />;
}
