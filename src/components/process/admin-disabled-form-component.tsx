"use client";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { AlertTriangle, User, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDisabledFormComponentProps {
  formId: string;
  processId: string;
  applicantProcessId: string;
  completedFormIds: string[];
  applicationData: any;
}

const AdminDisabledFormComponent: React.FC<AdminDisabledFormComponentProps> = ({
  applicantProcessId,
  completedFormIds,
  applicationData,
}) => {
  const { t } = useTranslation();
  const nextForm = applicationData.nextForm;
  const lastCompletedForm =
    applicationData.formHistory[applicationData.formHistory.length - 1];

  const getStepTypeDescription = (stepType: string) => {
    switch (stepType) {
      case "STATIC":
        return t('processManagement.assignedToSpecificStaffMember');
      case "DYNAMIC":
        return t('processManagement.assignedToUsersWithSpecificRoles');
      case "FOLLOW_ORGANIZATION_CHART":
        return t('processManagement.assignedToSupervisor');
      case "NOT_APPLICABLE":
        return t('processManagement.endOfProcess');
      default:
        return stepType;
    }
  };

  return (
    <div className="max-w-screen-md mb-4">
      <Card className="border border-red-200 bg-red-50/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            {t('processManagement.disabledForm')}: {nextForm?.name || t('processManagement.unknownForm')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Badge
                variant="outline"
                className="bg-red-100 border-red-300 text-red-700"
              >
                {t('processManagement.applicationDisabled')}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {t('processManagement.formOf', { current: completedFormIds.length + 1, total: applicationData.application.totalForms })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">{t('processManagement.applicant')}:</span>
              <span className="ml-2">
                {applicationData.application.applicant.firstName}{" "}
                {applicationData.application.applicant.lastName}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <FileText className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">{t('processManagement.process')}:</span>
              <span className="ml-2">{applicationData.process.name}</span>
            </div>

            {lastCompletedForm && (
              <>
                <div className="border-t pt-3">
                  <h4 className="font-medium text-sm mb-2">{t('processManagement.lastAction')}:</h4>
                  <div className="bg-white p-3 rounded border">
                    <div className="flex items-center text-sm mb-2">
                      <span className="font-medium">{t('processManagement.form')}:</span>
                      <span className="ml-2">{lastCompletedForm.name}</span>
                    </div>
                    <div className="flex items-center text-sm mb-2">
                      <span className="font-medium">{t('processManagement.completedBy')}:</span>
                      <span className="ml-2">
                        {lastCompletedForm.reviewer
                          ? `${lastCompletedForm.reviewer.firstName} ${lastCompletedForm.reviewer.lastName}`
                          : t('processManagement.unknown')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm mb-2">
                      <span className="font-medium">{t('processManagement.date')}:</span>
                      <span className="ml-2">
                        {format(
                          new Date(lastCompletedForm.completedAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <ChevronRight className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="font-medium">{t('processManagement.nextStep')}:</span>
                      <span className="ml-2">
                        {getStepTypeDescription(lastCompletedForm.nextStepType)}
                      </span>
                    </div>
                    {lastCompletedForm.notificationComment && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">{t('processManagement.comment')}:</span>
                        <span className="ml-2">
                          {lastCompletedForm.notificationComment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="border-t pt-3">
              <div className="bg-red-50/20 p-3 rounded border border-red-100">
                <h4 className="font-medium text-sm text-red-800 mb-2">
                  {t('processManagement.applicationStatus')}:
                </h4>
                <p className="text-sm text-red-700">
                  {t('processManagement.applicationDisabledMessage')}
                </p>
                <div className="mt-2 text-xs">
                  <strong>{t('processManagement.applicationId')}:</strong> {applicantProcessId}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDisabledFormComponent;
