import AppService from './AppService';

class AuthService extends AppService {
  login(formData) {
    return this.http.post('api/auth/login', formData)
  }
  logout(formData = {}) {
    return this.http.post('api/auth/logout', formData)
  }
}

export default AuthService;
