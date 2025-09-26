import { toast } from 'sonner';
import { useState } from 'react';
import OTPInput from 'react-otp-input'; 
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import PrimaryButton from '@/components/button/primary-button';
import { useSendOtp, useVerifyEmail, useResetPassword } from '@/hooks';
import { recoverEmailSchema, recoverOtpSchema, recoverPasswordSchema, type RecoverEmailFormData, type RecoverOtpFormData, type RecoverPasswordFormData } from '@/validation/auth-schemas';

const RecoverPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate()
    const { t } = useTranslation()

    const sendVerificationCodeMutation = useSendOtp();
    const verifyOTPMutation = useVerifyEmail();
    const resetPasswordMutation = useResetPassword();

    // Step 1: Email form
    const emailForm = useForm<RecoverEmailFormData>({
        resolver: zodResolver(recoverEmailSchema),
    });

    // Step 2: OTP form
    const otpForm = useForm<RecoverOtpFormData>({
        resolver: zodResolver(recoverOtpSchema),
    });

    // Step 3: Password form
    const passwordForm = useForm<RecoverPasswordFormData>({
        resolver: zodResolver(recoverPasswordSchema),
    });

    const handleEmailSubmit = async (data: RecoverEmailFormData) => {
        try {
            const response = await sendVerificationCodeMutation.mutateAsync(data.email);
            if (response) {
                setEmail(data.email);
                toast.success(t('processManagement.verificationCodeSent'));
                setStep(2);
            } else {
                toast.error(t('common.operationFailed'));
            }
        } catch (error) {
            toast.error(t('processManagement.failedToSendVerificationCode'));
        }
    };

    const handleOTPSubmit = async (data: RecoverOtpFormData) => {
        try {
            const response = await verifyOTPMutation.mutateAsync({ email, OTP: data.otp });
            if (response) {
                setOtp(data.otp);
                toast.success(t('processManagement.otpVerified'));
                setStep(3);
            } else {
                toast.error(t('common.operationFailed'));
            }
        } catch (error) {
            toast.error(t('processManagement.failedToVerifyOtp'));
        }
    };

    const handlePasswordSubmit = async (data: RecoverPasswordFormData) => {
        try {
            const response = await resetPasswordMutation.mutateAsync({ email, OTP: otp, newPassword: data.newPassword });
            if (response) {
                toast.success(t('processManagement.passwordResetSuccessfully'));
                navigate('/auth/login')
            } else {
                toast.error(t('common.operationFailed'));
            }
        } catch (error) {
            toast.error(t('processManagement.failedToResetPassword'));
        }
    };

    return (
        <main className="flex justify-center items-center min-h-screen">
            <div className="flex justify-center items-center rounded-3xl mx-auto mt-[2rem] md:p-[4rem] max-w-[1240px] py-[1rem] md:w-fit w-full">
                {step === 1 && (
                    <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="rounded-3xl border p-4 md:p-10 shadow-sm w-11/12 md:min-w-[607px] flex flex-col items-center">
                        <h1 className="text-[#000D3B] text-3xl font-medium text-center">{t('processManagement.recoverPassword')}</h1>
                        <p className="text-[#989898] font-medium mt-[2rem] text-sm text-center">
                            {t('processManagement.enterYourEmailAddressToReceiveVerificationCode')}
                        </p>
                        <div className="w-full">
                            <input
                                type="email"
                                placeholder={t('processManagement.enterYourEmail')}
                                className={`main-input ${emailForm.formState.errors.email ? 'border-red-500' : ''}`}
                                {...emailForm.register('email')}
                            />
                            {emailForm.formState.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{emailForm.formState.errors.email.message}</p>
                            )}
                        </div>
                        <PrimaryButton
                            title={t('processManagement.sendCode')}
                            containerStyles="w-6/12 mx-auto mt-6"
                            loading={sendVerificationCodeMutation.isPending}
                        />
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="rounded-3xl border p-4 md:p-10 shadow-sm w-11/12 md:min-w-[607px] flex flex-col items-center">
                        <h1 className="text-[#000D3B] text-3xl font-medium text-center">{t('processManagement.otpVerification')}</h1>
                        <p className="text-[#989898] font-medium mt-[2rem] text-sm text-center">
                            {t('processManagement.weveSentAnOtpCodeToYourEmail')} <br />
                            <b className="text-black">{email}</b> {t('processManagement.andFillItIn')}
                        </p>
                        <div className="w-full">
                            <OTPInput
                                value={otp}
                                onChange={(value) => {
                                    setOtp(value);
                                    otpForm.setValue('otp', value);
                                }}
                                numInputs={6}
                                renderSeparator={<span></span>}
                                renderInput={(props) => <input {...props} />}
                                containerStyle={'w-full flex items-center justify-center mt-6 space-x-2'}
                                inputStyle={'border min-w-10 min-h-10 rounded-md border-'}
                            />
                            {otpForm.formState.errors.otp && (
                                <p className="text-red-500 text-sm mt-1 text-center">{otpForm.formState.errors.otp.message}</p>
                            )}
                        </div>
                        <PrimaryButton
                            title={t('processManagement.submit')}
                            containerStyles="w-6/12 mx-auto mt-6"
                            loading={verifyOTPMutation.isPending}
                        />
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="rounded-3xl border p-4 md:p-10 shadow-sm w-11/12 md:min-w-[607px] flex flex-col items-center">
                        <h1 className="text-[#000D3B] text-3xl font-medium text-center">{t('processManagement.setNewPassword')}</h1>
                        <p className="text-[#989898] font-medium mt-[2rem] text-sm text-center">
                            {t('processManagement.pleaseEnterYourNewPasswordBelow')}
                        </p>
                        <div className="w-full">
                            <input
                                type="password"
                                placeholder={t('processManagement.enterNewPassword')}
                                className={`main-input ${passwordForm.formState.errors.newPassword ? 'border-red-500' : ''}`}
                                {...passwordForm.register('newPassword')}
                            />
                            {passwordForm.formState.errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                            )}
                        </div>
                        <PrimaryButton
                            title={t('processManagement.resetPassword')}
                            containerStyles="w-6/12 mx-auto mt-6"
                            loading={resetPasswordMutation.isPending}
                        />
                    </form>
                )}
            </div>
        </main>
    );
};

export default RecoverPasswordPage;