import { useEffect } from "react";

export function useLogDeviceDimensions() {
  useEffect(() => {
    function logDimensions() {
      console.log("📐 Device dimensions:");
      console.log("window.innerWidth:", window.innerWidth);
      console.log("window.innerHeight:", window.innerHeight);
      console.log("screen.width:", window.screen.width);
      console.log("screen.height:", window.screen.height);
      console.log("devicePixelRatio:", window.devicePixelRatio);
    }

    // Log immediately
    logDimensions();

    // Log again on resize
    window.addEventListener("resize", logDimensions);
    return () => window.removeEventListener("resize", logDimensions);
  }, []);
}