import AppService from './AppService';

class CategorieService extends AppService {
  constructor() {
    super();
    this.path = this.getPath('api/categories');
  }
  create(data) {
    return this.http.post(`${this.path}`, data);
  }
  update(data, id) {
    return this.http.put(`${this.path}/${id}`, data);
  }
  listSearch(search = '') {
    return this.http.get(`${this.path}?${search}`);
  }
}

export default CategorieService;
