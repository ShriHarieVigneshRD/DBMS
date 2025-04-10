import LineIndex from "./LineIndex";
import useFetchIndexLine from "../../hooks/useFetchIndexLine";

function LineIndexContainer({ coinId }) {

    const { historicData, isError, isLoading, currency, days, setDays, setCoinInterval } = useFetchIndexLine(coinId);

    if(isLoading) {
        return <div>Loading...</div>
    }

    if(isError) {
        return <div>Error...</div>
    }

    return (
        <>
            <LineIndex 
                historicData={historicData} 
                setDays={setDays} 
                setCoinInterval={setCoinInterval} 
                days={days}
                currency={currency}
            />
        </>
    );
}

export default LineIndexContainer;