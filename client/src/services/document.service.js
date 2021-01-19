import axios from 'axios';

const API_URL = 'http://localhost:3333/';

class DocumentService {
  getAllDocuments(id) {
    return axios
      .get(API_URL + 'documents/get_all_documents/' + id)
      .then((response) => {
        if (response) {
          return response.data;
        }
      });
  }
  saveDocument(document) {
    return axios
      .put(API_URL + 'documents/save_document/' + document.id, {
        data: document,
      })
      .then((response) => {
        if (response) {
          return response.data;
        }
      });
  }
  newDocument(document) {
    return axios
      .post(API_URL + 'documents/new_document/', {
        data: document,
      })
      .then((response) => {
        if (response) {
          return response.data;
        }
      });
  }
  deleteDocument(id) {
    return axios
      .put(API_URL + 'documents/delete_document/' + id)
      .then((response) => {
        if (response) {
          return response.data;
        }
      });
  }
}

export default new DocumentService();
