import axios from 'axios';
import Constants from 'helpers/constants';
import { useReducer } from 'react';
import toast from 'react-hot-toast';
import { HANDLERS, initialState, reducer } from 'src/contexts/auth-context';
import { useAuth } from 'src/hooks/use-auth';

class AxiosService {
    constructor() {
        let baseURL = Constants.apiUrl;
        this.instance = axios.create({
            baseURL,
            timeout: 10000, // 10 secs
            timeoutErrorMessage: 'API connection timeout',
        });

        this.setupInterceptors();
    }

    async initializePromise(dataGetter) {
        const data = await dataGetter();
        return data === null ? null : JSON.parse(data);
    }

    objectToQueryParams(obj) {
        const queryParams = [];

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
            }
        }

        return queryParams.join('&');
    }

    setupInterceptors() {
        const auth = useAuth();
        this.instance.interceptors.request.use(
            async (config) => {
                if (auth.setLoading)
                    auth.setLoading(true);
                const token = window.sessionStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                console.log('Request url:', config.url);
                console.log('Request Body Data:', config.data);
                console.log('Request Body Params:', config.params);

                return config;
            },
            (error) => {
                if (auth.setLoading)
                    auth.setLoading(false);
                if (axios.isCancel(error)) {
                    return Promise.reject(error);
                } else if (error.code === 'ECONNABORTED') {
                    console.error('Request timeout', error.message);
                    return Promise.reject(error);
                } else {
                    console.log('Error', error);

                    console.error('Request failed', error);
                    return Promise.reject(error);
                }
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                if (auth.setLoading)
                    auth.setLoading(false);
                const originalRequest = response.config;
                if (originalRequest.method !== 'get') {
                    toast.success(response.data.message);
                }

                return response;
            },
            (error) => {
                if (auth.setLoading)
                    auth.setLoading(false);
                if (axios.isCancel(error)) {
                    return Promise.reject(error);
                } else if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
                    console.error('Request timeout', error.message);
                    toast.error('A connection to server couldn\'t be made. Please make you have internet access.');
                    return Promise.reject(error);
                } else {
                    toast.error(error?.response?.data?.message);
                    console.error('Request failed', error);
                    return Promise.reject(error);
                }
            }
        );
    }

    async get(url, config) {
        return this.instance.get(url, config);
    }

    async post(url, data, config) {
        return this.instance.post(url, data, config);
    }

    async put(url, data, config) {
        return this.instance.put(url, data, config);
    }

    async delete(url, config) {
        return this.instance.delete(url, config);
    }
}

export default AxiosService;
