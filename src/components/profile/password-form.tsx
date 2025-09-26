
import type React from "react"

import { toast } from "sonner"
import { useState } from "react"
import { useChangePassword } from "@/hooks"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from 'react-i18next'
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "@/store/use-auth-store"

const PasswordForm = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const changePasswordMutation = useChangePassword()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate passwords
        if (newPassword !== confirmPassword) {
            toast.error(t('profile.newPasswordsDoNotMatch'))
            return
        }

        try {
            setIsUpdating(true)

            const response = await changePasswordMutation.mutateAsync({
                userId: user?.id || '',
                currentPassword,
                newPassword,
            })

            if (!response) {
                const data = await response
                throw new Error(data.message || t('profile.failedToChangePassword'))
            }

            // Reset form
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")

            toast.success(t('profile.passwordChangedSuccessfully'))
        } catch (error: any) {
            console.error("Password change error", error)
            toast.error(t('profile.failedToChangePassword'))
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                    <div className="relative">
                        <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder={t('profile.enterCurrentPassword')}
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showCurrentPassword ? t('profile.hidePassword') : t('profile.showPassword')}</span>
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={t('profile.enterNewPassword')}
                            required
                            minLength={8}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showNewPassword ? t('profile.hidePassword') : t('profile.showPassword')}</span>
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('profile.confirmNewPassword')}</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t('profile.confirmNewPasswordPlaceholder')}
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showConfirmPassword ? t('profile.hidePassword') : t('profile.showPassword')}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="main-dark-button" disabled={isUpdating}>
                    {isUpdating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('profile.updating')}
                        </>
                    ) : (
                        t('profile.changePassword')
                    )}
                </Button>
            </div>
        </form>
    )
}

export default PasswordForm