import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class NotificationService extends AxiosService {
    private userDataPromise: Promise<any>;

    constructor() {
        super();
        this.userDataPromise = this.initializePromise(getUserData);
    }

    async getUserNotifications() {
        const userData = await this.userDataPromise;
        return this.get(`/notifications/user/${userData.uuid}/get-all`);
    }

}

export default NotificationService;
