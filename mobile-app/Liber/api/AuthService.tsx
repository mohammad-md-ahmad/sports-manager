import AxiosService from './AxiosService';

class AuthService extends AxiosService {

    async login(username: string, password: string) {
        return this.post('/login', { username, password });
    }

    async logout() {
        return this.post('/logout');
    }

    async sendResetPasswordLink(data: Object) {
        return this.post('/reset-password/send-link', data);
    }
}

export default AuthService;
