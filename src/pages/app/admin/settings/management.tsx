import {
  ImageUploadCard,
  InfoPanel,
  LoadingState,
  ErrorState,
  ManagementHeader,
} from "@/components/management";
import type { ImageData } from "@/types";
import { useTranslation } from "react-i18next";
import { useGetAllImages } from "@/hooks/management/use-management";

const ManagementSettings = () => {
  const { t } = useTranslation();
  const { data: allImages, isPending, isError, refetch } = useGetAllImages();

  // Find current images
  const headerImage = allImages?.find((img: ImageData) => img.type === "HEADER");
  const footerImage = allImages?.find((img: ImageData) => img.type === "FOOTER");

  const handleImageChange = () => {
      refetch();
  };

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  return (
    <div className="space-y-8">
      <ManagementHeader
        title={t("processManagement.managementSettings")}
        description={t("processManagement.manageHeaderFooterImages")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageUploadCard
          type="HEADER"
          image={headerImage}
          onImageChange={handleImageChange}
        />
        <ImageUploadCard
          type="FOOTER"
          image={footerImage}
          onImageChange={handleImageChange}
        />
      </div>

      <InfoPanel
        title={t("processManagement.imageGuidelines")}
        items={[
          t("processManagement.maxFileSize"),
          t("processManagement.supportedFormats"),
          t("processManagement.recommendedDimensions"),
          t("processManagement.oneImagePerType"),
        ]}
      />
    </div>
  );
};

export default ManagementSettings;