import { useState } from 'react';
import currencyStore from '../state/store';
import { useQuery } from 'react-query';
import { fetchIndexLine } from '../services/fetchIndexLine';

function useFetchIndexLine(coinId) {
    const { currency } = currencyStore();

    const [days, setDays] = useState(7);
    const [interval, setCoinInterval] = useState('daily');

    const { data: historicData, isLoading, isError } = useQuery(['coinHistoricData', coinId, currency, days, interval], () => fetchIndexLine(coinId, interval, days, currency), {
        cacheTime: 1000 * 60 * 2,
        staleTime: 1000 * 60 * 2,
    });

    return {
        historicData,
        isLoading,
        isError,
        setDays,
        setCoinInterval,
        days,
        currency
    }
}

export default useFetchIndexLine;