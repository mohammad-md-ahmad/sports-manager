
import AxiosService from './AxiosService';

class ReportsService extends AxiosService {
    constructor() {
        super();
    }

    async getReport(data) {
        return this.get(`/reports`, {
            params: data
        });
    }

}

export default ReportsService;
