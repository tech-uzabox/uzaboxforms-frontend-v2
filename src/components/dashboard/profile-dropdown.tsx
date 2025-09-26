import { useState } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogout } from '@/hooks/auth/use-auth';
import { useAuthStore } from '@/store/use-auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ProfileDropdown: React.FC = () => {
    const { user } = useAuthStore();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { t } = useTranslation();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsLogoutDialogOpen(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className='flex items-center outline-none focus:ring-0 hover:bg-subprimary p-2 rounded-md space-x-2'>
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.photo ? `/api/uploads/${user?.photo}` : undefined} alt={`${user?.firstName} ${user?.lastName}`} className="object-cover" />
                        <AvatarFallback className="text-base">
                            {user?.firstName && user?.lastName ? `${user?.firstName[0]}${user?.lastName[0]}` : user?.email?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col items-start'>
                        <p className='text-base text-[#070B14]'>{user?.firstName} {user?.lastName}</p>
                        <p className='text-[10px] -mt-1 truncate max-w-[128px] overflow-hidden text-ellipsis'>{user?.email}</p>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-full min-w-[16rem]'>
                    <DropdownMenuLabel>{t('profile.myAccount')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='p-0'>
                        <Link className='w-full p-2' to={'/profile'}>{t('common.profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='cursor-pointer' onClick={() => setIsLogoutDialogOpen(true)}>{t('common.logout')}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


            {isLogoutDialogOpen && (
                <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {t('auth.confirmLogout')}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                                {t('auth.logoutMessage')}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsLogoutDialogOpen(false)}
                                className="mt-3 sm:mt-0"
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('auth.loggingOut')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        {t('common.logout')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default ProfileDropdown;