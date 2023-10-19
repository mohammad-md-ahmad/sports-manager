import { getCompanyData } from '../helpers/companyDataManage';
import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class FacilityService extends AxiosService {
    userData = getUserData().then((data: string | null) => {
        return data === null ? null : JSON.parse(data);
    });  
    
    companyData = getCompanyData().then((data: string | null) => {
        return data === null ? null : JSON.parse(data);
    });

    async create(data: Object) {
        return this.post(`/companies/${this.userData.uuid}/facilities`, data);
    }

    async list() {
        return this.get(`/companies/${this.companyData.uuid}/facilities`);
    }
}

export default FacilityService;
