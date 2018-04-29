// @flow
import React, { Component } from 'react';
import { Modal, Input, notification } from 'antd';
import axios from 'axios';

type Props = {};

export default class DatabaseConnConfiguration extends Component<Props> {
  props: Props;

  constructor(props, context) {
    super(props, context);

    this.state = {
      visibility: false,
      database_host: localStorage.getItem('database_host'),
      database_user: localStorage.getItem('database_user'),
      database_pass: localStorage.getItem('database_pass')
    };

    if (!localStorage.getItem('database_host')) setTimeout(() => this.setState({ visibility: true }), 2000);
  }

  async checkDatabase() {
    return await axios.get(this.state.database_host);
  }

  handleOpen = (e) => { this.setState({ visibility: true }); };

  handleOk = (e) => {
    this.checkDatabase()
      .then(() => {

        localStorage.setItem('database_host', this.state.database_host);
        localStorage.setItem('database_user', this.state.database_user);
        localStorage.setItem('database_pass', this.state.database_pass);

        this.setState({
          visibility: false
        });

        notification.success({
          message: 'Yeah!',
          description: 'Your are connected to the best of database in the world, reload in 3, 2, 1...',
          duration: 3
        });

        setTimeout(() => location.reload(true), 3000);
      })
      .catch(() => {
        notification.error({
          message: 'Oh god...',
          description: 'Connection refused, try again.'
        });
      });
  };

  handleChangeHost = (e) => this.setState({ database_host: e.target.value });
  handleChangePass = (e) => this.setState({ database_pass: e.target.value });
  handleChangeUser = (e) => this.setState({ database_user: e.target.value });

  handleCancel = (e) => { this.setState({ visibility: false }); };

  render() {
    return (
      <Modal
        title="Database configuration"
        visible={this.state.visibility}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <p>
          <Input addonBefore="Host:Port" placeholder="http://localhost:8123" value={this.state.database_host} onChange={this.handleChangeHost} />
          <br /><br />
          <Input addonBefore="User" placeholder="default" value={this.state.database_user} onChange={this.handleChangeUser} />
          <br /><br />
          <Input addonBefore="Pass" type="password" placeholder="" value={this.state.database_pass} onChange={this.handleChangePass} />
        </p>
      </Modal>
    );
  }
}
