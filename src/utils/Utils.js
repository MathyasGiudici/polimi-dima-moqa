// Months list
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function timerPromise(){
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 5000, 'End Race');});
};


// Function to create a specific object used in FilterParametersScreen.vue to manage the dates
function dateObjectCreator(date){
  var obj = {
    date: date,
  }
  var string = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() +
    " " + ("0" + date.getHours()).slice(-2)  + ":" + ("0" + date.getMinutes()).slice(-2);
  obj.string = string
  return obj;
};

function minimalDate(date){
  var d = date.date;
  var toRet = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() +
    " " + ("0" + d.getHours()).slice(-2)  + ":" + ("0" + d.getMinutes()).slice(-2) ;
  return toRet;
}

function dateToTimeStamp(date){
  var string = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2)
  + '-' + ("0" + date.getDate()).slice(-2) + 'T';
  // Fixing a given hour
  string += ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)
  + ":00Z";
  return string;
}

export {dateObjectCreator, minimalDate, dateToTimeStamp, timerPromise}
