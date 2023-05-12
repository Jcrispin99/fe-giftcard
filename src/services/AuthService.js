import AppService from './AppService';

class AuthService extends AppService {
  login(formData) {
    return this.http.post('api/auth/login', formData)
  }
  logout(formData = {}) {
    return this.http.post('api/auth/logout', formData)
  }
  mycard(formData = {}) {
    return this.http.post('api/giftcards/getcode', formData)
  }
  loguinMyCard(formData = {}) {
    return this.http.post('api/giftcards/verify-code', formData)
  }
  generateQr(formData = {}) {
    return this.http.post('api/giftcards/create-ticket', formData)
  }
  reloadDataMyGiftcard(formData = {}) {
    return this.http.post('api/giftcards/reload-data-giftcard', formData)
  }
}

export default AuthService;
