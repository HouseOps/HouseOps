import axios from 'axios';

module.exports = async (query) => {
  if (localStorage.getItem('database_user') && localStorage.getItem('database_pass')) {
    return axios.post(`${localStorage.getItem('database_host')}/?user=${localStorage.getItem('database_user')}&password=${localStorage.getItem('database_pass')}`, `${query} FORMAT JSON`);
  }

  return axios.post(localStorage.getItem('database_host'), `${query} FORMAT JSON`);
};
