import type { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next';

interface formSearchProps{
    value: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const FormSearch: FC<formSearchProps> = ({ value, handleChange }) => {
  const { t } = useTranslation();
    return (
        <input
            type="text"
            placeholder={t('processManagement.search')}
            value={value}
            onChange={handleChange}
            className="rounded-md text-sm outline-none px-4 h-[48px] w-full max-w-2xl bg-subprimary"
        />
    )
}

export default FormSearch