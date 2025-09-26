import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

interface Applicant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  googleId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApplicantProcess {
  applicantProcessId: string;
  applicantId: string;
  applicant: Applicant;
  status: string;
  completedForms: string[];
  pendingForm?: {
    formId: string;
    nextStepType: string;
    nextStepRoles: string[];
    nextStepSpecifiedTo: string | null;
  };
  processLevel: string;
}

interface Process {
  processId: string;
  name: string;
  applicantProcesses: ApplicantProcess[];
}

interface Group {
  groupName: string;
  groupId: string;
  processes: Process[];
}

interface ApplicationsListProps {
  data: Group[];
  isLoading: boolean;
  isError: boolean;
  title: string;
  loadingMessage: string;
  errorMessage: string;
  searchPlaceholder: string;
  baseRoute: string;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  data,
  isLoading,
  isError,
  title,
  loadingMessage,
  errorMessage,
  searchPlaceholder,
  baseRoute,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const groupedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data;
  }, [data]);

  const filteredGroupsData = useMemo(() => {
    if (!groupedData.length) return [];

    return groupedData.filter((group: Group) => {
      const groupNameMatch = group.groupName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const processNameMatch = group.processes.some((process: Process) =>
        process.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return groupNameMatch || processNameMatch;
    });
  }, [groupedData, searchQuery]);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-700">{loadingMessage}</div>;
  }

  if (isError) {
    return (
      <p className="mt-8 text-center text-red-600">
        {errorMessage}
      </p>
    );
  }

  return (
    <main className="py-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center text-primary">
        {title}
      </h1>
      <div className="mb-12 flex justify-center relative items-center space-x-2 rounded-md pl-4 h-[48px] w-full bg-subprimary text-sm">
        <Icon icon={"lucide:search"} fontSize={18} className="text-textIcon" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="outline-none flex-1 bg-inherit"
        />
      </div>
      <div className="bg-white space-y-7">
        {filteredGroupsData.map((group: Group) => {
          return (
            <div
              key={group.groupId}
              className="px-4 py-3 rounded-lg border-l-[2.4px] border-darkBlue"
            >
              <h2 className="text-xl font-medium mb-3 text-black">
                {group.groupName}
              </h2>
              <div className="list-disc list-inside space-y-3">
                {group.processes.map((process: Process) => {
                  return (
                    <div
                      key={process.processId}
                      className="text-black hover:text-[#001544] text-sm hover:underline space-y-3"
                    >
                      {process.applicantProcesses.length > 0 && (
                        <div className="flex space-x-2 items-center w-8/12">
                          <p className="bg-[#001A55] h-[24px] w-[24px] rounded-full flex justify-center items-center text-white text-[10px]">
                            {process.applicantProcesses.length}
                          </p>
                          <Link
                            to={`${baseRoute}/${process.processId}`}
                          >
                            {process.name}
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ApplicationsList;
