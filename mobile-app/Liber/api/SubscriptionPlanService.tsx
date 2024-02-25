import AxiosService from './AxiosService';

class SubscriptionPlanService extends AxiosService {

    constructor() {
        super();
    }

    async list() {
        return this.get(`/subscription-plans`);
    }

}

export default SubscriptionPlanService;
