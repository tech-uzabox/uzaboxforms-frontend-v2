import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/use-auth-store'
import { Card, CardContent, CardTitle } from '../ui/card'

const RoleDisplay = () => {
    const { t } = useTranslation();
    const { roles } = useAuthStore()

    return (
        <Card className="border-none shadow-none">
            <CardTitle>{t('profile.yourRoles')}</CardTitle>

            <CardContent className='p-0 mt-4'>
                {roles && roles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {roles.map((role, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 px-3 py-1.5 rounded text-sm font-medium"
                            >
                                <Icon icon="mdi:badge-account" className="text-base" />
                                <span>{role}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Icon icon="mdi:alert-circle-outline" />
                        <span className="text-sm">{t('profile.noRolesAssigned')}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default RoleDisplay