import AxiosService from './AxiosService';

class AppInfoService extends AxiosService {

    async getInfo(data: Object) {
        return this.get(`/app-info?${this.objectToQueryParams(data)}`);
    }
    
}

export default AppInfoService;
