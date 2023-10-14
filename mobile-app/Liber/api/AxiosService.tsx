import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import Constants from '../helpers/constants';
import { useLoading } from '../LoadingContext';

abstract class AxiosService {
  private instance: AxiosInstance;

  constructor() {
    let baseURL = Constants.apiUrl;
    this.instance = axios.create({
      baseURL,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    const { setGlobalLoading } = useLoading();
    this.instance.interceptors.request.use(
      (config) => {
        // You can modify the request config here (e.g., add headers)
        setGlobalLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        // You can handle successful responses here
        setGlobalLoading(false);
        return response;
      },
      (error) => {
        // You can handle errors here (e.g., token refresh, logging, etc.)
        return Promise.reject(error);
      }
    );
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