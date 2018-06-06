// @flow
import React, { Component } from 'react';

import {
  Dialog,
  Intent,
  Button
} from '@blueprintjs/core';

import logo from '../resources/houseOps_animated.svg';

const { getGlobal } = require('electron').remote;

const openUrl = getGlobal('openUrl');

export default class Update extends Component {
  constructor() {
    super();

    this.state = {
      visibility: false
    };
  }

  handleOpenUrl = () => { openUrl('https://github.com/HouseOps/HouseOps/releases'); };

  handleOpen = () => { this.setState({ visibility: true }); };

  handleCancel = () => { this.setState({ visibility: false }); };

  render() {
    return (

      <div>

        <Dialog
          isOpen={this.state.visibility}
        >
          <div className="pt-dialog-body center">
            <br /><br />
            <img src={logo} alt="" height="60" />
            <br /><br /><br />
            <h2>Update <i>available</i></h2>
            <br />
            <p>
              Have a new <b>HouseOps</b> version for <b>you</b>!
            </p>
          </div>

          <br />
          <br />

          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button
                intent={Intent.WARNING}
                onClick={this.handleCancel}
                text="Not now"
              />
              <Button
                intent={Intent.SUCCESS}
                onClick={this.handleOpenUrl}
                text="Open release page"
              />
            </div>
          </div>
        </Dialog>
      </div>

    );
  }
}
