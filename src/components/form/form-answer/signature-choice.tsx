import React from 'react';
import { useTranslation } from 'react-i18next';

interface SignatureChoiceProps {
    onChoice: (choice: 'draw' | 'upload' | null) => void;
    currentChoice?: 'draw' | 'upload' | null;
}

export const SignatureChoice: React.FC<SignatureChoiceProps> = ({ onChoice, currentChoice }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center space-x-5 pt-3 text-sm">
            <div className="flex space-x-4 items-center">
                <button
                    onClick={() => onChoice('draw')}
                    type='button'
                    className={`main-dark-button ${
                        currentChoice === 'draw' 
                            ? '!text-white !bg-[#012473]' 
                            : '!text-[#012473] !bg-subprimary hover:!text-white'
                    }`}
                >
                    {t('forms.drawSignature')}
                </button>
                <p>{t('forms.or')}</p>
                <button
                    onClick={() => onChoice('upload')}
                    type='button'
                    className={`main-dark-button ${
                        currentChoice === 'upload' 
                            ? '!text-white !bg-[#012473]' 
                            : '!text-[#012473] !bg-subprimary hover:!text-white'
                    }`}
                >
                    {t('forms.uploadSignature')}
                </button>
                {currentChoice && (
                    <button
                        onClick={() => onChoice(null)}
                        type='button'
                        className="text-red-500 hover:text-red-700 text-sm underline"
                    >
                        {t('forms.clearChoice')}
                    </button>
                )}
            </div>
        </div>
    );
};