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

    async bookApprove(data: Object) {
        // return this.post(`/bookings/106e6969-12c1-4539-a07f-6588eb106cf0/approve`, {});
        return this.post(`/bookings/${data.uuid}/approve`, {});
    }

    async bookDecline(data: Object) {
        // return this.post(`/bookings/7d0792db-b87e-4518-a6b0-a3de98534d1e/decline`, {});
        return this.post(`/bookings/${data.uuid}/decline`, {});
    }

}

export default BookingService;
