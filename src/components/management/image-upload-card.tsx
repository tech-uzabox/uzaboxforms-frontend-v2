import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { ImageType, ImageData } from "@/types";
import { useUploadImage, useDeleteImage } from "@/hooks/management/use-management";

interface ImageUploadCardProps {
  type: ImageType;
  image?: ImageData;
  onImageChange: () => void;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  type,
  image,
  onImageChange,
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageMutation = useUploadImage();
  const deleteImageMutation = useDeleteImage();

  const handleFileUpload = async (file: File) => {
    // Validate file
    if (!file) {
      toast.error(t("processManagement.noFileSelected"));
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("processManagement.invalidFileType"));
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(t("processManagement.fileTooLarge"));
      return;
    }

    try {
      setIsUploading(true);
      await uploadImageMutation.mutateAsync({ file, type });
      toast.success(t("processManagement.imageUploadedSuccessfully"));
      onImageChange();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(t("processManagement.uploadingImageFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      handleFileUpload(selectedFile);
    }
  };

  const handleDeleteImage = async () => {
    if (!image) return;

    try {
      setIsDeleting(true);
      await deleteImageMutation.mutateAsync({ id: image.id, type });
      toast.success(t("processManagement.imageDeletedSuccessfully"));
      onImageChange();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(t("processManagement.deletingImageFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getImageTitle = () => {
    return type === "HEADER"
      ? t("processManagement.headerImage")
      : t("processManagement.footerImage");
  };

  const getImageDescription = () => {
    return type === "HEADER"
      ? t("processManagement.headerImageDescription")
      : t("processManagement.footerImageDescription");
  };

  const getNoImageMessage = () => {
    return type === "HEADER"
      ? t("processManagement.noHeaderImage")
      : t("processManagement.noFooterImage");
  };

  const getUploadButtonText = () => {
    return type === "HEADER"
      ? t("processManagement.uploadHeaderImage")
      : t("processManagement.uploadFooterImage");
  };

  const getDeleteButtonText = () => {
    return type === "HEADER"
      ? t("processManagement.deleteHeaderImage")
      : t("processManagement.deleteFooterImage");
  };

  return (
    <Card className="border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors shadow-none">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Icon icon="material-symbols:image" className="text-2xl text-primary" />
        </div>
        <CardTitle className="text-xl">{getImageTitle()}</CardTitle>
        <CardDescription>{getImageDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {image ? (
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={image.fileUrl}
                alt={type}
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.png";
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Icon
                  icon="material-symbols:visibility"
                  className="text-white text-2xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon
                  icon="material-symbols:check-circle"
                  className="text-green-600"
                />
                <span className="text-sm font-medium text-green-800">
                  {t("processManagement.imageUploaded")}
                </span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {t("processManagement.active")}
              </Badge>
            </div>

            <Button
              onClick={handleDeleteImage}
              disabled={isDeleting}
              variant="destructive"
              className="w-full"
            >
              {isDeleting ? (
                <>
                  <Icon icon="eos-icons:loading" className="mr-2" />
                  {t("processManagement.deleting")}
                </>
              ) : (
                <>
                  <Icon icon="material-symbols:delete" className="mr-2" />
                  {getDeleteButtonText()}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon
                icon="material-symbols:add-photo-alternate"
                className="text-3xl text-gray-400"
              />
            </div>
            <p className="text-sm text-gray-500">{getNoImageMessage()}</p>
            <Button
              onClick={handleButtonClick}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Icon icon="eos-icons:loading" className="mr-2" />
                  {t("processManagement.uploading")}
                </>
              ) : (
                <>
                  <Icon icon="material-symbols:upload" className="mr-2" />
                  {getUploadButtonText()}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadCard;
