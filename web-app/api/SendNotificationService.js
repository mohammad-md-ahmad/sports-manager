import AxiosService from './AxiosService';

class SendNotificationService extends AxiosService {
    constructor() {
        super();
    }

    async send(data) {
        return this.post(`/push-notifications/send`, data);
    }

}

export default SendNotificationService;
