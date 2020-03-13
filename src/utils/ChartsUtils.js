// Store
import store from '../store';
import {testDataSet} from './ChartsConstants';
import {stationsFilter, dataFilter} from './DataUtils';

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

// Get PM10 data from ARPA dataset
export async function getArpaPM10Data(filter){
  var stations = null;
  var dataBlob = null;

  let generalPromise = new Promise(function(resolve,reject){
    resolve(stationsFilter(store.state.blob.arpa_airStations,
      store.state.settings.arpa.air.pinnedStations));
  })
  .then((result)=>{
    // Setting result
    stations = result;
    return new Promise(function(resolve,reject){
      resolve(dataFilter(store.state.settings.arpa.air.dataUrl, stations,
        store.state.filter.charts.startDate, store.state.filter.charts.endDate));
    });
  })
  .then((result)=>{
    // Setting data
    dataBlob = result;
  });

  await generalPromise;

  //Setting data for the graph
}
