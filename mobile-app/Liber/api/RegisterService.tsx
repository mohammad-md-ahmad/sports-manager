import AxiosService from './AxiosService';

class RegisterService extends AxiosService {

    async createCompany(data: Object) {
        return this.post('/register/company', data);
    }

    async createUser(data: Object) {
        return this.post('/register/user', data);
    }

}

export default RegisterService;
