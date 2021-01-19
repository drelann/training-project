import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3333/';

class EventService {
  getAllEvents() {
    return axios.get(API_URL + 'events/get_all_events').then((response) => {
      if (response) {
        return response.data;
      }
    });
  }
  getEvent(id) {
    return axios
      .get(API_URL + 'events/get_event/' + id, { params: { id: id } })
      .then((response) => {
        if (response) {
          return response.data;
        }
      });
  }
  saveEvent(event) {
    return axios
      .post(API_URL + 'events/save_event/', {
        data: event,
      })
      .then((response) => {
        if ((response.statusText = 'OK')) {
          return response;
        }
      });
  }
  deleteImage(id) {
    return axios
      .get(API_URL + 'events/delete_image/' + id, {
        headers: authHeader(),
      })
      .then((response) => {
        if ((response.statusText = 'OK')) {
          return response;
        }
      });
  }
  uploadImage(event) {
    return axios
      .post(API_URL + 'events/upload_image/' + event.id, {
        data: event.eventpic,
      })
      .then((response) => {
        if ((response.statusText = 'OK')) {
          return response;
        }
      });
  }
  updateEventInfo(event) {
    return axios
      .put(
        `${API_URL}events/update_event_info/${event.id}`,
        { data: event },
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

export default new EventService();
