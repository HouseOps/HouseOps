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
      database_host: localStorage.getItem('database_host')
    };

    if(!localStorage.getItem('database_host')) setTimeout(()=> this.setState({ visibility: true }) , 2000)

  }

  async checkDatabase(){
    return await axios.get(this.state.database_host)
  }

  handleOpen = (e) => { this.setState({ visibility: true }); };

  handleOk = (e) => {

    this.checkDatabase()
      .then(() => {

        localStorage.setItem('database_host', this.state.database_host);

        this.setState({
          visibility: false
        });

        notification.success({
          message: 'Yeah!',
          description: 'Your are connected to the best of database in the world, reload in 3, 2, 1...',
          duration: 3
        });

        setTimeout(()=> location.reload(true) , 3000)

      })
      .catch(() => {

        notification.error({
          message: 'Oh god...',
          description: 'Connection refused, try again.'
        })

      });

  };

  handleChange = (e) => this.setState({ database_host: e.target.value });
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
          <Input addonBefore="Host" placeholder="http://localhost:8123" value={this.state.database_host} onChange={this.handleChange} />
        </p>
      </Modal>
    );
  }
}
