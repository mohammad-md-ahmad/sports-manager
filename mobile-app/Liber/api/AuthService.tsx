import AxiosService from './AxiosService';

class AuthService extends AxiosService {

    async login(username: string, password: string) {
        return this.post('/login', { username, password });
    }

    async logout() {
        return this.post('/logout');
    }
}

export default AuthService;
