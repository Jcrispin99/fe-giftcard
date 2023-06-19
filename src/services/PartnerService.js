import AppService from './AppService';

class PartnerService extends AppService {
  constructor() {
    super();
    this.path = this.getPath('api/partners');
  }
  create(data) {
    return this.http.post(`${this.path}`, data);
  }
  listSearch(search = '') {
    return this.http.get(`${this.path}?${search}`);
  }
  update(data, id) {
    return this.http.put(`${this.path}/${id}`, data);
  }
  recover(id, data={}) {
    return this.http.put(`${this.path}/recover/${id}`, data);
  }
}

export default PartnerService;
