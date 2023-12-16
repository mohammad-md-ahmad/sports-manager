import { getCompanyData } from '../helpers/companyDataManage';
import AxiosService from './AxiosService';

class CompanyService extends AxiosService {
    private companyDataPromise: Promise<any>;
    constructor() {
        super();
        this.companyDataPromise = this.initializePromise(getCompanyData);
    }

    async list() {
        return this.get(`/companies`);
    }


    async getCompany() {
        const companyData = await this.companyDataPromise;
        return this.get(`/companies/${companyData.uuid}`);
    }

    async create(data: Object) {
        return this.post('/companies', data);
    }

    async update(data: Object) {
        return this.put('/companies/' + data.uuid, data);
    }
}

export default CompanyService;
