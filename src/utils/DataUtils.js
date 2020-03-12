// From the response of the openAPI of Regione Lombardia returns the Stations
export function getMilanStations(responseObject){
  var features = responseObject.features;
  var returned = [];

  // taking Milan stations
  features.forEach((station, i) => {
    if(station.properties.provincia == 'MI') // && station.properties.nomestazione.includes('Milano'))
      returned.push(station);
  });

  // If are weather data: change tipologia -> nometiposensore
  returned.forEach((station, i) => {
    if(station.properties.tipologia)
      station.properties.nometiposensore = station.properties.tipologia;
      delete station.properties.tipologia;
  });

  // Sorting stations by name
  returned.sort(function(a, b){
    if(a.properties.nomestazione < b.properties.nomestazione) { return -1; }
    if(a.properties.nomestazione > b.properties.nomestazione) { return 1; }
    return 0;
  });

  return returned;
}
