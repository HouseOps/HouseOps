// @flow
import React, { Component } from 'react';

import {
  Dialog,
  Intent,
  Button,
  InputGroup,
  Position,
  Toaster
} from '@blueprintjs/core';

import axios from 'axios';

type Props = {};

export default class DatabaseConnConfiguration extends Component {
  props: Props;

  constructor() {
    super();

    this.state = {
      visibility: false,
      database_host: localStorage.getItem('database_host'),
      database_user: localStorage.getItem('database_user'),
      database_pass: localStorage.getItem('database_pass')
    };

    if (!localStorage.getItem('database_host')) setTimeout(() => this.setState({ visibility: true }), 2000);
  }

  async checkDatabase() {
    return axios.get(this.state.database_host);
  }

  handleOpen = () => { this.setState({ visibility: true }); };

  handleOk = () => {
    this.checkDatabase()
      .then(() => {
        localStorage.setItem('database_host', this.state.database_host);
        localStorage.setItem('database_user', this.state.database_user);
        localStorage.setItem('database_pass', this.state.database_pass);

        this.setState({
          visibility: false
        });

        Toaster.create({
          intent: Intent.SUCCESS,
          position: Position.BOTTOM_RIGHT,
          timeout: 2000,
        }).show({message: 'Your are connected to the best of database in the world, reloading...'});

        setTimeout(() => location.reload(true), 2000); // eslint-disable-line

        return null;
      })
      .catch((e) => {

        Toaster.create({
          intent: Intent.DANGER,
          position: Position.BOTTOM_RIGHT,
          className: 'pt-intent-warning',
          timeout: 0,
        }).show({message: e.message});

      });
  };

  handleChangeHost = (e) => this.setState({ database_host: e.target.value });
  handleChangePass = (e) => this.setState({ database_pass: e.target.value });
  handleChangeUser = (e) => this.setState({ database_user: e.target.value });

  handleCancel = () => { this.setState({ visibility: false }); };

  render() {
    return (

      <Dialog
        icon="cog"
        isOpen={this.state.visibility}
        onClose={this.handleCancel}
        title="Database configuration"
      >
        <div className="pt-dialog-body">


          <InputGroup leftIcon="globe" large="true" className="pt-input-group .modifier pt-fill" type="text" placeholder="http://localhost:8123" value={this.state.database_host} onChange={this.handleChangeHost} />
          <br />
          <InputGroup leftIcon="user" large="true" className="pt-input-group .modifier pt-fill" type="text" placeholder="default" value={this.state.database_user} onChange={this.handleChangeUser} />
          <br />
          <InputGroup leftIcon="lock" large="true" className="pt-input-group .modifier pt-fill" type="password" placeholder="password" value={this.state.database_pass} onChange={this.handleChangePass} />

        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button
              intent={Intent.PRIMARY}
              onClick={this.handleOk}
              text="Save"
            />
          </div>
        </div>
      </Dialog>
    );
  }
}
