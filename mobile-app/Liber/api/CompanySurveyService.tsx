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
    
    async userResponse(data: Object) {
        return this.post(`/surveys/${data.uuid}/user-response`, data);
    }

    async getSurvey(data: Object) {
        return this.get(`/surveys/${data.uuid}`);
    }

    async update(data: Object) {
        return this.put(`/surveys/${data.uuid}`, data);
    }

    async listByCompany() {
        const companyData = await this.companyDataPromise;
        return this.get(`/surveys/get-all/company/${companyData.uuid}`);
    }

    async sendSurveyToUsers(){
        const companyData = await this.companyDataPromise;
        return this.post(`/companies/${companyData.uuid}/surveys/send`, {});
    }
}

export default CompanySurveyService;
