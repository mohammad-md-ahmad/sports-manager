import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Constants from '../helpers/constants';
import { useLoading } from '../LoadingContext';
import Snackbar from 'react-native-snackbar';
import { getToken } from '../helpers/tokenManage';

abstract class AxiosService {
    private instance: AxiosInstance;

    constructor() {
        let baseURL = Constants.apiUrl;
        this.instance = axios.create({
            baseURL,
            timeout: 10000, // 10 secs
            timeoutErrorMessage: 'API connection timeout',
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        const { setGlobalLoading } = useLoading();
        this.instance.interceptors.request.use(
            async (config) => {
                // You can modify the request config here (e.g., add headers)
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                setGlobalLoading(true);
                return config;
            },
            (error) => {
                setGlobalLoading(false);

                if (axios.isCancel(error)) {
                    // Request was canceled
                    return Promise.reject(error);
                } else if (error.code === 'ECONNABORTED') {
                    // Request timeout
                    console.error('Request timeout', error.message);
                    displaySnackbar('A connection to server couldn\'t be made. Please make you have internet access.');

                    return Promise.reject(error);
                } else {
                    // Other errors
                    console.error('Request failed', error);
                    displaySnackbar('Request couldn\'t be made.');

                    return Promise.reject(error);
                }
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                // You can handle successful responses here
                setGlobalLoading(false);
                return response;
            },
            (error) => {
                setGlobalLoading(false);

                if (axios.isCancel(error)) {
                    // Request was canceled
                    return Promise.reject(error);
                } else if (error.code === 'ECONNABORTED') {
                    // Request timeout
                    console.error('Request timeout', error.message);
                    displaySnackbar('A connection to server couldn\'t be made. Please make you have internet access.');

                    return Promise.reject(error);
                } else {
                    // Other errors
                    console.error('Request failed', error);
                    displaySnackbar('Request couldn\'t be made.');

                    return Promise.reject(error);
                }
            }
        );

        const displaySnackbar = (message: string) => {
            // Display a Snackbar message with the provided message
            Snackbar.show({
                text: message,
                duration: Snackbar.LENGTH_SHORT,
            });
        };
    }


    public async get<T = any, R = AxiosResponse<T>>(
        url: string,
        config?: object
    ): Promise<R> {
        return this.instance.get<T, R>(url, config);
    }

    public async post<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: object,
        config?: object
    ): Promise<R> {
        return this.instance.post<T, R>(url, data, config);
    }

    public async put<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: object,
        config?: object
    ): Promise<R> {
        return this.instance.put<T, R>(url, data, config);
    }

    public async delete<T = any, R = AxiosResponse<T>>(
        url: string,
        config?: object
    ): Promise<R> {
        return this.instance.delete<T, R>(url, config);
    }

    // Add more HTTP methods as needed (e.g., patch, etc.)
}

export default AxiosService;
