import { useEffect, useState } from 'react';

const useScript = (url: string) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;

        script.onload = () => setIsLoaded(true);
        script.onerror = () => console.error(`Failed to load script ${url}`);

        document.body.appendChild(script);

        // return () => {
        //     document.body.removeChild(script);
        // };
    }, [url]);

    return isLoaded;
};

export default useScript;