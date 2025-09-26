import { useLogin } from '@/hooks'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LoginDto } from '@/services/auth'
import CustomInput from '@/components/custom-input'
import { zodResolver } from '@hookform/resolvers/zod'
import PrimaryButton from '@/components/button/primary-button'
import { GoogleAuthButton } from '@/components/button/auth-buttons'
import { loginSchema, type LoginFormData } from '@/validation/auth-schemas'
import { API_URL } from '@/lib/utils'

const LoginPage = () => {
    const { t } = useTranslation()
    const loginMutation = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        const loginData: LoginDto = { email: data.email, password: data.password };
        await loginMutation.mutateAsync(loginData)
    }


    const googleAuth = () => {
        window.open(
            `${API_URL}/auth/google`,
            "_self"
        );
    };

    return (
        <main className='flex items-stretch bg-white text-black h-[100vh]'>
            <section className='w-full px-4 overflow-y-auto lg:pb-8 sm:w-6/12 mx-auto sm:min-w-[480px]'>
                <img
                    src={'/Uzaforms-logo.svg'}
                    alt='UzaForms'
                    className='block mx-auto mt-16 mb-6'
                />
                <section className=''>
                    <p className='text-2xl text-black text-center font-medium'>{t('auth.login')}</p>
                </section>
                <section className='auth-providers max-w-[540px] mx-auto flex items-center justify-center space-x-4 mt-8 w-full'>
                    <GoogleAuthButton
                        handlePress={googleAuth}
                    />
                </section>
                <p className='text-sm text-center py-5'>Or</p>
                <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center flex-col items-center space-y-5 max-w-[540px] mx-auto w-full'>
                    <CustomInput
                        placeholder={t('common.email')}
                        type='text'
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
                    <section className='w-full flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <input type="checkbox" name="remember-me" id="remember-me" className='w-4 h-4' />
                            <p className='text-[13px] text-[#1A1A1A]'>{t('auth.rememberMe')}</p>
                        </div>
                        <Link to={'/auth/recover-password'} className='text-primary text-[13px]'>{t('auth.forgotPassword')}</Link>
                    </section>
                    <PrimaryButton
                        buttonType="submit"
                        title={t('auth.login')}
                        containerStyles='w-full'
                        textStyles=''
                        loading={loginMutation.isPending}
                    />
                </form>
                <div className='flex items-center space-x-1 text-sm w-fit mx-auto pt-4'>
                    <p className='text-black'>{t('auth.alreadyHaveAccount')}</p>
                    <Link to={'/auth/register'} className='text-primary text-base font-medium hover:underline'>{t('auth.register')}</Link>
                </div>
            </section>
            <section className='bg-[url("/Login-bg.png")] h-[100vh] hidden lg:flex items-end justify-end w-6/12 bg-cover bg-no-repeat pb-8 pr-4'>
                <div className='bg-white rounded-lg w-fit py-10 px-4'>
                    <p className='text-center text-[#22262D] font-medium'>Powered by</p>
                    <h2 className='text-[#001A55] font-bold text-center text-2xl'>UZABOX</h2>
                    <p className='text-center text-sm max-w-[420px] mt-6'>Organize all your important information in one place, quickly and easily.</p>
                </div>
            </section>
        </main>
    )
}

export default LoginPage
