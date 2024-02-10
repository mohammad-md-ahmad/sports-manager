import { getCompanyData } from '../helpers/companyDataManage';
import { UserType } from '../helpers/constants';
import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class NotificationService extends AxiosService {
    private userDataPromise: Promise<any>;
    private companyDataPromise: Promise<any>;

    constructor() {
        super();
        this.userDataPromise = this.initializePromise(getUserData);
        this.companyDataPromise = this.initializePromise(getCompanyData);
    }

    async getUserNotifications() {
        const userData = await this.userDataPromise;
        if (userData?.type == UserType.CustomerUser) {
            return this.get(`/notifications/reciever/${userData.uuid}/get-all?reciever-type=user`);
        }
        else {
            const companyData = await this.companyDataPromise;
            return this.get(`/notifications/reciever/${companyData.uuid}/get-all?reciever-type=company`);
        }
    }

}

export default NotificationService;
