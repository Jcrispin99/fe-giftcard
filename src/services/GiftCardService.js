import AppService from './AppService';

class GiftCardService extends AppService {
  constructor() {
    super();
    this.path = this.getPath('giftcards');
  }
  create(data) {
    return this.http.post(`${this.path}`, data);
  }
  update(data, id) {
    return this.http.patch(`${this.path}/${id}`, data);
  }
  listSearch(search = '') {
    return this.http.get(`${this.path}?${search}`);
  }
}

export default GiftCardService;
