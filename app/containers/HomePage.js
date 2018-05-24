// @flow
import React, { Component } from 'react';
import { Mosaic } from 'react-mosaic-component';

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

  ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
    a: <div>Left Window</div>,
    b: <div>Top Right Window</div>,
    c: <div>Bottom Right Window</div>,
  };

  openSettings = () => {
    // this.databaseConnConfiguration.handleOpen();
  };

  reload = () => {
    location.reload(true); // eslint-disable-line
  };

  render() {
    return (

      <Mosaic
        renderTile={(id) => this.ELEMENT_MAP[id]}
        initialValue={{
          direction: 'row',
          first: 'a',
          second: {
            direction: 'column',
            first: 'b',
            second: 'c',
          },
          splitPercentage: 40,
        }}
      />

    );
  }
}
