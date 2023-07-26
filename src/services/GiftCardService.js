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
  getTicketsCheck(search = '') {
    return this.http.get(`${this.path}/tickets-check?${search}`);
  }
  getReportGiftcard(search = '') {
    return this.http.get(`${this.path}/report?${search}`);
  }
  approveGiftcardMatch(data) {
    return this.http.post(`${this.path}/approve-giftcard-match`, data);
  }
  approveTicketMatch(data) {
    return this.http.post(`${this.path}/approve-ticket-match`, data);
  }
  approveTicketCheck(data) {
    return this.http.post(`${this.path}/approve-ticket-check`, data);
  }
  approveQR(data) {
    return this.http.post(`${this.path}/approve-qr`, data);
  }
  verifyQr(data) {
    return this.http.post(`${this.path}/verify-qr`, data);
  }
  deleteQr(data) {
    return this.http.post(`${this.path}/delete-qr`, data);
  }
  approveMatch(data) {
    return this.http.post(`${this.path}/approve-match`, data);
  }
  activeLost(data) {
    return this.http.post(`${this.path}/active-lost`, data);
  }
  //customer

  reloadDataMyGiftcard(formData = {}) {
    return this.http.post(`${this.path}/reload-data-giftcard`, formData);
  }
  generateQr(formData = {}) {
    return this.http.post(`${this.path}/create-ticket`, formData)
  }
}

export default GiftCardService;
