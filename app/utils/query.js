import axios from 'axios';
import buildUrl from 'build-url';

import localStorageVariables from './localStorageVariables';

export function databaseEndpoint(withDatabase = false) {
  const url = {
    path: '/',
    queryParams: {
      user: localStorage.getItem(localStorageVariables.database.user),
      password: localStorage.getItem(localStorageVariables.database.pass)
    }
  };

  if (withDatabase) {
    url.queryParams.database = localStorage.getItem(localStorageVariables.database.use);
  }

  return buildUrl(localStorage.getItem(localStorageVariables.database.host), url);
}

export async function runQuery(query, withDatabase = false) {
  return axios.post(databaseEndpoint(withDatabase), `${query} FORMAT JSON`);
}
