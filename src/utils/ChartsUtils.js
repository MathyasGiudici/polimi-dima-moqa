// Store
import store from '../store';
import {testDataSet} from './ChartsConstants';

export function getChartData(filter){
  var retObj = null;
  switch (filter.pinnedMeasure) {
    case 'Temperature':
      retObj = testDataSet;
      break;
    case 'Pressure':
      retObj = testDataSet;
      break;
    case 'Humidity':
      retObj = testDataSet;
      break;
    case 'PM10':
      retObj = testDataSet;
      break;
    default:
      retObj = testDataSet;
  }
  return retObj;
}

function getArpaWeatherData(filter){
  var filteredData = null;

}
