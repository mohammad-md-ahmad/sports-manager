import AxiosService from './AxiosService';

class AppInfoService extends AxiosService {
    constructor() {
        super();
    }

    async list(data) {
        return this.get(`/app-info/get-all`);
    }

    async save(data) {
        return this.post(`/app-info`, data);
    }

}

export default AppInfoService;
