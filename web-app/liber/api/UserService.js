
import AxiosService from './AxiosService';

class UserService extends AxiosService {
    constructor() {
        super();
    }

    async getUser(user = null) {
        return this.get(`/users/${user ? user.uuid : null}`);
    }

    async create(data) {
        return this.post('/users', data);
    }

    async update(data) {
        return this.put('/users/' + data.uuid, data);
    }
}

export default UserService;
