import axios from 'axios';

import localStorageVariables from './localStorageVariables';

export function databaseEndpoint() {
  let endpoint = localStorage.getItem(localStorageVariables.database.host);

  if (localStorage.getItem(localStorageVariables.database.user)) {
    endpoint = `${endpoint}/?user=${localStorage.getItem(localStorageVariables.database.user)}`;
  }

  if (localStorage.getItem(localStorageVariables.database.pass)) {
    endpoint = `${endpoint}&password=${localStorage.getItem(localStorageVariables.database.pass)}`;
  }

  if (localStorage.getItem(localStorageVariables.database.use)) {
    endpoint += `?database=${localStorage.getItem(localStorageVariables.database.use)}`;
  }

  return endpoint;
}

export async function runQuery(query) {
  return axios.post(databaseEndpoint(), `${query} FORMAT JSON`);
}
