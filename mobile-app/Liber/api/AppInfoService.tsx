import AxiosService from './AxiosService';

class AppInfoService extends AxiosService {
    constructor() {
        super();
    }

    async getInfo(data: Object) {
        return this.get(`/app-info?${this.objectToQueryParams(data)}`);
    }

    async getAllInfo() {
        return this.get(`/app-info/get-all`);
    }

}

export default AppInfoService;
