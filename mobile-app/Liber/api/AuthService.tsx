import Constants from '../helpers/constants';
import AxiosService from './AxiosService';

class AuthService extends AxiosService {

    constructor() {
        super(Constants.apiUrl);
    }

    async login(username: string, password: string) {
        return this.post('/login', { username, password });
    }

}

export default AuthService;

