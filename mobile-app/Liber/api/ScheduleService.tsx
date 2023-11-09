import { getCompanyData } from '../helpers/companyDataManage';
import AxiosService from './AxiosService';

class ScheduleService extends AxiosService {
    private companyDataPromise: Promise<any>;
    constructor() {
        super();
        this.companyDataPromise = this.initializePromise(getCompanyData);
    }

    async create(data: Object) {
        return this.post(`/facilities/${data.facility_uuid}/schedules`, data);
    }

    async createBatch(data: Object) {
        return this.post(`/facilities/${data.facility_uuid}/schedules/batch`, data);
    }

    async bookRequest(data: Object) {
        return this.post(`/schedules/${data.uuid}/request-book`, data);
    }

    async getCompanySchedule(data: Object) {
        const companyData = await this.companyDataPromise;
        data['company_uuid'] = companyData.uuid;
        return this.get(`/schedules/company-schedule?${this.objectToQueryParams(data)}`);
    }

    async getFacilitySchedule(data: Object) {
        return this.get(`/schedules/facility-schedule`);
    }

}

export default ScheduleService;
