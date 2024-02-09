import AxiosService from './AxiosService';

class AppListService extends AxiosService {
    constructor() {
        super();
    }

    async list(data) {
        return this.get(`/app-list/get-all`);
    }

}

export default AppListService;
