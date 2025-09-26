import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { Table } from "@/components/table";
import { useTranslation } from "react-i18next";
import React, { useMemo, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useGetApplicantProcessByUserId } from "@/hooks";
import { Link } from "react-router-dom";

const ApplicationsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [searchQuery, _setSearchQuery] = useState("");
  const { data: applicantProcesses, isLoading } =
    useGetApplicantProcessByUserId(user?.id || "");

  const formattedApplications = useMemo(() => {
    if (!applicantProcesses || !Array.isArray(applicantProcesses)) return [];

    return applicantProcesses?.map((app: any) => ({
      ...app,
      createdAtDisplay: dayjs(app.createdAt).format("MMM D, YYYY, h:mm A"),
      actions: (
        <Link
          to={`/application-response/${app.processId}/${app.id}/${app.firstFormId}`}
          className="text-textIcon"
        >
          <Icon icon="akar-icons:eye" fontSize={18} />
        </Link>
      ),
    }));
  }, [applicantProcesses, user]);

  const filteredApplications = useMemo(() => {
    return formattedApplications.filter(
      (app: any) =>
        app.processName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.level.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [formattedApplications, searchQuery]);

  const columns = [
    { key: "processName", label: t("navigation.forms") },
    { key: "status", label: t("applications.applicationStatus") },
    { key: "level", label: "Process Level" },
    { key: "createdAtDisplay", label: t("applications.submittedOn") },
    { key: "actions", label: t("common.actions") },
  ];

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">{t("common.loading")}</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {t("applications.myApplications")}
      </h1>
      <Table
        paginate
        exportable
        data={filteredApplications}
        columns={columns}
        title={t("applications.myApplications")}
        exportData={filteredApplications}
      />
    </div>
  );
};

export default ApplicationsPage;
