import AxiosService from './AxiosService';

class SubscriptionPlanService extends AxiosService {
    constructor() {
        super();
    }

    async list() {
        return this.get(`/subscription-plans`);
    }

    async getPlan(uuid) {
        return this.get(`/subscription-plans/${uuid}`);
    }

    async update(data) {
        return this.put(`/subscription-plans/${uuid}`, data);
    }
}

export default SubscriptionPlanService;
