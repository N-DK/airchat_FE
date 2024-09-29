import { useEffect, useState } from 'react';
import React from 'react';

export default function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// sử dụng như nào
// const [search, setSearch] = useState('');
// const debouncedSearch = useDebounce(search, 500);

// useEffect(() => {
//     // fetch data with debouncedSearch
// }, [debouncedSearch]);
