// Date Generator
var today = new Date();
var yesterday = new Date(); // Today!
yesterday.setDate(today.getDate() - 1); // Yesterday!

import { dateObjectCreator } from '../utils/Utils';

// Default state object
export function getDefaultState() {
  return {
    filter: {
      maps: {
        pinnedMeasure: "Temperature",
        startDate: dateObjectCreator(yesterday),
        endDate: dateObjectCreator(today),
        arpaEnabled : true,
      },
      charts: {
        pinnedMeasure: "Temperature",
        startDate: dateObjectCreator(yesterday),
        endDate: dateObjectCreator(today),
        arpaEnabled : true,
      }
    },
    settings: {
      wifi: {
        ip: 'http://192.168.1.173',
        port: '3000'
      },
      server:{
        ip: '',
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
    blob : {
      arduinoData: null,
      arpa_weatherStations: null,
      arpa_weatherData: null,
      arpa_airStations: null,
      arpa_airData: null,
    }
  };
};
