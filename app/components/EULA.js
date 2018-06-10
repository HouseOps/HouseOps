// @flow
import React, { Component } from 'react';
import { Dialog, Intent, Button } from '@blueprintjs/core';
import { Scrollbars } from 'react-custom-scrollbars';

import Welcome from './Welcome';

import localStorageVariables from '../utils/localStorageVariables';

const { getGlobal } = require('electron').remote;

const exit = getGlobal('exit');

export default class EULA extends Component {
  constructor() {
    super();

    this.state = {
      visibility: false
    };
  }

  handleOpen = () => { this.setState({ visibility: true }); };

  handleAccept = () => {
    localStorage.setItem(localStorageVariables.EULA_Acceptance, 'accepted');
    this.setState({ visibility: false });

    this.welcome.handleOpen();
  };

  handleExit = () => { exit(); };

  render() {
    return (

      <div>

        <Welcome
          ref={instance => { this.welcome = instance; }}
        />

        <Dialog
          isOpen={this.state.visibility}
          onClose={this.handleCancel}
          style={{ width: '1000px' }}
        >
          <div className="pt-dialog-body">

            <center>
              <h2>End-User License Agreement</h2>
              <hr />
            </center>

            <div style={{ height: '300px' }}>
              <Scrollbars>
                <p><b>Effective date:</b> 26/06/2018</p>
                <br />

                <h3>Read Carefully:</h3>
                <p>
                  This End-User License Agreement (“EULA”) is a legal agreement
                  between you and HouseOps Community to regulate your use
                  of the HouseOps software and its related components.
                </p>
                <p>
                  If you do not agree to all of the terms of this EULA,
                  you should not download, install or use the
                  HouseOps software and its related components. If you have already
                  downloaded or installed the HouseOps Software, you should remove it
                  from your system and destroy all copies thereof.
                </p>

                <br />
                <h3>Terms:</h3>
                <p>
                  <b>1.</b> This program will never send to external location your personal
                  data or any other sensitive data.
                </p>
                <p>
                  <b>2.</b> This program uses Google Analytics to monitor the number of queries
                  executed, the pages viewed and the location where this program is being used,
                  just for improvements to this program.
                </p>
                <p>
                  <b>3.</b> This program is community-based and is open-source,
                  analyze the code of this program before using it to see if it is
                  compatible with your needs.
                </p>
                <p>
                  <b>4.</b> You are completely responsible for everything that
                  happens in this program. HouseOps does not execute anything without
                  the user permission, all actions are done manually by the operator.
                </p>
                <p>
                  <b>5.</b> You is responsible for any loss of data or any other loss that you
                  or your business suffer from using this program.
                </p>
                <p>
                  <b>6.</b> You are completely responsible for everything that happens or
                  for all use of this program.
                </p>
                <p>
                  <b>7.</b> You agree to all the terms of the external
                  modules used by this program.
                </p>
                <p><b>8.</b> You will never copy this program and relaunch with another name.</p>
              </Scrollbars>
            </div>

            <br /><br />

            <div className="pt-dialog-footer">
              <div className="pt-dialog-footer-actions">
                <Button
                  intent={Intent.DANGER}
                  onClick={this.handleExit}
                  text="I NOT accept these terms"
                  icon="small-cross"
                />
                <Button
                  intent={Intent.SUCCESS}
                  onClick={this.handleAccept}
                  text="I accept these terms"
                  icon="small-tick"
                />
              </div>
            </div>

          </div>
        </Dialog>

      </div>
    );
  }
}
