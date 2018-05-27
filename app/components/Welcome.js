// @flow
import React, { Component } from 'react';

import {
  Dialog,
  Intent,
  Button
} from '@blueprintjs/core';

import logo from '../resources/houseOps_animated.svg';

import Settings from './Settings';

type Props = {};

export default class Welcome extends Component {
  props: Props;

  constructor() {
    super();

    this.state = {
      visibility: false
    };
  }

  handleOpen = () => { this.setState({ visibility: true }); };

  handleCancel = () => { this.setState({ visibility: false }); };

  openDatabaseConnectionConfigure = () => {
    this.handleCancel();
    this.databaseConnConfiguration.handleOpen();
  };

  render() {
    return (

      <div>
        <Settings
          ref={instance => { this.databaseConnConfiguration = instance; }}
        />

        <Dialog
          isOpen={this.state.visibility}
        >
          <div className="pt-dialog-body center">
            <br /><br />
            <img src={logo} alt="" height="60" />
            <br /><br /><br />
            <h2>Welcome to <i>HouseOps</i></h2>
            <br />
            <p>
              Have a <b>great experience</b> with <br />
              <b>HouseOps</b> and <b>ClickHouse Database</b>!
            </p>
          </div>
          <br />
          <br />
          <div className="pt-dialog-footer center">
            <Button
              large="true"
              intent={Intent.PRIMARY}
              onClick={this.openDatabaseConnectionConfigure}
              text="Configure my first connection now"
            />
          </div>
          <br /><br />
        </Dialog>
      </div>

    );
  }
}
