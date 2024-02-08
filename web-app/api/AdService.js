import AxiosService from './AxiosService';

class AdService extends AxiosService {
    constructor() {
        super();
    }

    async list(data) {
        return this.get(`/advertisements/all`);
    }

    async getAd(uuid) {
        return this.get(`/advertisements/${uuid}`);
    }

    async create(data) {
        return this.post('/advertisements', data);
    }

    async update(data) {
        return this.put('/advertisements/' + data.uuid, data);
    }


    async deleteAd(data) {
        return this.delete('/advertisements/' + data.uuid);
    }

}

export default AdService;
