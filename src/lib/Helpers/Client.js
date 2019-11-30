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
    readByCode: (code, success, errors) => {
      axios
        .get(this.auth + "/user/readByCode/" + code)
        .then(result => success(result))
        .catch(error => errors(error.response))
    },
    readAll: (params, success, errors) => {
      axios
        .post(this.auth + "/user/readAll", params)
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

  Event = {
    create: (jwt, params, success, errors) => {
      axios
        .post(
          this.api + "/event/create",
          params,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    read: (jwt, id, success, errors) => {
      axios
        .get(
          this.api + "/event/read/" + id,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result))
        .catch(error => errors(error.response))
    },
    delete: (jwt, id, success, errors) => {
      axios
        .delete(
          this.api + "/event/delete/" + id,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    update: (jwt, id, params, success, errors) => {
      axios
        .post(
          this.api + "/event/update/" + id,
          params,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    // POST parce que XHR sur lequel axios se base ne permet pas d'envoyer des données
    // dans le corps d'une requête GET
    readAll: (jwt, params, success, errors) => {
      axios
        .post(
          this.api + "/event/readAll",
          params,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result.data))
        .catch(error => errors(error.response))
    }
  };

  Code = {
    create: (jwt, params, success, errors) => {
      axios
        .post(
          this.api + "/code/create",
          params,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result))
        .catch(error => errors(error.response));
    }
  };

  Ticket = {
    create: (jwt, params, success, errors) => {
      axios
        .post(
          this.api + "/ticket/create",
          params,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    read: (jwt, id, success, errors) => {
      axios
        .get(
          this.api + "/ticket/read/" + id,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result))
        .catch(error => errors(error.response))
    },
    readAll: (jwt, params, success, errors) => {
      axios
        .post(
          this.api + "/ticket/readAll",
          params,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result))
        .catch(error => errors(error.response));
    },
    validation: (jwt, id, success, errors) => {
      axios
        .get(
          this.api + "/ticket/validation/" + id,
          {headers: {"Authorization": `Bearer ${jwt}`} })
        .then(result => success(result))
        .catch(error => errors(error.response));
    }
  }
}

export default Client;