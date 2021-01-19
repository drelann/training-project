import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3333/';

class AdminService {
  getAllUsers() {
    return axios.get(API_URL + 'admin/get_all_users').then((response) => {
      if (response) {
        return response.data;
      }
    });
  }
  getAllFreeUsers() {
    return axios.get(API_URL + 'admin/get_free_users').then((response) => {
      if (response) {
        return response.data;
      }
    });
  }
  editEvent(user) {
    return axios
      .put(
        `${API_URL}admin/edit_event/${user.id}`,
        { data: user.event_id },
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
  editRole(user) {
    return axios
      .put(
        `${API_URL}admin/edit_role/${user.id}`,
        { data: user.role },
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
}

export default new AdminService();
