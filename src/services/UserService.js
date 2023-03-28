import AppService from './AppService';

class UserService extends AppService {

    constructor() {
        super();
        this.path = this.getPath('users');
    }
    create(data) {
        return this.http.post(`${this.path}`, data);
    }
    read(id) {
        return this.http.get(`${this.path}/${id}`);
    }
    update(data, id) {
        return this.http.patch(`${this.path}/${id}`, data);
    }
    delete(id) {
        return this.http.delete(`${this.path}/${id}`);
    }
    list() {
        return this.http.get(`${this.path}`);
    }
    listSearch(search) {
        return this.http.get(`${this.path}?${search}`);
    }
    me() {
        return this.http.get(`${this.path}/me`);
    }
}

export default UserService;
