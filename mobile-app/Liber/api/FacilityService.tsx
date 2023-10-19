import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class FacilityService extends AxiosService {
    userData = getUserData().then((data: string | null) => {
        return data === null ? null : JSON.parse(data);
    }).then((data) => {
        return data;
    });

    async create(data: Object) {
        const userData = await this.userData;

        return this.post(`/companies/${userData.company.uuid}/facilities`, data);
    }
}

export default FacilityService;
