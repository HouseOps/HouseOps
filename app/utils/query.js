import axios from 'axios';

module.exports = async (query) => axios.post(localStorage.getItem('database_host'), `${query} FORMAT JSON`);
