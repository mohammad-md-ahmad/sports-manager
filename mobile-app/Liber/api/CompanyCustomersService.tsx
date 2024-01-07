import { getCompanyData } from '../helpers/companyDataManage';
import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class CompanyCustomersService extends AxiosService {
    private userDataPromise: Promise<any>;
    private companyDataPromise: Promise<any>;
    constructor() {
        super();
        this.userDataPromise = this.initializePromise(getUserData);
        this.companyDataPromise = this.initializePromise(getCompanyData);
    }

    async getUsers() {
        const companyData = await this.companyDataPromise;
        return this.get(`/companies/${companyData.uuid}/customers`);
    }


    async toggleAutoApprove(data: Object) {
        return this.put(`/company-customers/${data?.uuid}/toggle-auto-approve`);
    }
}

export default CompanyCustomersService;
