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

    async listByCompany(companyUuid) {
        return this.get(`/companies/${companyUuid}/facilities`);
    }

    async update(data) {
        return this.put(`/companies/${data.companyUuid}/facilities/${data.uuid}`, data);
    }

}

export default FacilityService;
