// @flow
import axios from 'axios';


export function aceChangeDis(value){




}


export function makeAlert() {

  axios.get('http://localhost:8123', {
    params: {
      query: 'show databases FORMAT JSON'
    }
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

}
