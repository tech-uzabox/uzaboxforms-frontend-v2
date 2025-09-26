import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/use-auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { authService, type RegisterDto, type LoginDto, type ChangePasswordDto, type UpdateProfileDto } from "@/services/auth";

export const useRegister = () => {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (userData: RegisterDto) =>
            authService.register(userData),
        onError: async () => {
            toast.error(t('common.operationFailed'))
        }   
    });
};

export const useLogin = () => {
    const navigate = useNavigate()
    const { setUser, setRoles } = useAuthStore()
    const { t } = useTranslation();
    
    return useMutation({
        mutationFn: (userData: LoginDto) =>
            authService.login(userData),
        onSuccess: async (response: any) => {
            // Backend sets tokens in HTTP-only cookies automatically
            if (response.accessToken && response.refreshToken) {
                // Get user profile to set auth state
                try {
                    const profileResponse = await authService.getProfile();
                    const {roles, ...user} = profileResponse;
                    
                    if (user.status === "ENABLED") {
                        setUser(user);
                        setRoles(roles);
                        toast.success(t('common.loginSuccessful'));
                        navigate('/');
                    } else {
                        toast.error(t('common.accountDisabled'));
                    }
                } catch (error) {
                    console.error('Failed to get profile after login:', error);
                    toast.error(t('common.loginFailedProfile'));
                }
            } else {
                toast.error(t('common.operationFailed'));
            }
        },
        onError: async () => {
            toast.error(t('common.operationFailed'))
        }
    });
};

export const useLogout = () => {
    const navigate = useNavigate();
    const { clearAuth } = useAuthStore();
    const { t } = useTranslation();
    
    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            clearAuth();
            toast.success(t('common.logoutSuccessful'));
            navigate('/auth/login');
        },
        onError: () => {
            clearAuth();
            toast.info(t('common.loggedOutLocally'));
            navigate('/auth/login');
        }
    });
}; 

export const useSendOtp = () => {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (email: string) => authService.sendOtp(email),
        onSuccess: (response: any) => {
            if (response) {
                toast.success(t('common.otpSentSuccessfully'));
            }
        },
        onError: () => {
            toast.error(t('common.otpSendFailed'));
        }
    });
};

export const useVerifyEmail = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    return useMutation({
        mutationFn: ({ email, OTP }: { email: string; OTP: string }) =>
            authService.verifyEmail({ email, OTP }),
        onSuccess: (response: any) => {
            if (response) {
                toast.success(t('common.emailVerifiedSuccessfully'));
                navigate('/')
            }
        },
        onError: () => {
            toast.error(t('common.emailVerificationFailed'));
        }
    });
};

export const useResetPassword = () => { 
    const { t } = useTranslation();
    return useMutation({
        mutationFn: ({ email, OTP, newPassword }: { email: string; OTP: string; newPassword: string }) =>
            authService.resetPassword({ email, OTP, newPassword }),
        onSuccess: (response: any) => {
            if (response) {
                toast.success(t('common.passwordResetSuccessful'));
            }
        },
        onError: () => {
            toast.error(t('common.operationFailed'));
        }
    });
};

export const useChangePassword = () => {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (data: ChangePasswordDto) =>
            authService.changePassword(data),
        onSuccess: (response: any) => {
            if (response) {
                toast.success(t('common.passwordChangedSuccessfully'));
            }
        },
        onError: () => {
            toast.error(t('common.passwordChangeFailed'));
        }
    });
};

export const useUpdateProfile = () => {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (data: UpdateProfileDto) =>
            authService.updateProfile(data),
        onSuccess: (response: any) => {
            if (response) {
                toast.success(t('common.profileUpdatedSuccessfully'));
            }
        },
        onError: () => {
            toast.error(t('common.profileUpdateFailed'));
        }
    });
};


export const useUploadAvatar = () => {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (file: File) => authService.uploadAvatar(file),
        onSuccess: (response: any) => {
            if (response) {
                toast.success(t('common.avatarUploadedSuccessfully'));
            }
        },
        onError: () => {
            toast.error(t('common.avatarUploadFailed'));
        }
    });
};

export const useGetProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: () => authService.getProfile(),
        enabled: false,
        retry: false,
    });
};
