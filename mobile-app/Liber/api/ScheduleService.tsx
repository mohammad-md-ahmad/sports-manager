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

    async updateScheduleDetails(data: Object) {
        return this.put(`/schedules/${data.schedule_details_uuid}`, data);
    }

    async deleteScheduleDetails(schedule_details_uuid: string) {
        return this.delete(`/schedules/${schedule_details_uuid}`);
    }

    async getCompanySchedule(data: Object) {
        if (!data['company_uuid']) {
            const companyData = await this.companyDataPromise;
            data['company_uuid'] = companyData.uuid;
        }
        return this.get(`/schedules/company-schedule?${this.objectToQueryParams(data)}`);
    }

    async getFacilitySchedule(data: Object) {
        return this.get(`/schedules/facility-schedule?${this.objectToQueryParams(data)}`);
    }

    async getSchedule(data: Object) {
        return this.get(`/schedules/schedule?${this.objectToQueryParams(data)}`);
    }
}

export default ScheduleService;
