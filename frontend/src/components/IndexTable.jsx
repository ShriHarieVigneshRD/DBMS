import { useState } from "react";
import { useQuery } from "react-query";
import currencyStore from '../state/store';
import { useNavigate } from "react-router-dom";
import {fetchTable} from '../services/fetchTable';  

function IndexTable() {

    const { currency } = currencyStore();

    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const { data, isLoading, isError, error} = useQuery(['coins', page, currency], () => fetchTable(page, currency), {
        cacheTime: 1000 * 60 * 2,
        staleTime: 1000 * 60 * 2,
    });

    function handleIndexRedirect(id) {
        navigate(`/details/${id}`);
    }

    if(isError) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    if(isLoading) {
        return <div className="text-gray-500">Loading...</div>
    }
    
    return (
        <div className="my-5 flex flex-col items-center justify-center gap-5 w-[80vw] mx-auto">
            <div className="w-full bg-[#2C3E50] text-white flex py-4 px-2 font-semibold items-center justify-center rounded-lg shadow-md">
                <div className="basis-[35%]">Currency</div>
                <div className="basis-[25%]">Price</div>
                <div className="basis-[20%]">24h Change</div>
                <div className="basis-[20%]">Market Cap</div>
            </div>

            <div className="flex flex-col w-[80vw] mx-auto shadow-lg border-rounded-lg">
                {data && data.map((index, i) => {
                    return (
                        <div 
                            onClick={() => handleIndexRedirect(index.id)} 
                            key={index.id} 
                            className={`w-full flex py-4 px-2 font-semibold items-center justify-between rounded-lg cursor-pointer border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                        >
                            <div className="flex items-center justify-start gap-3 basis-[35%]">
                                <div className="w-[5rem] h-[5rem]">
                                    <img src={index.image} className="w-full h-full" loading="lazy"/>
                                </div>
                                <div className="flex flex-col"> 
                                    <div className="text-3xl">{index.name}</div>
                                    <div className="text-xl text-gray-600">{index.symbol}</div>
                                </div>
                            </div>
                            <div className="basis-[25%]">{index.current_price}</div>
                            <div className={`basis-[20%] ${index.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>{index.price_change_24h}</div>
                            <div className="basis-[20%]">{index.market_cap}</div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 justify-center items-center">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page-1)} 
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg text-2xl disabled:bg-gray-400 hover:bg-blue-600"
                >
                    Prev
                </button>
                <button 
                    onClick={() => setPage(page+1)} 
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg text-2xl hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default IndexTable;
