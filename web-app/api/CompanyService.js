import AxiosService from './AxiosService';

class CompanyService extends AxiosService {
    constructor() {
        super();
    }

    async list(data) {
        return this.get(`/companies?${this.objectToQueryParams(data)}`);
    }

    async getCompanyList(data) {
        return this.get(`/company-list/${null}?${this.objectToQueryParams(data)}`);
    }

    async postCompanyList(data) {
        return this.post(`/company-list/${null}`, data);
    }

    async getCompany() {
        return this.get(`/companies/${null}`);
    }

    async create(data) {
        return this.post('/companies', data);
    }

    async update(data) {
        return this.put('/companies/' + data.uuid, data);
    }
}

export default CompanyService;
