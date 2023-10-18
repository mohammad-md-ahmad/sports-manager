import AxiosService from './AxiosService';

class UserService extends AxiosService {

    async create(data: Object) {
        return this.post('/users', data);
    }

    async update(data: Object) {
        return this.put('/users/' + data.uuid, data);
    }
}

export default UserService;
