import AxiosService from './AxiosService';

class AdService extends AxiosService {
    constructor() {
        super();
    }

    async list() {
        return this.get(`/advertisements/all`);
    }

}

export default AdService;
