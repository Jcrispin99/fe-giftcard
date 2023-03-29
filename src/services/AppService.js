import { environment } from '../environments';
import axios from 'axios';
import { isEmpty } from 'lodash';
import store from '../redux/store';

class AppService {

  constructor() {
    this.http = axios.create({
      baseURL: environment.apiMain,
    });  
    this.http.defaults.params = {};
  }  
  init(accessToken = '') {
    this.setAccessToken(accessToken);
  }  
  setAccessToken(accessToken) {
    if (!isEmpty(accessToken)) {
      this.http.defaults.headers.common['Authorization'] = 'bearer ' + accessToken;
    } else {
      delete this.http.defaults.headers.common['Authorization'];
    }
  }  
  getAccessToken() {
    const state = store.getState();
    const accessToken = state.user.accessToken;
    return this.init(accessToken);
  }
  reset() {
    delete this.http.defaults.headers.common['Authorization'];
    this.http.defaults.params = {};
  }  
  getOptions() {
    return this.http.defaults.headers;
  }  
  getPath(service) {
    return '/' + service;
  }  
  logout() {
    return this.http.post('/auth/logout');
  }
}

export default AppService;
