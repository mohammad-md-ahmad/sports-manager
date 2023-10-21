import { getUserData } from '../helpers/userDataManage';
import AxiosService from './AxiosService';

class UserService extends AxiosService {
    private userDataPromise: Promise<any>;
    constructor() {
        super();
        this.userDataPromise = this.initializePromise(getUserData);
    }

    async getUser() {
        const userData = await this.userDataPromise;
        console.log('userData.uuid', userData.uuid)
        return this.get(`/users/${userData.uuid}`);
    }

    async create(data: Object) {
        return this.post('/users', data);
    }

    async update(data: Object) {
        return this.put('/users/' + data.uuid, data);
    }
}

export default UserService;
