import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const CandleIndex = ({ currency = "bitcoin", days, setDays }) => {
    const [ohlcData, setOhlcData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [yAxisMin, setYAxisMin] = useState(0);
    const [yAxisMax, setYAxisMax] = useState(100);

    useEffect(() => {
        const fetchOHLCData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Validate currency parameter
                const validCurrency = currency || "bitcoin";
                const url = `https://api.coingecko.com/api/v3/coins/${validCurrency}/ohlc?vs_currency=usd&days=${days}`;
                
                console.log("API Request URL:", url); // Debugging

                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid data format received from API");
                }

                if (data.length === 0) {
                    setOhlcData([]);
                    setError("No data available for selected parameters");
                    return;
                }

                const formattedData = data.map(entry => ({
                    x: new Date(entry[0]),
                    y: [entry[1], entry[2], entry[3], entry[4]]
                }));

                setOhlcData(formattedData);

                // Calculate Y-axis range with padding
                const allPrices = data.flatMap(entry => [entry[1], entry[2], entry[3], entry[4]]);
                const minY = Math.min(...allPrices);
                const maxY = Math.max(...allPrices);
                const rangePadding = (maxY - minY) * 0.1; // 10% padding

                setYAxisMin(minY - rangePadding);
                setYAxisMax(maxY + rangePadding);

            } catch (error) {
                console.error("API Error:", error);
                setError(error.message || "Failed to fetch market data");
                setOhlcData([]);
            } finally {
                setLoading(false);
            }
        };

        // Add delay to prevent rate limiting
        const fetchTimer = setTimeout(fetchOHLCData, 500);
        return () => clearTimeout(fetchTimer);
    }, [currency, days]);

    const chartOptions = {
        chart: {
            type: "candlestick",
            height: 380,
            toolbar: { show: false },
            zoom: { enabled: false },
            animations: { enabled: false }
        },
        title: {
            text: `${currency.toUpperCase()} Price Chart (${days} ${days === 1 ? "Day" : "Days"})`,
            align: "center",
            style: { fontSize: '16px' }
        },
        xaxis: {
            type: "datetime",
            labels: {
                datetimeUTC: false
            }
        },
        yaxis: {
            min: yAxisMin,
            max: yAxisMax,
            forceNiceScale: false,
            labels: {
                formatter: (val) => `${val.toFixed(2)}`,
            },
            tooltip: { enabled: true }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#10B981',
                    downward: '#EF4444'
                },
                wick: {
                    useFillColor: true
                }
            }
        },
        noData: {
            text: loading ? "Loading..." : error || "No data available",
            align: 'center',
            verticalAlign: 'middle'
        }
    };

    return (
        <div className="p-4 rounded-lg shadow-md bg-white">
            <div className="h-[400px]">
                {ohlcData.length > 0 ? (
                    <Chart
                        options={chartOptions}
                        series={[{ data: ohlcData }]}
                        type="candlestick"
                        height="100%"
                    />
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">
                            {loading ? "Loading market data..." : error || "No data to display"}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-2 mt-4">
                {[1, 7, 30, 90, 365].map(day => (
                    <button
                        key={day}
                        onClick={() => setDays(day)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                            days === day 
                                ? "bg-blue-700 text-white" 
                                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                        }`}
                    >
                        {day === 1 ? "24 Hours" : `${day} Days`}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CandleIndex;