import NProgress from "nprogress";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.1,
  trickleSpeed: 200,
});

export default NProgress;
