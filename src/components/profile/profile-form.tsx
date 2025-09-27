
import type React from "react"

import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"
import RoleDisplay from "./role-display"
import { useUpdateProfile } from "@/hooks"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from 'react-i18next'
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/use-auth-store"
import { Loader2, Upload, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fileService } from "@/services/upload/file.service"
import { useServeFileById } from "@/hooks/upload/use-file"

const ProfileForm = () => {
    const { t } = useTranslation();
    const { user, setUser } = useAuthStore()
    const [firstName, setFirstName] = useState(user?.firstName || "")
    const [lastName, setLastName] = useState(user?.lastName || "")
    const [photoId, setPhotoId] = useState<string | null>(user?.photo || null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const updateProfileMutation = useUpdateProfile()

    // Use the hook to get file content and convert to blob URL
    const { 
        data: imageUrl, 
        isLoading: isLoadingImage, 
        error: imageError 
    } = useServeFileById(photoId || '');

    useEffect(() => {
        if (user?.photo) {
            setPhotoId(user.photo);
        }
    }, [user]);

    const uploadImage = async (file: File) => {
        try {
            setIsUploading(true)
            const response = await fileService.uploadFile({ file, folder: 'profile-photos' });
            
            if (response.id) {
                const updateResponse = await updateProfileMutation.mutateAsync({
                    userId: user?.id || '',
                    firstName,
                    lastName,
                    photo: response.id
                });

                setPhotoId(response.id);
                setUser(updateResponse);
                toast.success(t('profile.profilePictureUploadedSuccessfully'));
            } else {
                toast.error(t('profile.failedToUploadProfilePicture'));
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error(t('profile.failedToUploadProfilePicture'));
        } finally {
            setIsUploading(false);
        }
    }

    const deleteImage = async (fileId: string) => {
        try {
            setIsDeleting(true);
            const response = await fileService.deleteFile(fileId);
            
            if (response.success) {
                const updateResponse = await updateProfileMutation.mutateAsync({
                    userId: user?.id || '',
                    firstName,
                    lastName,
                    photo: ""
                });

                setPhotoId(null);
                setUser(updateResponse);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                toast.success(t('profile.profilePictureRemovedSuccessfully'));
            } else {
                toast.error(t('profile.failedToRemoveProfilePicture'));
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error(t('profile.failedToRemoveProfilePicture'));
        } finally {
            setIsDeleting(false);
        }
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            await uploadImage(selectedFile);
        }
    }

    const handleImageUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleImageDeleteClick = () => {
        if (photoId) {
            deleteImage(photoId);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setIsUpdating(true)

            const response = await updateProfileMutation.mutateAsync({
                userId: user?.id || '',
                firstName,
                lastName,
                photo: photoId ? photoId : undefined
            })

            if (!response) {
                throw new Error("Failed to update profile")
            }

            const { user: updatedUser } = await response
            setUser(updatedUser)

            toast.success(t('profile.profileUpdatedSuccessfully'))
        } catch (error) {
            console.error("Update error", error)
            toast.error(t('profile.failedToUpdateProfile'))
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8">
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage 
                            src={imageUrl || undefined} 
                            alt={`${firstName} ${lastName}`} 
                            className="object-cover" 
                        />
                        <AvatarFallback className="text-xl">
                            {firstName && lastName ? `${firstName[0]}${lastName[0]}` : user?.email?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleImageUploadClick}
                            disabled={isUploading || isDeleting}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
{t('profile.uploading')}
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
{t('profile.upload')}
                                </>
                            )}
                        </Button>

                        {photoId && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleImageDeleteClick}
                                disabled={isUploading || isDeleting}
                                className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={isUploading || isDeleting}
                    />
                </div>

                <div className="w-full space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder={t('profile.enterFirstName')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder={t('profile.enterLastName')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t('profile.email')}</Label>
                        <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
                        <p className="text-sm text-muted-foreground">{t('profile.emailCannotBeChanged')}</p>
                    </div>
                </div>
            </div>
            <RoleDisplay />
            <div className="flex justify-end">
                <Button type="submit" className="main-dark-button" disabled={isUpdating || isUploading || isDeleting}>
                    {isUpdating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('profile.updating')}
                        </>
                    ) : (
                        t('profile.saveChanges')
                    )}
                </Button>
            </div>
        </form>
    )
}

export default ProfileForm