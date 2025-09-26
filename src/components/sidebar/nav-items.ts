import type { NavItem } from "@/types";

export const getNavItems = (t: (key: string) => string): NavItem[] => [
  {
    name: t("sidebar.home"),
    href: "/",
    icon: "ic:round-home",
    roles: ["User"],
  },
  {
    name: t("sidebar.applications"),
    icon: "fluent:document-multiple-24-filled",
    href: "/applications",
    roles: ["User"],
  },
  {
    name: t("sidebar.incoming"),
    icon: "heroicons:document-arrow-up-solid",
    roles: ["Staff"],
    subItems: [
      {
        name: t("sidebar.pendingApplications"),
        href: "/staff/incoming/pending-applications",
      },
      {
        name: t("sidebar.processedApplications"),
        href: "/staff/incoming/processed-applications",
      },
      {
        name: t("sidebar.completedApplications"),
        href: "/staff/incoming/completed-applications",
      },
      {
        name: t("sidebar.disabledApplications"),
        href: "/staff/incoming/disabled-applications",
      },
    ],
  },
  {
    name: t("sidebar.groups"),
    icon: "material-symbols-light:folder",
    href: "/admin/group",
    roles: ["Admin"],
  },
  {
    name: t("sidebar.forms"),
    icon: "simple-icons:googleforms",
    roles: ["Admin"],
    subItems: [
      { name: t("sidebar.formNames"), href: "/admin/form" },
      { name: t("sidebar.addToDatabase"), href: "/admin/form/add-to-database" },
    ],
  },
  {
    name: t("sidebar.process"),
    icon: "fluent:document-sync-24-filled",
    roles: ["Admin"],
    subItems: [
      { name: t("sidebar.processNames"), href: "/admin/processes" },
      {
        name: t("sidebar.disabledProcess"),
        href: "/admin/process/process-disabled",
      },
    ],
  },
  {
    name: t("sidebar.management"),
    icon: "fluent:document-queue-24-filled",
    roles: ["Admin"],
    subItems: [
      {
        name: t("sidebar.pendingApplications"),
        href: "/admin/management/pending-applications",
      },
      {
        name: t("sidebar.completedApplications"),
        href: "/admin/management/completed-applications",
      },
      {
        name: t("sidebar.disabledApplications"),
        href: "/admin/management/disabled-applications",
      },
    ],
  },
  {
    name: t("sidebar.dashboards"),
    icon: "tabler:layout-dashboard-filled",
    roles: ["User"],
    href: "/dashboards",
  },
  {
    name: t("sidebar.uzaAI"),
    href: "/admin/chat",
    icon: "mingcute:ai-fill",
    roles: ["Admin", "Uza Ask AI"],
  },
  {
    name: t("sidebar.settings"),
    icon: "fluent:document-settings-20-filled",
    roles: ["Admin"],
    subItems: [
      { name: t("sidebar.users"), href: "/admin/settings/users" },
      {
        name: t("sidebar.organizationChart"),
        href: "/admin/settings/organization-chart",
      },
      {
        name: t("sidebar.dashboardManagement"),
        href: "/admin/settings/dashboard-management",
      },
      { name: t("sidebar.management"), href: "/admin/settings/management" },
    ],
  },
  {
    name: t("sidebar.qrCode"),
    icon: "tabler:qrcode",
    href: "/qr-code",
    roles: ["QR-Code generator"],
    subItems: [
      { name: t("sidebar.generateQRCode"), href: "/qr-code/generate" },
      { name: t("sidebar.myDocuments"), href: "/qr-code/my-documents" },
      {
        name: t("sidebar.allDocuments"),
        href: "/qr-code/all-documents",
        roles: ["QR-Code all documents verifier"],
      },
    ],
  },
];
