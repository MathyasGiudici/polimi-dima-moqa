import store from '../store';

// Timer for the Promise.race
const timerPromise = () => {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 5000, 'End Race');});
};

const baseUrl = store.state.settings.server.ip + "/api/";

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
        headers: new Headers({
          "Authorization": 'Bearer ' + store.state.user.token
        }),
        body: JSON.stringify(user),
      }).then((response) =>{
        return response.json();
    }).catch((error) => {
      return 'Connection problems';
    })
  ]);
}

// Function to apply a POST to the web
export function postHandler(url, port, contentType, body) {
  return Promise.race([timerPromise(), fetch(createAddress(url,port), {
    method: "post",
    headers: new Headers({
      "Content-Type": contentType
    }),
    body: body,
  }).then((response) => {
    switch (responseType) {
      case 'text':
        return response.text();
        break;
      case 'json':
        return response.json();
        break;
      default:
        return response.text();
    }
  }).catch((error) => {
    switch (responseType) {
      case 'text':
        return 'Connection problems';
        break;
      case 'json':
        return {message: 'Connection problems'};
        break;
      default:
        return 'Connection problems';
    }
  }) ]);
}
