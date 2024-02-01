import AxiosService from './AxiosService';

class FacilityService extends AxiosService {
    constructor() {
        super();
    }

    async create(data) {
        return this.post(`/companies/${null}/facilities`, data);
    }

    async list(data) {
        return this.get(`/facilities?${this.objectToQueryParams(data)}`);
    }

    async listByCompany() {
        return this.get(`/companies/${null}/facilities`);
    }
}

export default FacilityService;
