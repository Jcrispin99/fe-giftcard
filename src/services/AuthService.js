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
}

export default AuthService;
