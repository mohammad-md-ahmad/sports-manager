import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class FacilityService extends AxiosService {
    userData = getUserData().then((data: string | null) => {
        return data === null ? null : JSON.parse(data);
    });

    async create(data: Object) {
        return this.post(`/companies/${this.userData.uuid}/facilities`, data);
    }
}

export default FacilityService;
