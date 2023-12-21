import { getCompanyData } from '../helpers/companyDataManage';
import { EntityType } from '../helpers/constants';
import AxiosService from './AxiosService';

class RatingService extends AxiosService {
    private companyDataPromise: Promise<any>;

    constructor() {
        super();
        this.companyDataPromise = this.initializePromise(getCompanyData);
    }

    async list(entityUuid: string, entityType: string) {
        return this.get(`/ratings`, {
            rating_entity_uuid: entityUuid,
            rating_entity_type: entityType,
        });
    }

    async companyRatingList(params) {
        const companyData = await this.companyDataPromise;

        return this.get(`/ratings/entity-ratings`, {
            params: {
                rated_entity_uuid: params.uuid ? params.uuid : companyData?.uuid,
                rated_entity_type: EntityType.Company,
            }
        });
    }

    async create(data: Object) {
        return this.post('/ratings', data);
    }
}

export default RatingService;
