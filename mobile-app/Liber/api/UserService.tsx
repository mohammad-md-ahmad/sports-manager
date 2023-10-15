import AxiosService from './AxiosService';

class UserService extends AxiosService {

    async create(data: Object) {
        return this.post('/users',data);
    }
}

export default UserService;
