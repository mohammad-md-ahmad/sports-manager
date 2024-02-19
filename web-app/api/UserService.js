
import AxiosService from './AxiosService';

class UserService extends AxiosService {
    constructor() {
        super();
    }

    async list(data) {
        return this.get(`/users?${this.objectToQueryParams(data)}`);
    }

    async getUser(uuid) {
        return this.get(`/users/${uuid}`);
    }

    async create(data) {
        return this.post('/users', data);
    }

    async update(data) {
        return this.put('/users/' + data.uuid, data);
    }

    async deleteUser(data) {
        return this.delete('/users/' + data.uuid);
    }
}

export default UserService;
