import AppService from './AppService';

class GiftCardService extends AppService {
  constructor() {
    super();
    this.path = this.getPath('api/giftcards');
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
  mygiftcards(search = '') {
    return this.http.get(`${this.path}/mygiftcards?${search}`);
  }
  sendUrlToMessage(data) {
    return this.http.post(`${this.path}/send-url-to-message`, data);
  }
  mytickets(search = '') {
    return this.http.get(`${this.path}/mytickets?${search}`);
  }
  createTicketEmployee(data) {
    return this.http.post(`${this.path}/create-ticket-employee`, data);
  }
  getTickets(search = '') {
    return this.http.get(`${this.path}/tickets?${search}`);
  }
  getReportGiftcard(search = '') {
    return this.http.get(`${this.path}/report?${search}`);
  }
  approveGiftcardCompliant(data) {
    return this.http.post(`${this.path}/approve-giftcard-compliant`, data);
  }
  approveQR(data) {
    return this.http.post(`${this.path}/approve-qr`, data);
  }
  verifyQr(data) {
    return this.http.post(`${this.path}/verify-qr`, data);
  }
}

export default GiftCardService;
