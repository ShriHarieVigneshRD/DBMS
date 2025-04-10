import { useQuery } from "react-query";
import { fetchDetails } from "../services/fetchDetails.js";
import currencyStore from '../state/store';
function useFetchDetails(id) {
    
    const { currency } = currencyStore();

    const { isError, isLoading, data: coin } = useQuery(["coin", id], () => fetchDetails(id), {
        cacheTime: 1000 * 60 * 2,
        staleTime: 1000 * 60 * 2,
    });

    return {
        currency,
        isError,
        isLoading,
        coin
    }
}

export default useFetchDetails;
