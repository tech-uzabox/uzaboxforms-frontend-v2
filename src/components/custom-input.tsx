import { Icon } from '@iconify/react';
import React, { type FormEvent, useState, forwardRef } from 'react';

interface inputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    type: string;
    containerStyles?: string;
    inputStyles?: string;
    error?: string;
}

const CustomInput = forwardRef<HTMLInputElement, inputProps>(({ type, placeholder, containerStyles, inputStyles, error, ...props }, ref) => {
    const [inputType, setInputType] = useState(type)

    const handleTogglePassword = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        { inputType == 'password' ? setInputType('text') : setInputType('password') }
    }

    return (
        <div className="w-full">
            <main className={`rounded-lg border-l-[2.4px] ${error ? 'border-red-500' : 'border-primary'} w-full overflow-hidden focus-within:border-primary ${containerStyles} flex items-center bg-[#F6F9FF]`}>
                <input
                    ref={ref}
                    type={inputType}
                    placeholder={placeholder}
                    className={`px-5 h-[56px] text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none ${inputStyles}`}
                    {...props}
                />
                {
                    type == 'password' && inputType == 'password' ?
                        <button onClick={handleTogglePassword}>
                            <Icon icon="bi:eye" className='text-[20px] text-textmain' />
                        </button> :
                        type == 'password' && inputType == 'text' ?
                            <button onClick={handleTogglePassword}>
                                <Icon icon="humbleicons:eye-off" className='text-[20px] text-textmain' />
                            </button> :
                            null
                }
            </main>
            {error && (
                <p className="text-red-500 text-sm mt-1 pl-2">{error}</p>
            )}
        </div>
    )
});

CustomInput.displayName = 'CustomInput';

export default CustomInput