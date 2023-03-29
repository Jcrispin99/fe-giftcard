import AppService from './AppService';

class AuthService extends AppService {
  login(formData) {
    return this.http.post('/auth/login', formData)
  }
  logout(formData = {}) {
    return this.http.post('/auth/logout', formData)
  }
  mycard(code) {
    return this.http.get(`/customer/${code}`);
  }
}

export default AuthService;
