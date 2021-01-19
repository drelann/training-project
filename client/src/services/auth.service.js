import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://127.0.0.1:3333/';

class AuthService {
  register(user) {
    console.log(user);
    return axios.post(API_URL + 'register', {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      country: user.country,
      password: user.password,
      userpic: user.userpic,
    });
  }

  login(user) {
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  getUserData() {
    return axios
      .get(API_URL + 'account/me', {
        headers: authHeader(),
      })
      .then((response) => {
        if (response.data) {
          return response.data.data;
        }
      });
  }
  updateUserInfo(user) {
    return axios
      .put(
        API_URL + 'account/update_profile',
        { data: user },
        {
          headers: authHeader(),
        },
      )
      .then((response) => {
        if (response) {
          return response;
        }
      });
  }
  logout() {
    localStorage.removeItem('user');
  }
  checkHash(hash) {
    return axios
      .post(
        API_URL + 'account/verify_hash',
        { data: hash },
        {
          headers: authHeader(),
        },
      )
      .then((response) => {
        if (response.data) {
          return response.data.data;
        }
      });
  }
  checkPin(pin) {
    return axios
      .post(
        API_URL + 'account/verify_pin',
        { data: pin },
        {
          headers: authHeader(),
        },
      )
      .then((response) => {
        if (response.data) {
          return response.data.data;
        }
      });
  }
  deleteImage() {
    return axios
      .get(API_URL + 'account/delete_image', {
        headers: authHeader(),
      })
      .then((response) => {
        if ((response.statusText = 'OK')) {
          return response;
        }
      });
  }
  uploadImage(image) {
    return axios
      .post(
        API_URL + 'account/upload_image',
        { data: image },
        { headers: authHeader() },
      )
      .then((response) => {
        if ((response.statusText = 'OK')) {
          return response;
        }
      });
  }

  deletePin() {
    return axios
      .get(API_URL + 'account/delete_pin', {
        headers: authHeader(),
      })
      .then((response) => {
        if ((response.statusText = 'OK')) {
          return response;
        }
      });
  }
}

export default new AuthService();
