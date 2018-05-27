// @flow
import React, { Component } from 'react';

import {
  Dialog,
  Intent,
  Button
} from '@blueprintjs/core';

import logo from '../resources/houseOps_animated.svg';

import Configurations from './Configurations';

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
        <Configurations
          ref={instance => { this.databaseConnConfiguration = instance; }}
        />

        <Dialog
          isOpen={this.state.visibility}
        >
          <div className="pt-dialog-body">

            <center>
              <img src={logo} alt="" height="60" />
              <br /><br />
              <h2>Welcome to HouseOps :)</h2>
              <small>Have a great experience!</small>
            </center>

          </div>
          <br />
          <br />
          <div className="pt-dialog-footer">
            <center>
              <Button
                large="true"
                intent={Intent.PRIMARY}
                onClick={this.openDatabaseConnectionConfigure}
                text="Configure my first connection now"
              />
            </center>
          </div>
        </Dialog>
      </div>

    );
  }
}
