import { RouteGuard } from "@/components/guards/route-guard";
import { LoadingFallback, RouteChangeHandler } from "@/components/nprogress";
import { RouteMetaHandler } from "@/components/ui";
import { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./i18n";
import AuthProvider from "./providers/auth-provider";
import ReactQueryProvider from "./providers/react-query";
import SWRProvider from "./providers/swr-provider";
import { allRoutes } from "./routes";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ReactQueryProvider>
        <AuthProvider>
          <SWRProvider>
            <div className="App">
              <RouteChangeHandler />
              <RouteMetaHandler />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {allRoutes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <RouteGuard route={route}>{route.element}</RouteGuard>
                      }
                    >
                      {route.children?.map((childRoute, childIndex) => (
                        <Route
                          key={childIndex}
                          path={childRoute.path}
                          element={
                            <RouteGuard route={childRoute}>
                              {childRoute.element}
                            </RouteGuard>
                          }
                        />
                      ))}
                    </Route>
                  ))}
                </Routes>
              </Suspense>
              <Toaster position="top-right" />
            </div>
          </SWRProvider>
        </AuthProvider>
      </ReactQueryProvider>
    </Router>
  );
}

export default App;
