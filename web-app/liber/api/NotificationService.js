import AxiosService from './AxiosService';

class NotificationService extends AxiosService {
    constructor() {
        super();
    }

    async getUserNotifications() {
        return this.get(`/notifications/user/${null}/get-all`);
    }
}

export default NotificationService;
