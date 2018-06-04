// @flow
import React, { Component } from 'react';
import { Mosaic } from 'react-mosaic-component';

import {
  Button,
  Intent
} from '@blueprintjs/core';

import QueryLaunch from '../components/QueryLaunch';
import QueryResults from '../components/QueryResults/QueryResults';
import DatabaseTree from '../components/DatabaseTree/DatabaseTree';
import Settings from '../components/Settings';

import localStorageVariables from '../utils/localStorageVariables';

const { getGlobal } = require('electron').remote;

const screenView = getGlobal('screenView');

if (process.env.NODE_ENV === 'production') {
  screenView('DoScience');
}
export default class DoScience extends Component {
  constructor() {
    super();

    this.state = {
      data: {}
    };
  }

  handleChangeData = (data) => {
    this.setState({ data });

    if (!data.data) {
      this.databaseTree.getData();
    }
  };

  ELEMENT_MAP = (id) => {
    switch (id) {
      case 'SideBar':
        return <DatabaseTree ref={instance => { this.databaseTree = instance; }} />;
      case 'Up':
        return <QueryLaunch onData={this.handleChangeData} />;
      case 'Down':
        return <QueryResults data={this.state.data} />;
      default: return null;
    }
  };

  openDatabaseConnectionConfigure = () => {
    this.databaseConnConfiguration.handleOpen();
  };

  reload = () => {
    location.reload(true); // eslint-disable-line
  };

  render() {
    return (

      <div style={{ height: '100%', width: '100%' }}>

        { !localStorage.getItem(localStorageVariables.database.host) ?
          <div className="no-database">
            <h3>No database is configured</h3>
            <br />
            <Button
              intent={Intent.PRIMARY}
              onClick={this.openDatabaseConnectionConfigure}
              text="Configure database connection here"
            />
            <Settings
              ref={instance => { this.databaseConnConfiguration = instance; }}
            />
          </div> : null }

        { localStorage.getItem(localStorageVariables.database.host) ?
          <Mosaic
            renderTile={(id) => this.ELEMENT_MAP(id)}
            initialValue={{
              direction: 'row',
              first: 'SideBar',
              second: {
                direction: 'column',
                first: 'Up',
                second: 'Down',
              },
              splitPercentage: 15
            }}
            className="mosaic-blueprint-theme pt-dark"
          /> : null }

      </div>

    );
  }
}
