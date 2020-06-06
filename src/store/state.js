// Date Generator
var initialDate = new Date();
var dayBefore = new Date(initialDate.getTime());
dayBefore.setDate(initialDate.getDate() - 1);

import { dateObjectCreator } from '../utils/Utils';

// Default state object
export function getDefaultState() {
  return {
    arduino: {
      trackVisualization: false,
    },
    filter: {
      maps: {
        pinnedMeasure: "Temperature",
        startDate: dateObjectCreator(dayBefore),
        endDate: dateObjectCreator(initialDate),
        arpaEnabled : true,
        pinnedStation: 47,
      },
      charts: {
        pinnedMeasure: "Temperature",
        startDate: dateObjectCreator(dayBefore),
        endDate: dateObjectCreator(initialDate),
        arpaEnabled : true,
        pinnedStation: 47,
      }
    },
    settings: {
      wifi: {
        ip: 'http://192.168.1.173',
        port: '3000'
      },
      server:{
        ip: 'https://polimi-dima-server.herokuapp.com',
        port: ''
      },
      rtk: {
        ip: 'http://158.102.7.10',
        port: '2101'
      },
      arpa: {
        weather: {
          stationsUrl: 'https://www.dati.lombardia.it/resource/nf78-nj6b.geojson',
          pinnedStations: [28,43,44,47],
          dataUrl: 'https://www.dati.lombardia.it/resource/647i-nhxk.json',
        },
        air: {
          stationsUrl: 'https://www.dati.lombardia.it/resource/ib47-atvt.geojson',
          pinnedStations: [114,127],
          dataUrl: 'https://www.dati.lombardia.it/resource/nicp-bhqi.json'
        },
      },
    },
    user: {
      token: '',
      email: 'admin@dimaproject.it',
      password: 'passwordSegret@130',
      firstName: '',
      lastName: '',
      gender: '',
      birthDay: ''
    },
    blob : {
      arduinoData: [],
      arpa_weatherStations: null,
      arpa_airStations: null,
      arduinoGetterRoutine: null,
    }
  };
};
