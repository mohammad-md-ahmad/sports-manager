import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Constants from '../helpers/constants';
import Snackbar from 'react-native-snackbar';
import { getToken } from '../helpers/tokenManage';
import { useDispatch } from 'react-redux';

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

    protected async initializePromise(dataGetter: () => Promise<string | null>) {
        const data = await dataGetter();
        return data === null ? null : JSON.parse(data);
    }

    private setupInterceptors() {
        const dispatch = useDispatch();
        this.instance.interceptors.request.use(
            async (config) => {
                dispatch({ type: 'SET_LOADING', payload: true });
                // You can modify the request config here (e.g., add headers)
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                //console.log('Request Body Data:', config.data);

                return config;
            },
            (error) => {
                dispatch({ type: 'SET_LOADING', payload: false });
                if (axios.isCancel(error)) {
                    // Request was canceled
                    return Promise.reject(error);
                } else if (error.code === 'ECONNABORTED') {
                    // Request timeout
                    console.error('Request timeout', error.message);
                    displaySnackbar('A connection to server couldn\'t be made. Please make you have internet access.');

                    return Promise.reject(error);
                } else {
                    console.log('Error', error);

                    console.error('Request failed', error);
                    displaySnackbar('Request couldn\'t be made.');

                    return Promise.reject(error);
                }
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                // You can handle successful responses here
                dispatch({ type: 'SET_LOADING', payload: false });

                //console.log(response.data.message)
                displaySnackbar(response.data.message);

                return response;
            },
            (error) => {
                dispatch({ type: 'SET_LOADING', payload: false });
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
                duration: 2000,
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
