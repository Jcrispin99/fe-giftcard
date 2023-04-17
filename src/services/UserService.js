import AppService from './AppService';

class UserService extends AppService {
  constructor() {
    super();
    this.path = this.getPath('api/users');
  }
  create(data) {
    return this.http.post(`${this.path}`, data);
  }
  update(data, id) {
    return this.http.put(`${this.path}/${id}`, data);
  }
  delete(id) {
    return this.http.delete(`${this.path}/${id}`);
  }
  listSearch(search='') {
    return this.http.get(`${this.path}?${search}`);
  }
  listCustomers(search='') {
    return this.http.get(`${this.path}/customers`);
  }
  me() {
    return this.http.get(`${this.path}/me`);
  }
}

export default UserService;
