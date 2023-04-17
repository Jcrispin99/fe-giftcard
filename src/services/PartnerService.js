import AppService from './AppService';

class PartnerService extends AppService {
  constructor() {
    super();
    this.path = this.getPath('api/partners');
  }
  listSearch(search = '') {
    return this.http.get(`${this.path}?${search}`);
  }
}

export default PartnerService;
