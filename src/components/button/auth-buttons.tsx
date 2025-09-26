import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

interface buttonProps {
    handlePress: () => void;
}

export const GoogleAuthButton: React.FC<buttonProps> = ({ handlePress }) => {
  const { t } = useTranslation();
    return (
        <button onClick={handlePress} className='flex items-center justify-center space-x-4 text-[#2C3038] px-4 h-[56px] bg-[#F6F9FF] border-l-[2.4px] border-primary rounded-lg w-full cursor-pointer'>
            <Icon icon="flat-color-icons:google" className='text-[24px]' />
            <p className='font-medium text-sm'>{t('processManagement.continueWithGoogle')}</p>
        </button>
    )
}

export const FacebookAuthButton = () => {
  const { t } = useTranslation();
    return(
        <button className='flex items-center space-x-2 text-black px-4 py-2 border-2 border-[#DEDEDE] rounded-md'>
            <Icon icon="logos:facebook" />
            <p>{t('processManagement.facebook')}</p>
        </button>
    )
}