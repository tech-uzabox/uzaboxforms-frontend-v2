import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {t('processManagement.pageNotFound')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('processManagement.pageNotFoundDescription')}
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              {t('processManagement.goToHome')}
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>{t('processManagement.ifYouBelieveThisIsAnErrorPleaseContactSupport')}</p>
        </div>
      </div>
    </div>
  );
}
