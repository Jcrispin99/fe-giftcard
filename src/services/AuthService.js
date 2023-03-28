import AppService from './AppService';

class AuthService extends AppService {
  login(formData) {
    return this.http.post('/auth/login', formData)
  }
}

export default AuthService;
