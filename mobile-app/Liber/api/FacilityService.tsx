import { getCompanyData } from '../helpers/companyDataManage';
import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class FacilityService extends AxiosService {
    private companyDataPromise: Promise<any>;
    private userDataPromise: Promise<any>;

    constructor() {
        super();
        this.companyDataPromise = this.initializePromise(getCompanyData);
        this.userDataPromise = this.initializePromise(getUserData);
    }

    async create(data: Object) {
        const companyData = await this.companyDataPromise;
        console.log('companyData', companyData);
        return this.post(`/companies/${companyData.uuid}/facilities`, data);
    }

    async list() {
        return this.get(`/facilities`);
    }

    async listByCompany() {
        const companyData = await this.companyDataPromise;
        return this.get(`/companies/${companyData.uuid}/facilities`);
    }
}

export default FacilityService;
