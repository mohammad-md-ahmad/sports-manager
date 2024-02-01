import AxiosService from './AxiosService';

class CompanyCustomersService extends AxiosService {
    constructor() {
        super();

    }

    async getUsers() {
        return this.get(`/companies/${null}/customers`);
    }

    async toggleAutoApprove(data) {
        return this.put(`/company-customers/${data?.uuid}/toggle-auto-approve`);
    }
}

export default CompanyCustomersService;
