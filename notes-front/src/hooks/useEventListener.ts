import { useEffect } from "react"

const useEventListener = (
    type: any,
    key: string,
    callback: (e: KeyboardEvent) => void
) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === key && callback(e);
        window.addEventListener(type, handler);
        return () => window.removeEventListener(type, handler as EventListener);
    }, [type, key, callback]);
};

export default useEventListener;