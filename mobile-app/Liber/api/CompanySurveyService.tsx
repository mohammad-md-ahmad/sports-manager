import { getCompanyData } from '../helpers/companyDataManage';
import AxiosService from './AxiosService';

class CompanySurveyService extends AxiosService {
    private companyDataPromise: Promise<any>;

    constructor() {
        super();
        this.companyDataPromise = this.initializePromise(getCompanyData);
    }

    async create(data: Object) {
        const companyData = await this.companyDataPromise;
        return this.post(`/companies/${companyData.uuid}/surveys`, data);
    }

    async listByCompany() {
        const companyData = await this.companyDataPromise;
        return this.get(`/surveys/get-all/company/${companyData.uuid}`);
    }
}

export default CompanySurveyService;
