import store from '../store';

// Timer for the Promise.race
const timerPromise = () => {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 5000, 'End Race');});
};

const baseUrl = store.state.settings.server.ip + "/api/";

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
