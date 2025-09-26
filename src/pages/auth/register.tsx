import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { storeData } from '@/utils/storage';
import { useTranslation } from 'react-i18next';
import { useRegister, useSendOtp } from '@/hooks';
import CustomInput from '@/components/custom-input';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/use-auth-store';
import PrimaryButton from '@/components/button/primary-button';
import { GoogleAuthButton } from '@/components/button/auth-buttons';
import { registerSchema, type RegisterFormData } from '@/validation/auth-schemas';
import { API_URL } from '@/lib/utils';

const RegisterPage = () => {
    const { setUser } = useAuthStore()
    const registerMutation = useRegister()
    const sendOtpMutation = useSendOtp()
    const navigate = useNavigate();
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await registerMutation.mutateAsync(data);
            if (response?.success === true) {
                const otpResponse = await sendOtpMutation.mutateAsync(data.email)
                if (otpResponse?.success == true) {
                    storeData('User', { firstName: data.firstName, lastName: data.lastName, email: data.email })
                    setUser({
                        ...data,
                        id: response.userId,
                        status: 'ENABLED'
                    })
                    navigate('/auth/verify-email');
                } else {
                    toast.error(otpResponse.error);
                }
            } else {
                toast.error(t('common.operationFailed'));
            }
        } catch (error) {
            toast.error(t('processManagement.registrationFailedPleaseTryAgain'));
        }
    };

    const googleAuth = () => {
        window.open(
            `${API_URL}/auth/google/callback`,
            "_self"
        );
    };

    return (
        <main className='flex flex-row items-stretch bg-white text-black h-[100vh]'>
            <section className='w-full px-4 overflow-y-auto lg:pb-8 sm:w-6/12 mx-auto sm:min-w-[480px]'>
                <img
                    src={'/Uzaforms-logo.svg'}
                    alt='UzaForms'
                    className='block mx-auto mt-16 mb-6'
                />
                <section className=''>
                    <p className='text-2xl text-black text-center font-medium'>{t('processManagement.signUp')}</p>
                    <p className='text-sm mt-3 lg:mt-4 text-black text-center max-w-[386px] mx-auto'>
                        {t('processManagement.joinUzaboxformsAndWatchYourOrganizationGetDigitized')}
                    </p>
                </section>
                <section className='auth-providers max-w-[540px] mx-auto flex items-center justify-center space-x-4 mt-8'>
                    <GoogleAuthButton
                        handlePress={googleAuth}
                    />
                </section>
                <p className='text-sm text-center py-5'>Or</p>
                <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center flex-col items-center space-y-5 max-w-[540px] mx-auto'>
                    <CustomInput
                        placeholder={t('processManagement.firstName')}
                        type='text'
                        containerStyles=''
                        error={errors.firstName?.message}
                        {...register('firstName')}
                    />
                    <CustomInput
                        placeholder={t('processManagement.lastName')}
                        type='text'
                        containerStyles=''
                        error={errors.lastName?.message}
                        {...register('lastName')}
                    />
                    <CustomInput
                        placeholder={t('common.email')}
                        type='email'
                        containerStyles=''
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <CustomInput
                        placeholder={t('common.password')}
                        type='password'
                        containerStyles='pr-4'
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <CustomInput
                        placeholder={t('processManagement.confirmPassword')}
                        type='password'
                        containerStyles='pr-4 w-full'
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                    <PrimaryButton
                        buttonType="submit"
                        title={t('processManagement.signUp')}
                        containerStyles='w-full'
                        textStyles=''
                        loading={registerMutation.isPending || sendOtpMutation.isPending}
                    />
                    <div className='flex items-center space-x-1 text-sm'>
                        <p className='text-black'>{t('processManagement.haveAnAccount')}</p>
                        <Link to={'/auth/login'} className='text-primary text-base font-medium hover:underline'>{t('processManagement.signIn')}</Link>
                    </div>
                </form>
            </section>
            <section className='bg-[url("/Signup-bg.png")] h-[100vh] hidden lg:flex items-end justify-end w-6/12 bg-cover bg-no-repeat pb-8 pr-4'>
                <div className='bg-white rounded-lg w-fit py-10 px-4'>
                    <p className='text-center text-[#22262D] font-medium'>{t('processManagement.poweredBy')}</p>
                    <h2 className='text-[#001A55] font-bold text-center text-2xl'>UZABOX</h2>
                    <p className='text-center text-sm max-w-[420px] mt-6'>{t('processManagement.organizeAllYourImportantInformationInOnePlace')}</p>
                </div>
            </section>
        </main>
    );
};

export default RegisterPage;
