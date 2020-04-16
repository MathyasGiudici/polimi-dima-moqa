// Based on https://github.com/MathyasGiudici/polimi-dima-moqa/blob/master/personalUtils/bigChartTest.js
// Code with a toy example to try to exploit the behaviour of the function
// to manage the labels and dataset of the Chart section

import {dateObjectCreator,minimalDate} from './Utils';

export function prepareToChart_arraySplitter(a, b, a_values, b_values, labels){
  var a_ix = 0;
  var b_ix = 0;

  a.sort(function(f,s){
    return f.date.getTime() - s.date.getTime();
  });

  b.sort(function(f,s){
    return f.date.getTime() - s.date.getTime();
  });

  while(a_ix < a.length || b_ix < b.length ){
    if(a_ix < a.length && b_ix < b.length){
      if(a[a_ix].date.getTime() < b[b_ix].date.getTime()){
        labels.push(minimalDate(dateObjectCreator(a[a_ix].date)));
        a_values.push(a[a_ix].value);

        if( b_ix >= 1)
          b_values.push( (b[b_ix-1].value + b[b_ix].value) /2 );
        else
          b_values.push(0);

        a_ix ++;

      } else {
        if(a[a_ix].date.getTime() > b[b_ix].date.getTime()){
          labels.push(minimalDate(dateObjectCreator(b[b_ix].date)));
          b_values.push(b[b_ix].value);

          if( a_ix >= 1)
            a_values.push( (a[a_ix-1].value + a[a_ix].value) /2 );
          else
            a_values.push(0);

          b_ix ++;

        } else {
           labels.push(minimalDate(dateObjectCreator(a[a_ix].date)));
           a_values.push(a[a_ix].value);
           b_values.push(b[b_ix].value);
           a_ix ++;
           b_ix ++;
        }
      }

    } else {
      if(a_ix < a.length){
        labels.push(minimalDate(dateObjectCreator(a[a_ix].date)));
        a_values.push(a[a_ix].value);
        a_ix ++;

        b_values.push(0);
      }

      if(b_ix < b.length){
        labels.push(minimalDate(dateObjectCreator(b[b_ix].date)));
        b_values.push(b[b_ix].value);
        b_ix ++;

        a_values.push(0);
      }
    }
  }
  // console.log("--------");
  // console.log(a[0]);
  // console.log(b[0]);
  // console.log(a[a.length - 1]);
  // console.log(b[b.length - 1]);
  // console.log("a_values.length",a_values.length);
  // console.log(a_values[0]);
  // console.log("b_values.length",b_values.length);
  // console.log(b_values[0]);
  // console.log("labels.length",labels.length)
  // console.log(labels[0]);
}
