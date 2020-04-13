// Code with a toy example to try to exploit the behaviour of the function
// to manage the labels and dataset of the Chart section

var arduino = [0,1,3,5,6,7,9,10];
var arpa = [1,2,4,7,8,11,12];


function magic(a, b, a_values, b_values, labels){
  var a_ix = 0;
  var b_ix = 0;

  while(a_ix < a.length || b_ix < b.length ){
    if(a_ix < a.length && b_ix < b.length){
      if(a[a_ix] < b[b_ix]){

        labels.push(a[a_ix]);
        a_values.push(a[a_ix]);

        if( b_ix >= 1)
          b_values.push( (b[b_ix-1]+b[b_ix]) /2 );
        else
          b_values.push('-');

        a_ix ++;

      } else {
        if(a[a_ix] > b[b_ix]){
          labels.push(b[b_ix]);
          b_values.push(b[b_ix]);

          if( a_ix >= 1)
            a_values.push( (a[a_ix-1]+a[a_ix]) /2 );
          else
            a_values.push('-');

          b_ix ++;

        } else {
           labels.push(a[a_ix]);
           a_values.push(a[a_ix]);
           b_values.push(b[b_ix]);
           a_ix ++;
           b_ix ++;
        }
      }

    } else {
      if(a_ix < a.length){
        a_values.push(a[a_ix]);
        labels.push(a[a_ix]);
        a_ix ++;

        b_values.push('-');
      }

      if(b_ix < b.length){
        b_values.push(b[b_ix]);
        labels.push(b[b_ix]);
        b_ix ++;

        a_values.push('-');
      }
    }
  }
}

var labels = [];
var arduino_values = [];
var arpa_values = [];


magic(arduino, arpa, arduino_values, arpa_values, labels);

console.log("labels",labels);
console.log("arduino_values",arduino_values);
console.log("arpa_values",arpa_values);

console.log("labels len",labels.length);
console.log("arduino_values len",arduino_values.length);
console.log("arpa_values len",arpa_values.length);


// For each
// forEach((item, i) => {})
