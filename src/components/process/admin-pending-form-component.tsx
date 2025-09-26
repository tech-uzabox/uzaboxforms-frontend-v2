"use client";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { Clock, User, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminPendingFormComponentProps {
  formId: string;
  processId: string;
  applicantProcessId: string;
  applicationData: any;
}

const AdminPendingFormComponent: React.FC<AdminPendingFormComponentProps> = ({
  applicantProcessId,
  applicationData,
}) => {
  const { t } = useTranslation();

  const data = applicationData?.data || applicationData;
  const pendingForm = data?.pendingForm;
  const completedForms = data?.completedForms;
  const application = data?.application;
  
  const lastCompletedForm = completedForms && completedForms.length > 0 
    ? completedForms[completedForms.length - 1] || null
    : null;


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
      <Card className="border border-primary/5 bg-blue-50/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-600" />
            {t('processManagement.pendingForm')}: {pendingForm?.formName || pendingForm?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Badge
                variant="outline"
                className="bg-yellow-100 border-yellow-300 text-yellow-700"
              >
                {t('processManagement.waitingForReview')}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {t('processManagement.formOf', { 
                current: application?.currentLevel || 1, 
                total: application?.totalForms || 0 
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">{t('processManagement.applicant')}:</span>
              <span className="ml-2">
                {application?.applicant?.firstName}{" "}
                {application?.applicant?.lastName}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <FileText className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">{t('processManagement.process')}:</span>
              <span className="ml-2">{data?.process?.name || applicationData?.process?.name}</span>
            </div>

            {lastCompletedForm && (
              <>
                <div className="border-t pt-3">
                  <h4 className="font-medium text-sm mb-2">{t('processManagement.lastAction')}:</h4>
                  <div className="bg-white p-3 rounded border">
                    <div className="flex items-center text-sm mb-2">
                      <span className="font-medium">{t('processManagement.form')}:</span>
                      <span className="ml-2">{lastCompletedForm.formName}</span>
                    </div>
                    <div className="flex items-center text-sm mb-2">
                      <span className="font-medium">{t('processManagement.completedBy')}:</span>
                      <span className="ml-2">
                        {lastCompletedForm.reviewer
                          ? `${lastCompletedForm.reviewer.firstName} ${lastCompletedForm.reviewer.lastName}`
                          : lastCompletedForm.reviewerId
                          ? `ID: ${lastCompletedForm.reviewerId}`
                          : t('processManagement.unknown')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm mb-2">
                      <span className="font-medium">{t('processManagement.date')}:</span>
                      <span className="ml-2">
                        {lastCompletedForm.completedAt && !isNaN(new Date(lastCompletedForm.completedAt).getTime())
                          ? format(
                              new Date(lastCompletedForm.completedAt),
                              "MMM dd, yyyy HH:mm"
                            )
                          : t('processManagement.noDateAvailable')}
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
              <div className="bg-blue-50/20 p-3 rounded border border-blue-100">
                <h4 className="font-medium text-sm text-blue-800 mb-2">
                  {t('processManagement.adminInformation')}:
                </h4>
                <p className="text-sm text-primary">
                  {t('processManagement.adminInformationMessage')}
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

export default AdminPendingFormComponent;
