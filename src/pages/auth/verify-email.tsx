import OTPInput from 'react-otp-input';
import { useVerifyEmail } from '@/hooks';
import { getData } from '@/utils/storage';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import PrimaryButton from '@/components/button/primary-button';
import { verifyEmailSchema, type VerifyEmailFormData } from '@/validation/auth-schemas';

const VerifyEmailPage = () => {
    const [otp, setOtp] = useState('');
    const [user, setUser] = useState({ email: '', firstName: '', lastName: '' });
    const verifyEmailMutation = useVerifyEmail()
    const { t } = useTranslation()

    const {
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<VerifyEmailFormData>({
        resolver: zodResolver(verifyEmailSchema),
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getData('User');
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const onSubmit = async (data: VerifyEmailFormData) => {
        await verifyEmailMutation.mutateAsync({ email: user.email, OTP: data.otp })
    }

    return (
        <main>
            <div className="ellipse-bg-otp-verification flex justify-center items-center rounded-3xl mx-auto mt-[2rem] md:p-[4rem] max-w-[1240px] py-[1rem] md:w-fit w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border p-4 md:p-10 shadow-sm  w-11/12 md:min-w-[607px] flex flex-col items-center ">
                    <h1 className='text-[#000D3B] text-3xl font-medium text-center'>{t('processManagement.otpVerification')}</h1>
                    <p className='text-[#989898] font-medium mt-[2rem] text-sm text-center'>
                        {t('processManagement.weveSentAnOtpCodeCheckYourEmail')} <br />
                        <b className='text-black'>{user.email}</b> {t('processManagement.andFillItIn')}
                    </p>
                    <div className="w-full">
                        <OTPInput
                            value={otp}
                            onChange={(value) => {
                                setOtp(value);
                                setValue('otp', value);
                            }}
                            numInputs={6}
                            renderSeparator={<span></span>}
                            renderInput={(props) => <input {...props} />}
                            containerStyle={'w-full flex items-center justify-center mt-6 space-x-2'}
                            inputStyle={'border min-w-10 min-h-10 rounded-md border-'}
                        />
                        {errors.otp && (
                            <p className="text-red-500 text-sm mt-1 text-center">{errors.otp.message}</p>
                        )}
                    </div>
                    <PrimaryButton
                        title={t('processManagement.submit')}
                        containerStyles='w-6/12 mx-auto mt-6'
                        textStyles=''
                        loading={verifyEmailMutation.isPending}
                    />
                </form>
            </div>
        </main>
    )
}

export default VerifyEmailPage