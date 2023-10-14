import AxiosService from './AxiosService';

class AuthService extends AxiosService {

    async login(username: string, password: string) {
        return this.post('/login', { username, password });
    }

}

export default AuthService;

