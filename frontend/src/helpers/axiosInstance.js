import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: "https://api.coingecko.com/api/v3",
});

export default axiosInstance;