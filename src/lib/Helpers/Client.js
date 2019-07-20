import axios from "axios";

class Client {
  constructor(urlAuth, urlApi) {
    this.auth = urlAuth;
    this.api = urlApi;
  }

  User = {
    login: (login, password, success, errors) => {
      axios
        .post(this.auth + "/user/login", { login: login, password: password })
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    register: (params, success, errors) => {
      axios
        .post(this.auth + "/user/register", params)
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    read: (id, success, errors) => {
      axios
        .get(this.auth + "/user/read/" + id)
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    readAll: (params, success, errors) => {
      axios
        .get(this.auth + "/user/readAll", params)
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    update: (id, params, success, errors) => {
      axios
        .post(this.auth + "/user/update/" + id, params)
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    delete: (id, success, errors) => {
      axios
        .delete(this.auth + "/user/delete/" + id)
        .then(result => success(result))
        .catch(error => errors(error.response));
    }
  };
}

export default Client;