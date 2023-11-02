import AxiosService from './AxiosService';

class ScheduleService extends AxiosService {
    constructor() {
        super();
    }

    async create(data: Object) {
        return this.post(`/facilities/${data.facility_uuid}/schedules`, data);
    }

    async createBatch(data: Object) {
        return this.post(`/facilities/${data.facility_uuid}/schedules/batch`, data);
    }
}

export default ScheduleService;
