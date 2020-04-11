// Date Generator
var testDate = new Date('2020-03-11T00:00:00');
var dayBefore = new Date('2020-03-10T00:00:00'); // Today!

import { dateObjectCreator } from '../utils/Utils';

// Default state object
export function getDefaultState() {
  return {
    filter: {
      maps: {
        pinnedMeasure: "PM10",
        startDate: dateObjectCreator(dayBefore),
        endDate: dateObjectCreator(testDate),
        arpaEnabled : true,
        pinnedStation: 114,
      },
      charts: {
        pinnedMeasure: "PM10",
        startDate: dateObjectCreator(dayBefore),
        endDate: dateObjectCreator(testDate),
        arpaEnabled : true,
        pinnedStation: 114,
      }
    },
    settings: {
      wifi: {
        ip: 'http://127.0.0.1',
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
          dataUrl: 'https://www.dati.lombardia.it/resource/nf78-nj6b.json',
        },
        air: {
          stationsUrl: 'https://www.dati.lombardia.it/resource/ib47-atvt.geojson',
          pinnedStations: [114,127],
          dataUrl: 'https://www.dati.lombardia.it/resource/nicp-bhqi.json'
        },
      },
    },
    user: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wiZW1haWxcIjpcImFkbWluQGRpbWFwcm9qZWN0Lml0XCIsXCJmaXJzdE5hbWVcIjpcIkFkbWluXCIsXCJsYXN0TmFtZVwiOlwiRGltYSBQcm9qZWN0XCIsXCJnZW5kZXJcIjpcImZlbWFsZVwiLFwiYmlydGhEYXlcIjpcIjE5OTAtMDctMjFUMDA6MDA6MDAuMDAwWlwifSIsImlhdCI6MTU4NjUzODQ1OCwiZXhwIjoxNTg2NzExMjU4fQ.AvkKvx1gUov0onk0FmXpRsyIwl7EQxbN5xxVdPEczbk',
      email: '',
      firstName: '',
      lastName: '',
      gender: '',
      birthDay: ''
    },
    blob : {
      arduinoData: null,
      arpa_weatherStations: null,
      arpa_airStations: null,
    }
  };
};
