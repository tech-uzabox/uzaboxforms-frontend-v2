import React from 'react';
import { Icon } from '@iconify/react';
import { ProcessFormTypes } from '@/types';
import { useTranslation } from 'react-i18next';
import SearchUser from '@/components/settings/search-user';
import AddForm from '@/components/form/form-design/add-form';
import { RoleSelector } from '@/components/ui/role-selector';
import { FormConfigComponentProps } from '@/types/process.types';
import { ArrowUp, ArrowDown, ChevronUp, ChevronDown } from 'lucide-react';

const FormConfigComponent: React.FC<FormConfigComponentProps> = ({
  form,
  index,
  formData,
  isOpen,
  onToggle,
  onMoveUp,
  onMoveDown,
  onRemove,
  onUpdateField,
  onAddForm,
  formOptions,
  canMoveUp,
  canMoveDown,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-5 bg-white">
      <div className="flex justify-between items-center mb-2 bg-[#F6F9FF] p-4 rounded">
        <div className="text-black text-[15px]">{formData.name}</div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-1">
            <button 
              type="button"
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={onMoveUp}
              disabled={!canMoveUp}
              title={t('processManagement.moveUp')}
            >
              <ArrowUp size={16} />
            </button>
            <button 
              type="button"
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={onMoveDown}
              disabled={!canMoveDown}
              title={t('processManagement.moveDown')}
            >
              <ArrowDown size={16} />
            </button>
          </div>
          <button type="button" className="text-gray-500" onClick={onToggle}>
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
          <button type="button" className="text-[#FF7C72] text-xl" onClick={onRemove}>
            <Icon icon="mdi:bin" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 space-y-2">
          {/* Next Step Type */}
          <label className="block text-sm font-medium text-gray-700">{t('processManagement.nextStepType')}</label>
          <select
            className="main-input"
            value={form.nextStepType}
            onChange={(e) => {
              const type = e.target.value as ProcessFormTypes['nextStepType'];
              onUpdateField('nextStepType', type);
              if (type !== 'STATIC') onUpdateField('nextStaff', undefined);
              if (type !== 'DYNAMIC') {
                onUpdateField('nextStepRoles', undefined);
                onUpdateField('nextStepSpecifiedTo', undefined);
              }
            }}
          >
            <option value="STATIC">{t('processManagement.static')}</option>
            <option value="DYNAMIC">{t('processManagement.dynamic')}</option>
            <option value="FOLLOW_ORGANIZATION_CHART">{t('processManagement.followOrgChart')}</option>
            <option value="NOT_APPLICABLE">{t('processManagement.notApplicable')}</option>
          </select>

          {/* Static Next Step */}
          {form.nextStepType === 'STATIC' && (
            <div className="space-y-1">
              <div className="main-label font-medium">{t('processManagement.selectStaffToSubmitTo')}</div>
              <SearchUser
                setUserId={(userId) => onUpdateField('nextStaff', userId)}
                selectedUserId={form.nextStaff}
              />
            </div>
          )}

          {/* Dynamic Next Step */}
          {form.nextStepType === 'DYNAMIC' && (
            <>
              <label className="block text-sm font-medium text-gray-700">{t('processManagement.nextStepRoles')}</label>
              <div className="mb-4">
                <RoleSelector
                  selectedRoles={form.nextStepRoles || []}
                  onRolesChange={(roles) => onUpdateField('nextStepRoles', roles)}
                  placeholder={t('processManagement.selectRoles')}
                />
              </div>

              <label className="block text-sm font-medium text-gray-700">{t('processManagement.nextStepSpecifiedTo')}</label>
              <select
                className="main-input"
                value={form.nextStepSpecifiedTo || ''}
                onChange={(e) => onUpdateField('nextStepSpecifiedTo', e.target.value)}
              >
                <option value="" disabled>
                  {t('processManagement.selectAnOption')}
                </option>
                <option value="SINGLE_STAFF">{t('processManagement.singleStaff')}</option>
                <option value="ALL_STAFF">{t('processManagement.allStaff')}</option>
              </select>
            </>
          )}

          {/* Notification Type */}
          <label className="block text-sm font-medium text-gray-700">{t('processManagement.notificationType')}</label>
          <select
            className="main-input"
            value={form.notificationType}
            onChange={(e) => {
              const type = e.target.value as ProcessFormTypes['notificationType'];
              onUpdateField('notificationType', type);
              if (type !== 'STATIC') onUpdateField('notificationTo', undefined);
              if (type !== 'DYNAMIC') onUpdateField('notificationToRoles', undefined);
            }}
          >
            <option value="STATIC">{t('processManagement.static')}</option>
            <option value="DYNAMIC">{t('processManagement.dynamic')}</option>
            <option value="FOLLOW_ORGANIZATION_CHART">{t('processManagement.followOrgChart')}</option>
            <option value="NOT_APPLICABLE">{t('processManagement.notApplicable')}</option>
          </select>

          {/* Static Notification */}
          {form.notificationType === 'STATIC' && (
            <div className="space-y-1">
              <div className="main-label font-medium">{t('processManagement.selectStaffToNotify')}</div>
              <SearchUser
                setUserId={(userId) => onUpdateField('notificationTo', userId)}
                selectedUserId={form.notificationTo}
              />
              <div className="space-y-1">
                <label className="main-label font-medium">{t('processManagement.notificationComment')}</label>
                <textarea
                  className="main-input"
                  value={form.notificationComment || ''}
                  onChange={(e) => onUpdateField('notificationComment', e.target.value)}
                  rows={4}
                  placeholder={t('processManagement.enterNotificationComment')}
                />
              </div>
            </div>
          )}

          {/* Dynamic Notification */}
          {form.notificationType === 'DYNAMIC' && (
            <>
              <label className="block text-sm font-medium text-gray-700">{t('processManagement.notificationToRoles')}</label>
              <div className="mb-4">
                <RoleSelector
                  selectedRoles={form.notificationToRoles || []}
                  onRolesChange={(roles) => onUpdateField('notificationToRoles', roles)}
                  label={t('processManagement.roles')}
                  placeholder={t('processManagement.selectRoles')}
                />
              </div>
              <div className="space-y-1">
                <label className="main-label font-medium">{t('processManagement.notificationComment')}</label>
                <textarea
                  className="main-input"
                  value={form.notificationComment || ''}
                  onChange={(e) => onUpdateField('notificationComment', e.target.value)}
                  rows={4}
                  placeholder={t('processManagement.enterNotificationComment')}
                />
              </div>
            </>
          )}

          {/* Follow Organization Chart Notification */}
          {form.notificationType === 'FOLLOW_ORGANIZATION_CHART' && (
            <div className="space-y-1">
              <div className="main-label font-medium">
                {t('processManagement.followOrganizationChart')}
              </div>
              <div className="p-3 bg-subprimary border border-primary/20 rounded-md">
                <p className="text-sm text-primary">
                  {t('processManagement.automaticallyNotifyPersonAbove')}
                </p>
              </div>
              <div className="space-y-1">
                <label className="main-label font-medium">{t('processManagement.notificationComment')}</label>
                <textarea
                  className="main-input"
                  value={form.notificationComment || ''}
                  onChange={(e) => onUpdateField('notificationComment', e.target.value)}
                  rows={4}
                  placeholder={t('processManagement.enterNotificationComment')}
                />
              </div>
            </div>
          )}

          {/* Notify Applicant */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`notifyApplicant-${index}`}
              checked={form.notifyApplicant}
              onChange={(e) => onUpdateField('notifyApplicant', e.target.checked)}
              className="h-4 w-4 text-darkBlue focus:ring-darkBlue border-gray-300 rounded"
            />
            <label htmlFor={`notifyApplicant-${index}`} className="text-sm font-medium text-gray-700">
              {t('processManagement.notifyApplicant')}
            </label>
          </div>

          {form.notifyApplicant && (
            <div className="space-y-1">
              <label className="main-label font-medium">{t('processManagement.applicantNotificationContent')}</label>
              <textarea
                className="main-input"
                value={form.applicantNotificationContent || ''}
                onChange={(e) => onUpdateField('applicantNotificationContent', e.target.value)}
                rows={4}
                placeholder={t('processManagement.enterApplicantNotificationContent')}
              />
            </div>
          )}

          {/* Additional Options for non-first forms */}
          {index !== 0 && (
            <>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`editApplicationStatus-${index}`}
                  checked={form.editApplicationStatus}
                  onChange={(e) => onUpdateField('editApplicationStatus', e.target.checked)}
                  className="h-4 w-4 text-darkBlue focus:ring-darkBlue border-gray-300 rounded"
                />
                <label htmlFor={`editApplicationStatus-${index}`} className="text-sm font-medium text-gray-700">
                  {t('processManagement.thisUserCanApproveReject')}
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`applicantViewFormAfterCompletion-${index}`}
                  checked={form.applicantViewFormAfterCompletion}
                  onChange={(e) => onUpdateField('applicantViewFormAfterCompletion', e.target.checked)}
                  className="h-4 w-4 text-darkBlue focus:ring-darkBlue border-gray-300 rounded"
                />
                <label htmlFor={`applicantViewFormAfterCompletion-${index}`} className="text-sm font-medium text-gray-700">
                  {t('processManagement.allowApplicantToSeeForm')}
                </label>
              </div>
            </>
          )}
        </div>
      )}

      <div className="px-4">
        <AddForm name={t('processManagement.addForm')} options={formOptions} onSelect={onAddForm} />
      </div>
    </div>
  );
};

export default FormConfigComponent;
