// @flow
import React, { Component } from 'react';

import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarGroup,
  Tooltip,
  Position,
  Card,
  Elevation,

  Dialog,
  Intent,
  Alert,
  InputGroup,
  Callout,
  Slider,
  Switch
} from '@blueprintjs/core';

import { Scrollbars } from 'react-custom-scrollbars';

import query from '../utils/query';
import toaster from '../utils/toaster';

const { getGlobal } = require('electron').remote;

const screenView = getGlobal('screenView');

if (process.env.NODE_ENV === 'production') {
  screenView('ProcessList');
}
export default class ProcessList extends Component {

  constructor() {
    super();

    this.state = {
      processDetailsVisible: false,
      processDatailsData: {},
      autoUpdate: false,
      data: []
    };

    this.getProcessList();
    this.processLoop();
  }

  async getProcessList() {
    const res = await query('select * from system.processes');
    this.setState({ data: res.data.data });
  }

  async killQuery(queryId) {
    const res = await query(`KILL QUERY where query_id = '${queryId}'`);
    if (res.status === 200) {
      toaster.show({
        message: 'Shhhhhh...query is burned!',
        intent: Intent.DANGER,
        icon: 'flame'
      });
    }

    this.handleProcessDetailsCancel();
  }

  processLoop() {
    setInterval(() => {
      if (this.state.autoUpdate) {
        this.getProcessList();
      }
    }, 1000);
  }

  handleAutoUpdate = () => {

    this.setState({ autoUpdate: !this.state.autoUpdate });

  };

  handleProcessDetailsCancel = () => { this.setState({ processDetailsVisible: false }); };
  handleProcessDetailsOpen = (data) => {
    this.setState({
      processDetailsVisible: true,
      processDatailsData: data
    });
  };

  render() {
    return (

      <div>

        <Dialog
          isOpen={this.state.processDetailsVisible}
          icon="application"
          onClose={this.handleProcessDetailsCancel}
          title="Process details"
          style={{ width: '900px', color: '#CED9E0' }}
        >
          <div className="pt-dialog-body">
            <div style={{ float: 'left', width: '430px' }}>
              <p>
                <b>is_initial_query:</b> <i>{this.state.processDatailsData.is_initial_query}</i>
              </p>
              <p><b>user:</b> <i>{this.state.processDatailsData.user}</i></p>
              <p><b>query_id:</b> <i>{this.state.processDatailsData.query_id}</i></p>
              <p><b>address:</b> <i>{this.state.processDatailsData.address}</i></p>
              <p><b>port:</b> <i>{this.state.processDatailsData.port}</i></p>
              <p><b>initial_user:</b> <i>{this.state.processDatailsData.initial_user}</i></p>
              <p>
                <b>initial_query_id:</b> <i>{this.state.processDatailsData.initial_query_id}</i>
              </p>
              <p><b>initial_address:</b> <i>{this.state.processDatailsData.initial_address}</i></p>
              <p><b>initial_port:</b> <i>{this.state.processDatailsData.initial_port}</i></p>
              <p><b>interface:</b> <i>{this.state.processDatailsData.interface}</i></p>
              <p><b>os_user:</b> <i>{this.state.processDatailsData.os_user}</i></p>
              <p><b>client_hostname:</b> <i>{this.state.processDatailsData.client_hostname}</i></p>
              <p><b>client_name:</b> <i>{this.state.processDatailsData.client_name}</i></p>
              <p>
                <b>client_version_major:</b>
                <i> {this.state.processDatailsData.client_version_major}</i>
              </p>
              <p>
                <b>client_version_minor:</b>
                <i> {this.state.processDatailsData.client_version_minor}</i>
              </p>
            </div>
            <div style={{float: 'left', width: '430px'}}>
              <p><b>client_revision:</b> <i>{this.state.processDatailsData.client_revision}</i></p>
              <p><b>http_method:</b> <i>{this.state.processDatailsData.http_method}</i></p>
              <p><b>http_user_agent:</b> <i>{this.state.processDatailsData.http_user_agent}</i></p>
              <p><b>quota_key:</b> <i>{this.state.processDatailsData.quota_key}</i></p>
              <p><b>elapsed:</b> <i>{this.state.processDatailsData.elapsed}</i></p>
              <p><b>is_cancelled:</b> <i>{this.state.processDatailsData.is_cancelled}</i></p>
              <p><b>read_rows:</b> <i>{this.state.processDatailsData.read_rows}</i></p>
              <p><b>read_bytes:</b> <i>{this.state.processDatailsData.read_bytes}</i></p>
              <p>
                <b>total_rows_approx:</b> <i>{this.state.processDatailsData.total_rows_approx}</i>
              </p>
              <p><b>written_rows:</b> <i>{this.state.processDatailsData.total_rows_approx}</i></p>
              <p><b>written_bytes:</b> <i>{this.state.processDatailsData.written_bytes}</i></p>
              <p><b>memory_usage:</b> <i>{this.state.processDatailsData.memory_usage}</i></p>
              <p>
                <b>peak_memory_usage:</b> <i>{this.state.processDatailsData.peak_memory_usage}</i>
              </p>
            </div>

            <div style={{ float: 'left', width: '100%', marginTop: '20px' }}>
              <Callout>
                {this.state.processDatailsData.query}
              </Callout>
              <br />
              <Button intent={Intent.DANGER} icon="flame" className="pt-fill" onClick={() => { this.killQuery(this.state.processDatailsData.query_id); }}>
                Burn this process
              </Button>
            </div>
          </div>
        </Dialog>

        <Navbar
          style={{
            height: '35px', marginTop: '0px', marginLeft: '0px', zIndex: '0', backgroundColor: '#293742'
          }}
        >

          <NavbarGroup align={Alignment.LEFT} style={{ height: '35px' }}>

            <Tooltip content="Update Process List" position={Position.BOTTOM}>
              <Button
                onClick={() => { this.getProcessList(); }}
                className="pt-small pt-minimal"
                icon="refresh"
                text=""
              />
            </Tooltip>

            <div style={{ marginTop: '10px', marginLeft: '15px' }}>
              <Switch label="Auto update" checked={this.state.autoUpdate} onChange={this.handleAutoUpdate} />
            </div>

          </NavbarGroup>

        </Navbar>

        <div className="process-list">
          <Scrollbars>

            {
              this.state.data.map((value) => (

                <Card
                  interactive="true"
                  elevation={Elevation.TWO}
                  key={value.query_id}
                  className={{
                    danger: value.elapsed > 5,
                    warning: value.elapsed > 1 && value.elapsed < 5
                  }}
                >
                  <div onClick={() => { this.handleProcessDetailsOpen(value); }}>
                    <p><b>Elapsed time:</b> <i>{value.elapsed} seconds</i></p>
                    <small><p><b>User:</b> <i>{value.user}</i></p></small>
                    <small><p><b>Memory Usage: </b> <i>{value.memory_usage} MB</i></p></small>
                    <small><p><b>Query ID:</b> <i>{value.query_id}</i></p></small>
                    <Callout>
                      <i>{value.query.substring(0, Math.min(35, value.query.length))}...</i>
                    </Callout>
                  </div>
                  <Button intent={Intent.DANGER} icon="flame" className="pt-fill" onClick={() => { this.killQuery(value.query_id); }}>
                    Burn this process
                  </Button>
                </Card>

              ))
            }

          </Scrollbars>
        </div>
      </div>
    );
  }
}
