import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class ScheduleService extends AxiosService {
    constructor() {
        super();
    }

    async create(data: Object) {
        return this.post('/schedules/' + data.facility_uuid, data);
    }

}

export default ScheduleService;
