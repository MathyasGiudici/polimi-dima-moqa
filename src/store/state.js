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
    },
    blob : {
    }
  };
};
