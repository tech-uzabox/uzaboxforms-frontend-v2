import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Table } from '@/components/table';
import { useTranslation } from 'react-i18next';
import { EditApplicantStatusModel } from '@/components/process/edit-applicant-process-modal';
import { useBreadcrumbStore } from '@/store/ui';
import { 
  ProcessDetailListProps, 
  ProcessDetailApplicantProcess 
} from '@/types/process.types';

export const ProcessDetailList: React.FC<ProcessDetailListProps> = ({
  data,
  isLoading,
  isError,
  processId,
  title,
  loadingMessage,
  errorMessage,
  noDataMessage,
  baseRoute,
  showEditButton = false,
  users = []
}) => {
  const { t } = useTranslation();
  const [selectedApplicantProcess, setSelectedApplicantProcess] = useState<any | null>(null);
  const { setCustomBreadcrumbItems } = useBreadcrumbStore();

  
  // Set breadcrumbs with process name
  useEffect(() => {
    // Try to get process name from the response data
    const processName = (data && 'process' in data) ? data.process.name : 'Unknown Process';
    
    if (processName !== 'Unknown Process') {
      
      // Determine the breadcrumb structure based on the baseRoute
      const isAdminRoute = baseRoute.includes('/admin/management');
      const isStaffRoute = baseRoute.includes('/staff/incoming');
      
      let breadcrumbItems: Array<{ name: string; href: string }> = [];
      
      if (isAdminRoute) {
        // Admin management breadcrumbs
        if (baseRoute.includes('pending-applications')) {
          breadcrumbItems = [
            { name: t("sidebar.management"), href: "" },
            { name: t("processManagement.pendingApplications"), href: "/admin/management/pending-applications" },
            { name: processName, href: "" }
          ];
        } else if (baseRoute.includes('completed-applications')) {
          breadcrumbItems = [
            { name: t("sidebar.management"), href: "" },
            { name: t("processManagement.completedApplications"), href: "/admin/management/completed-applications" },
            { name: processName, href: "" }
          ];
        } else if (baseRoute.includes('disabled-applications')) {
          breadcrumbItems = [
            { name: t("sidebar.management"), href: "" },
            { name: t("processManagement.disabledApplications"), href: "/admin/management/disabled-applications" },
            { name: processName, href: "" }
          ];
        }
      } else if (isStaffRoute) {
        // Staff incoming breadcrumbs
        if (baseRoute.includes('pending-applications')) {
          breadcrumbItems = [
            { name: t("sidebar.incoming"), href: "" },
            { name: t("processManagement.pendingApplications"), href: "/staff/incoming/pending-applications" },
            { name: processName, href: "" }
          ];
        } else if (baseRoute.includes('completed-applications')) {
          breadcrumbItems = [
            { name: t("sidebar.incoming"), href: "" },
            { name: t("processManagement.completedApplications"), href: "/staff/incoming/completed-applications" },
            { name: processName, href: "" }
          ];
        } else if (baseRoute.includes('disabled-applications')) {
          breadcrumbItems = [
            { name: t("sidebar.incoming"), href: "" },
            { name: t("processManagement.disabledApplications"), href: "/staff/incoming/disabled-applications" },
            { name: processName, href: "" }
          ];
        }
      }
      
      if (breadcrumbItems.length > 0) {
        setCustomBreadcrumbItems(breadcrumbItems);
      }
    } else {
      setCustomBreadcrumbItems(null);
    }
  }, [data, baseRoute, t, setCustomBreadcrumbItems]);

  // Cleanup breadcrumbs on unmount
  useEffect(() => {
    return () => {
      setCustomBreadcrumbItems(null);
    };
  }, [setCustomBreadcrumbItems]);

  const formattedApplicantProcesses = useMemo(() => {
    // Handle new backend response structure
    const applicantProcesses = (data && 'applicantProcesses' in data) ? data.applicantProcesses : (Array.isArray(data) ? data : []);
    
    if (!Array.isArray(applicantProcesses)) {
      return [];
    }
    return applicantProcesses
      .filter((_item: ProcessDetailApplicantProcess) => {
        return true;
      })
      .map((item: ProcessDetailApplicantProcess) => {
        let applicantName = 'Unknown';
        if (item.applicant) {
          applicantName = `${item.applicant.firstName || ''} ${item.applicant.lastName || ''}`.trim();
        } else if (users.length > 0) {
          const applicant = users.find((u: any) => u.id === item.applicantId);
          if (applicant) {
            applicantName = `${applicant.firstName} ${applicant.lastName}`;
          }
        }

        // Parse processLevel to get completed and total counts
        let completedFormsCount = 0;
        let totalFormsCount = 0;
        if (item.processLevel && item.processLevel !== 'N/A') {
          const [completed, total] = item.processLevel.split('/').map(Number);
          completedFormsCount = completed;
          totalFormsCount = total;
        }

        return {
          ...item,
          id: item.applicantProcessId,
          service: "Process Applications",
          applicantName,
          processLevel: `${completedFormsCount}/${totalFormsCount}`,
          completedFormsCount,
          totalFormsCount,
          actions: (
            <div className="flex space-x-3">
              <Link
                to={`${baseRoute}/${processId}/${item.applicantProcessId}`}
                className="text-textIcon"
              >
                <Icon icon="akar-icons:eye" fontSize={18} />
              </Link>
              {showEditButton && (
                <button
                  onClick={() => setSelectedApplicantProcess({
                    ...item,
                    processId: processId
                  })}
                  className="text-textIcon"
                >
                  <Icon icon="akar-icons:edit" fontSize={18} />
                </button>
              )}
            </div>
          ),
        };
      });
  }, [data, processId, baseRoute, showEditButton, users]);

  const columns = [
    { key: "applicantName", label: t('processManagement.applicant') },
    { key: "status", label: t('processManagement.status') },
    { key: "processLevel", label: t('processManagement.processLevel') },
    { key: "actions", label: t('processManagement.actions') },
  ];

  const exportData = formattedApplicantProcesses.map((item: any) => ({
    ...item,
    // Override the actions column for export (remove React elements)
    actions: `${item.applicantName} - ${item.status}`,
  }));

  if (isLoading) {
    return <p className="mt-8 text-center text-primary">{loadingMessage}</p>;
  }

  if (isError) {
    return <p className="mt-8 text-center text-red-500">{errorMessage}</p>;
  }

  if (!formattedApplicantProcesses.length) {
    return (
      <p className="mt-8 text-center text-gray-600">
        {noDataMessage}
      </p>
    );
  }

  // Get the actual title to display
  const displayTitle = (data && 'process' in data) ? data.process.name : title;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        {displayTitle}
      </h1>
      <Table
        title={title}
        data={formattedApplicantProcesses}
        columns={columns}
        exportable
        paginate
        exportData={exportData}
      />

      {selectedApplicantProcess && showEditButton && (
        <EditApplicantStatusModel
          isOpen={!!selectedApplicantProcess}
          onClose={() => setSelectedApplicantProcess(null)}
          applicantProcess={selectedApplicantProcess}
        />
      )}
    </div>
  );
};

