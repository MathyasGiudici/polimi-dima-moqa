// Creation of the url:port
const createAddress = (url,port) => {
  if (port != '')
    return url + ":" + port;
  else
    return url;
}

// Timer for the Promise.race
const timerPromise = () => {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 5000, 'End Race');});
};

// Function to apply a GET from web
export async function getHandler(url, port, responseType) {
  return Promise.race([timerPromise(), fetch(createAddress(url,port)).then((response) =>{
    var toReturn;
    switch (responseType) {
      case 'text':
        toReturn = response.text();
        break;
      case 'json':
        toReturn = response.json();
        break;
      default:
        toReturn = response.text();
    }
    return toReturn;
  }).catch((error) => {
    var toReturn;
    switch (responseType) {
      case 'text':
        toReturn = 'Connection problems';
        break;
      case 'json':
        toReturn = 'Connection problems';
        break;
      default:
        toReturn = 'Connection problems';
    }
    return toReturn;
  }) ]);
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
