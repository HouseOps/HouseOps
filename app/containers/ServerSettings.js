// @flow
import React, { Component } from 'react';

import {
  Alignment,
  Button,
  Navbar,
  NavbarGroup,
  Tooltip,
  Position,
  Intent,
  NavbarDivider,
  InputGroup
} from '@blueprintjs/core';

import { Scrollbars } from 'react-custom-scrollbars';

import query from '../utils/query';
import toaster from '../utils/toaster';

const { getGlobal } = require('electron').remote;

const screenView = getGlobal('screenView');

if (process.env.NODE_ENV === 'production') {
  screenView('ServerSettings');
}
export default class ServerSettings extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      data: []
    };
  }

  componentWillMount() {
    this.getSettingsList();
  }

  async getSettingsList() {
    this.setState({
      loading: true
    });

    try {
      const res = await query('select * from system.settings order by changed desc, name asc');

      this.setState({
        data: res.data.data
      });
    } catch (e) {
      toaster.show({
        message: `Error: ${e.message}`,
        intent: Intent.DANGER,
        icon: 'error'
      });
    }

    this.setState({ loading: false });
  }

  handleSearch = (e) => {
    if (!this.state.cache_data) {
      this.setState({ cache_data: this.state.data });
    }

    const data = this.state.cache_data.filter(value =>
      value.name.indexOf(e.target.value.toLowerCase()) > -1);

    this.setState({
      data
    });
  };

  render() {
    return (

      <div>

        <Navbar
          style={{
            height: '35px', marginTop: '0px', marginLeft: '0px', zIndex: '0', backgroundColor: '#293742'
          }}
        >

          <NavbarGroup align={Alignment.LEFT} style={{ height: '35px' }}>

            <Tooltip content="Refresh" position={Position.TOP}>
              <Button
                onClick={() => {
                  this.getSettingsList();
                }}
                className="pt-small pt-minimal"
                icon="refresh"
                text=""
                loading={this.state.loading || this.state.autoUpdate}
              />
            </Tooltip>

            <NavbarDivider />

            <InputGroup leftIcon="search" large="true" className="settings-search pt-input-group" type="text" placeholder="search" value={this.state.search} onChange={this.handleSearch} />

          </NavbarGroup>

        </Navbar>

        <br />

        <div className="settings-list">
          <Scrollbars>

            {
                this.state.data.map((value) => (
                  <div className="item">
                    <i><h3 style={{ color: '#F5F8FA' }}>{value.value} { value.changed !== 0 ? <small style={{ color: '#D9822B' }}>changed</small> : null }</h3></i>
                    <h4 style={{ color: '#CED9E0' }}>{value.name}</h4>
                    <small style={{ color: '#A7B6C2' }}>{value.description}</small>
                    <hr />
                  </div>
                ))
            }

          </Scrollbars>
        </div>
      </div>

    );
  }
}
