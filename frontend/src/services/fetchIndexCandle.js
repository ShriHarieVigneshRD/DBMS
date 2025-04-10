import axiosInstance from "../helpers/axiosInstance";

export async function fetchIndexCandle(id, days = 7, currency = "usd") {
    try {
        const response = await axiosInstance.get(`/coins/${id}/ohlc?vs_currency=${currency}&days=${days}`);
        return response.data; // Returns array of [timestamp, open, high, low, close]
    } catch (error) {
        console.error("Error fetching OHLC data:", error);
        return null;
    }
}
