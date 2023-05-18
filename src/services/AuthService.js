import AppService from './AppService';

class AuthService extends AppService {
  login(formData) {
    return this.http.post('api/auth/login', formData)
  }
  loginCustomer(formData) {
    return this.http.post('api/auth/login-customer', formData)
  }
  logout(formData = {}) {
    return this.http.post('api/auth/logout', formData)
  }
  newPassword(formData) {
    return this.http.post('api/auth/new-password-customer', formData)
  }
}

export default AuthService;
