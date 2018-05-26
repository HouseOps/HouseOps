// @flow
import React, { Component } from 'react';
import { Mosaic } from 'react-mosaic-component';

// import Query from '../components/Query';
import SideBar from '../components/sidebar/SideBar';
// import DatabaseConnConfiguration from '../components/DatabaseConnConfiguration';

// import logo from '../resources/houseOps_animated.svg';

const { getGlobal } = require('electron').remote;

const screenView = getGlobal('screenView');

if (process.env.NODE_ENV === 'production') {
  screenView('HomePage');
}

export const THEMES = {
  ['Blueprint']: 'mosaic-blueprint-theme',
  ['Blueprint Dark']: 'mosaic-blueprint-theme pt-dark',
  ['None']: '',
};

const ELEMENT_MAP: { [viewId: string]: any } = {
  a: <SideBar />,
  b: <div>Top Right Window</div>,
  c: <div>Bottom Right Window</div>,
};

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

      <Mosaic
        renderTile={(id) => ELEMENT_MAP[id]}
        initialValue={{
          direction: 'row',
          first: 'a',
          second: {
            direction: 'column',
            first: 'b',
            second: 'c',
          },
          splitPercentage: 30
        }}
        className="mosaic-blueprint-theme pt-dark"
      />

    );
  }
}
