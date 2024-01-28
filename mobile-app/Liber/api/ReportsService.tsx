import { getCompanyData } from '../helpers/companyDataManage';
import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class ReportsService extends AxiosService {
    private companyDataPromise: Promise<any>;
    constructor() {
        super();
        this.companyDataPromise = this.initializePromise(getCompanyData);
    }

    async getReport(key: any) {
        const companyData = await this.companyDataPromise;
        return this.get(`/reports/company/${companyData.uuid}?key=${key}`);
    }

}

export default ReportsService;
