import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3333/';

class MiscService {
  getAll() {
    return axios
      .get(API_URL + 'countires/get_all_countries')
      .then((response) => {
        if (response.data) {
        }
        return response;
      });
  }
}

export default new MiscService();
