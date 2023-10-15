import AxiosService from './AxiosService';

class CompanyService extends AxiosService {

    async create(data: Object) {
        return this.post('/companies',data);
    }
}

export default CompanyService;
