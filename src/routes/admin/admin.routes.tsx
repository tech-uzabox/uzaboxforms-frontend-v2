import type { RouteConfig } from "../types";
import { adminFormRoutes } from "./form.routes";
import { adminGroupRoutes } from "./group.routes";
import { adminProcessRoutes } from "./process.routes";
import { adminSettingsRoutes } from "./settings.routes";
import { adminDashboardRoutes } from "./dashboard.routes";
import { adminManagementRoutes } from "./management.routes";
import { chatRoutes } from "./chat.routes";

export const adminRoutes: RouteConfig[] = [
  ...adminDashboardRoutes,
  ...adminSettingsRoutes,
  ...adminFormRoutes,
  ...adminProcessRoutes,
  ...adminGroupRoutes,
  ...adminManagementRoutes,
  ...chatRoutes
];
