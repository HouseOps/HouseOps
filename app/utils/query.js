import axios from 'axios';

import localStorageVariables from './localStorageVariables';

module.exports = async (query) => {
  let databaseEndpoint = localStorage.getItem(localStorageVariables.database.host);

  if (localStorage.getItem(localStorageVariables.database.user)) {
    databaseEndpoint = `${databaseEndpoint}/?user=${localStorage.getItem(localStorageVariables.database.user)}`;
  }

  if (localStorage.getItem(localStorageVariables.database.pass)) {
    databaseEndpoint = `${databaseEndpoint}&password=${localStorage.getItem(localStorageVariables.database.pass)}`;
  }

  if (localStorage.getItem(localStorageVariables.database.use)) {
    databaseEndpoint += `?database=${localStorage.getItem(localStorageVariables.database.use)}`;
  }

  return axios.post(databaseEndpoint, `${query} FORMAT JSON`);
};
