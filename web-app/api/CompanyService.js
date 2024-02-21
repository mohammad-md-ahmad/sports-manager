import AxiosService from './AxiosService';

class CompanyService extends AxiosService {
    constructor() {
        super();
    }

    async list(data) {
        return this.get(`/companies?${this.objectToQueryParams(data)}`);
    }

    async getCompany(uuid) {
        return this.get(`/companies/${uuid}`);
    }

    async create(data) {
        return this.post('/companies', data);
    }

    async update(data) {
        return this.put('/companies/' + data.uuid, data);
    }

    async deleteCompany(data) {
        return this.delete('/companies/' + data.uuid);
    }
}

export default CompanyService;
