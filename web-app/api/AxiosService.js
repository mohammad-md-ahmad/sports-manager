import axios from 'axios';
import Constants from 'helpers/constants';

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
        this.instance.interceptors.request.use(
            async (config) => {
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
                const originalRequest = response.config;
                if (originalRequest.method !== 'get') {
                    // ToastHelper.successToast(response.data.message);
                }

                return response;
            },
            (error) => {
                if (axios.isCancel(error)) {
                    return Promise.reject(error);
                } else if (error.code === 'ECONNABORTED') {
                    console.error('Request timeout', error.message);
                    return Promise.reject(error);
                } else {
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
