import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import PositionForm from "@/components/organization/position-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

interface OrganizationEmptyProps {
  onRefresh: () => void;
  onAddRoot: (data: { userId: string; title: string }) => void;
}

export const OrganizationEmpty = ({ onRefresh, onAddRoot }: OrganizationEmptyProps) => {
  const { t } = useTranslation();
  const [addRootDialogOpen, setAddRootDialogOpen] = useState(false);

  const handleAddRoot = (data: { userId: string; title: string }) => {
    onAddRoot(data);
    setAddRootDialogOpen(false);
  };

  return (
    <div className="text-center py-10">
      <p className="mb-4">{t('processManagement.noOrganizationalDataAvailable')}</p>
      <div className="flex justify-center gap-2">
        <Dialog open={addRootDialogOpen} onOpenChange={setAddRootDialogOpen}>
          <DialogTrigger asChild>
            <Button className="main-dark-button">{t('processManagement.addRootPosition')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('processManagement.addRootPosition')}</DialogTitle>
              <DialogDescription>
                {t('processManagement.addRootPositionDescription')}
              </DialogDescription>
            </DialogHeader>
            <PositionForm
              initialData={{
                userId: "",
                title: "",
              }}
              onSubmit={handleAddRoot}
              onCancel={() => setAddRootDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('processManagement.refreshData')}
        </Button>
      </div>
    </div>
  );
};
