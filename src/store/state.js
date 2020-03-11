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
        pinnedMeasures: ["Temperature"],
        startDate: dateObjectCreator(yesterday),
        endDate: dateObjectCreator(today),
        arpaEnabled : true,
      },
      charts: {
        pinnedMeasures: ["Temperature"],
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
      rtk: {
        ip: 'http://158.102.7.10',
        port: '2101'
      },
      arpa: {
        weather: {
          stationsUrl: '',
          pinnedStations: [],
          dataUrl: '',
        },
        air: {
          stationsUrl: 'http://dati.comune.milano.it/dataset/d6960c75-0a02-4fda-a85f-3b1c4aa725d6/resource/635c6508-b335-48b1-b3c8-d43e78ad3380/download/qaria_stazione.geojson',
          pinnedStations: [2,5],
          dataUrl: 'http://dati.comune.milano.it/dataset/ccf8b61d-728f-46e7-bee9-e685c7b6cd35/resource/dc58ac23-0bc4-4952-95b0-164081b3e785/download/qaria_datoariagiornostazione_2020-03-10.json'
        },
      },
    },
    blob : {

    }
  };
};
