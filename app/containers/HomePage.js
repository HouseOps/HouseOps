// @flow
import React, { Component } from 'react';

// import Query from '../components/Query';
// import SideBar from '../components/SideBar';
// import DatabaseConnConfiguration from '../components/DatabaseConnConfiguration';

// import logo from '../resources/houseOps_animated.svg';

const { getGlobal } = require('electron').remote;

const screenView = getGlobal('screenView');

if (process.env.NODE_ENV === 'production') {
  screenView('HomePage');
}

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  openSettings = () => {
    // this.databaseConnConfiguration.handleOpen();
  };

  reload = () => {
    location.reload(true); // eslint-disable-line
  };

  render() {
    return (

      <div>
        <h1>teste</h1>
      </div>

    );
  }
}
