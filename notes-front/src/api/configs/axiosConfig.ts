import axios from "axios";
import toast from "react-hot-toast";
import { ACCESS_TOKEN } from "../../common/constants";
import { setIsLoggedIn } from "../../common/sessionStorage";

const axiosInstance = axios.create({
    baseURL: 'http://185.178.46.243:8080/',
    timeout: 60000
});

axiosInstance.interceptors.request.use(
    request => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token)
            request.headers.Authorization = token
        return request;
    },
    error => Promise.reject(error))

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            toast.error('Your session was expired. Please sign in again')
            localStorage.removeItem(ACCESS_TOKEN)
            setIsLoggedIn(false)
            return Promise.reject(error);
        }

        if (error.response.status === 420) {
            return Promise.reject(error);
        }

        toast.error(error.response.data.errorMessage!)
        return Promise.reject(error);
    }
);

export default axiosInstance;