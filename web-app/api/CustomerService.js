import AxiosService from './AxiosService';

class CustomerService extends AxiosService {
    constructor() {
        super();
    }

    async list(data) {
        return this.get(`/users?${this.objectToQueryParams(data)}`);
    }

    async getCustomer(uuid) {
        return this.get(`/users/${uuid}`);
    }

    async create(data) {
        return this.post('/users', data);
    }

    async update(data) {
        return this.put('/users/' + data.uuid, data);
    }

    async deleteCustomer(data) {
        return this.delete('/users/' + data.uuid);
    }
}

export default CustomerService;
