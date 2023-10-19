import AxiosService from './AxiosService';

class MiscService extends AxiosService {

    async lists() {
        return this.get('/lists');
    }
}

export default MiscService;
