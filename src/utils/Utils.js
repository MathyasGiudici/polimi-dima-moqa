const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function dateObjectCreator(date){
  var obj = {
    date: date,
  }
  var string = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
  obj.string = string
  return obj;
};
