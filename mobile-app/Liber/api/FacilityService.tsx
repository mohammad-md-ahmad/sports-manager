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

    async getFacility(uuid: string) {
        const companyData = await this.companyDataPromise;
        return this.get(`/companies/${companyData.uuid}/facilities/${uuid}`);
    }

    async create(data: Object) {
        const companyData = await this.companyDataPromise;
        return this.post(`/companies/${companyData.uuid}/facilities`, data);
    }

    async update(data: Object) {
        const companyData = await this.companyDataPromise;
        return this.put(`/companies/${companyData.uuid}/facilities/${data?.uuid}`, data);
    }

    async list(data: Object) {
        return this.get(`/facilities?${this.objectToQueryParams(data)}`);
    }

    async listByCompany() {
        const companyData = await this.companyDataPromise;
        return this.get(`/companies/${companyData.uuid}/facilities`);
    }
}

export default FacilityService;
