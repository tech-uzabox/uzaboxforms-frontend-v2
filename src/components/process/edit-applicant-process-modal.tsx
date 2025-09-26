import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useUpdateApplicantProcess } from '@/hooks';
import { useAuthStore } from '@/store/use-auth-store';
import { DialogTrigger } from '@radix-ui/react-dialog';
import React, { useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EditStatusModalProps } from '@/types/process.types';

export const EditApplicantStatusModel: React.FC<EditStatusModalProps> = ({ isOpen, onClose, applicantProcess }) => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [status, setStatus] = useState(applicantProcess.status);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const updateApplicantProcessMutation = useUpdateApplicantProcess();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!comment.trim()) {
            toast.warning(t('processManagement.pleaseProvideCommentBeforeSubmitting'));
            return;
        }

        setIsSubmitting(true);
        try {
            const updateData = {
                status,
                id: applicantProcess.applicantProcessId,
                comment,
                processId: applicantProcess.processId,
                userId: user?.id,
            };
            
            const response = await updateApplicantProcessMutation.mutateAsync(updateData);

            if (response) {
                toast.success(t('common.applicationUpdatedSuccessfully'));
                onClose();
            }
        } catch (error) {
            console.error('🔍 EditApplicantStatusModel - Update error:', error);
            toast.error(t('processManagement.failedToUpdateStatus'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <button type="button" onClick={onClose} className="absolute top-0 right-0 mt-2 mr-2 text-gray-500">
                </button>
            </DialogTrigger>
            <DialogContent className="sm:rounded">
                <DialogHeader>
                    <DialogTitle>{t('processManagement.applicationStatusSeenByApplicant')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="main-label">{t('processManagement.status')}</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="main-input"
                            required
                        >
                            <option value="">{t('processManagement.selectStatus')}</option>
                            <option value="ENABLED">{t('processManagement.enabled')}</option>
                            <option value="DISABLED">{t('processManagement.disabled')}</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="main-label">{t('processManagement.commentToApplicantAutoSentViaEmail')}</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="main-input"
                            rows={4}
                            required
                            placeholder={t('processManagement.explainWhyStatusIsBeingChanged')}
                        />
                    </div>
                    <button
                        type="submit"
                        className="main-dark-button float-right"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('processManagement.updating') : t('processManagement.update')}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};