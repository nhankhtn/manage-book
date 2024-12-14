import { useState, useEffect } from "react";

export const useDebounce = (value, delay=500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        console.log(debouncedValue);
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}