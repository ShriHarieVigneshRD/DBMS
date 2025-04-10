import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from "chart.js/auto";
import { chartDays } from "../../helpers/constants.js";

Chart.register(CategoryScale);

function LineIndex({ historicData, setDays, setCoinInterval, days, currency }) {
    const chartRef = useRef(null);

    function handleDayChange(daysSelected) {
        if (daysSelected === 1) {
            setCoinInterval?.('');
        } else {
            setCoinInterval?.('daily');
        }
        setDays?.(daysSelected);
    }

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy(); // Destroy previous chart
            }
        };
    }, [historicData]);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            {historicData ? (
                <div className="h-[390px] w-full mt-2">
                    <Line 
                        ref={chartRef}
                        data={{
                            labels: historicData.prices?.map(coinPrice => {
                                let date = new Date(coinPrice[0]);
                                let time = date.getHours() > 12 ? 
                                    `${date.getHours() - 12}:${date.getMinutes()} PM` :
                                    `${date.getHours()}:${date.getMinutes()} AM`;
                                return days === 1 ? time : date.toLocaleDateString();
                            }),
                            datasets: [
                                {
                                    label: `Price (Past ${days} ${days === 1 ? 'Day' : 'Days'}) in ${currency?.toUpperCase()}`,
                                    data: historicData.prices?.map(coinPrice => coinPrice[1]),
                                }
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            elements: {
                                point: { radius: 0 }
                            },
                        }}
                    />
                </div>
            ) : (
                <div className="mt-6 text-lg font-semibold text-red-500">
                    NO DATA AVAILABLE
                </div>
            )}

            {/* Days Selection Buttons */}
            <div className="flex justify-center mt-5 space-x-3">
                {chartDays.map((day, index) => (
                    <button
                        key={index}
                        onClick={() => handleDayChange(day.value)}
                        className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                            days === day.value ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-black'
                        }`}
                    >
                        {day.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LineIndex;
