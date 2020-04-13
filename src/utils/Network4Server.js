// Imports
import store from '../store';
import {timerPromise} from './Utils';

const baseUrl = store.state.settings.server.ip + "/api/";

export async function getData(limit,offset) {
  var url = new URL(baseUrl + "data");

  if(limit != "" && offset != ""){
    params = {limit:limit, offset:offset};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  return Promise.race([timerPromise(), fetch(url, {
        method: "get",
        headers: {
          'Authorization': 'Bearer ' + store.state.user.token,
        },
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}

export async function getDataFiltered(startDate,endDate) {
  var url = new URL(baseUrl + "data/findByDate");

  if(startDate != "" && endDate != ""){
    params = {startDate:startDate, endDate:endDate};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  return Promise.race([timerPromise(), fetch(url, {
        method: "get",
        headers: {
          'Authorization': 'Bearer ' + store.state.user.token,
        },
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}

export async function sendData(arduinoString) {
  const url = baseUrl + "data";
  return Promise.race([timerPromise(), fetch(url, {
        method: "post",
        headers: {
          'Authorization': 'Bearer ' + store.state.user.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data:arduinoString}),
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}

export async function login(authReq) {
  const url = baseUrl + "user/login";
  return Promise.race([timerPromise(), fetch(url, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authReq),
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}

export async function logout(authReq) {
  const url = baseUrl + "user/logout";
  return Promise.race([timerPromise(), fetch(url, {
        method: "post",
        headers: {
          'Authorization': 'Bearer ' + store.state.user.token,
        },
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}

export async function register(user) {
  const url = baseUrl + "user/register";
  return Promise.race([timerPromise(), fetch(url, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}

export async function getUser() {
  const url = baseUrl + "user/me";
  return Promise.race([timerPromise(), fetch(url, {
        method: "get",
        headers: {
          'Authorization': 'Bearer ' + store.state.user.token,
          'Content-Type': 'application/json',
        },
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}

export async function putUser(user) {
  const url = baseUrl + "user/me";
  return Promise.race([timerPromise(), fetch(url, {
        method: "put",
        headers: {
          'Authorization': 'Bearer ' + store.state.user.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}

export async function deleteAccount(authReq) {
  const url = baseUrl + "user/me";
  return Promise.race([timerPromise(), fetch(url, {
        method: "delete",
        headers: {
          'Authorization': 'Bearer ' + store.state.user.token,
        },
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}
