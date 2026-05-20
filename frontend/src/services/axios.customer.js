import axios from "axios";
import nProgress from "nprogress";


const BASE_URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_BACKEND_URL : "/api"
const instance = axios.create({
    baseURL: BASE_URL
});

instance.interceptors.request.use(function (config) {
    nProgress.start();

    return config;
}, function (error) {
    nProgress.done();
    return Promise.reject(error);
});

instance.interceptors.response.use(
    function (response) {
        nProgress.done();

        // if (response.data && response.data.result) return response.data.result
        return response.data;

    },
    function (error) {
        nProgress.done();
        if (error.response && error.response.data) return error.response.data;
        return Promise.reject(error);
    },
);

export default instance