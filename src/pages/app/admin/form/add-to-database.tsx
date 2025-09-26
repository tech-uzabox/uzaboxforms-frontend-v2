import { useTranslation } from 'react-i18next';
import AddToDatabaseTable from '@/components/add-to-database/add-to-database-table';

const AddToDatabase = () => {
  const { t } = useTranslation();
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-center">{t('processManagement.addToDatabase')}</h1>
      <AddToDatabaseTable />
    </div>
  );
};

export default AddToDatabase;