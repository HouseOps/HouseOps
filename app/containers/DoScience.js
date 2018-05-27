// @flow
import React, { Component } from 'react';
import { Mosaic } from 'react-mosaic-component';

import {
  Button,
  Intent
} from '@blueprintjs/core';

import QueryLaunch from '../components/QueryLaunch';
import DatabaseTree from '../components/DatabaseTree/DatabaseTree';
import Settings from '../components/Settings';

import localStorageVariables from '../utils/localStorageVariables';

const { getGlobal } = require('electron').remote;

const screenView = getGlobal('screenView');

if (process.env.NODE_ENV === 'production') {
  screenView('DoScience');
}

const ELEMENT_MAP: { [viewId: string]: any } = {
  SideBar: <DatabaseTree />,
  Up: <QueryLaunch />,
  Down: <div>Bottom Right Window</div>,
};

type Props = {};

export default class DoScience extends Component<Props> {
  props: Props;

  openDatabaseConnectionConfigure = () => {
    this.databaseConnConfiguration.handleOpen();
  };

  reload = () => {
    location.reload(true); // eslint-disable-line
  };

  render() {
    return (

      <div>

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
            renderTile={(id) => ELEMENT_MAP[id]}
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
