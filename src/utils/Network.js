import {timerPromise} from './Utils';

// Creation of the url:port
const createAddress = (url,port) => {
  if (port != '')
    return url + ":" + port;
  else
    return url;
}

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
