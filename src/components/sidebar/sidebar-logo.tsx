import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SidebarLogoProps {
  isSidebarMinimized: boolean;
}

export function SidebarLogo({ isSidebarMinimized }: SidebarLogoProps) {
  const { t } = useTranslation();
  
  return (
    <Link to={'/'} className='text-2xl text-center text-blue-700 font-semibold'>
      <img
        src={isSidebarMinimized ? '/uzaforms-logo-small.svg' : '/Uzaforms-logo.svg'}
        alt={t('common.appName')}
        className={'h-[65px]'}
      />
    </Link>
  );
}
