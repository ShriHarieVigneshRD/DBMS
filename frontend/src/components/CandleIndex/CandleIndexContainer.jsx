import CandleIndex from "./CandleIndex";
import useFetchIndexCandle from "../../hooks/useFetchIndexCandle";

function CandleIndexContainer({ coinId }) {
    const { ohlcData, isError, isLoading, currency, days, setDays } = useFetchIndexCandle(coinId);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data...</div>;
    }

    return (
        <CandleIndex
            ohlcData={ohlcData}
            setDays={setDays}
            days={days}
            currency={currency}
        />
    );
}

export default CandleIndexContainer;
