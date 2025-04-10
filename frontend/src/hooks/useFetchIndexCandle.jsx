import { useState } from 'react';
import currencyStore from '../state/store';
import { useQuery } from 'react-query';
import { fetchIndexCandle } from '../services/fetchIndexCandle';

function useFetchIndexCandle(coinId) {
    const { currency } = currencyStore();
    const [days, setDays] = useState(7);

    const { data: ohlcData, isLoading, isError } = useQuery(
        ['coinOHLCData', coinId, currency, days],
        () => fetchIndexCandle(coinId, days, currency),
        {
            cacheTime: 1000 * 60 * 2,
            staleTime: 1000 * 60 * 2,
        }
    );

    return {
        ohlcData,
        isLoading,
        isError,
        setDays,
        days,
        currency
    };
}

export default useFetchIndexCandle;
