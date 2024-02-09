import AxiosService from './AxiosService';

class SportService extends AxiosService {
    constructor() {
        super();
    }

    async list(data) {
        return this.get(`/sports/all`);
    }

    async getSport(uuid) {
        return this.get(`/sports/${uuid}`);
    }

    async create(data) {
        return this.post('/sports', data);
    }

    async update(data) {
        return this.put('/sports/' + data.uuid, data);
    }


    async deleteSport(data) {
        return this.delete('/sports/' + data.uuid);
    }

}

export default SportService;
