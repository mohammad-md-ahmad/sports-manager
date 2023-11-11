import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class BookingService extends AxiosService {
    private userDataPromise: Promise<any>;
    constructor() {
        super();
        this.userDataPromise = this.initializePromise(getUserData);
    }

    async bookRequest(data: Object) {
        const userData = await this.userDataPromise;
        data['user_uuid'] = userData.uuid;
        return this.post(`/bookings`, data);
    }

}

export default BookingService;
