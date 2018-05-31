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
  Switch,
  NavbarDivider,
  Icon
} from '@blueprintjs/core';

import { Scrollbars } from 'react-custom-scrollbars';

import query from '../utils/query';
import toaster from '../utils/toaster';

const { getGlobal } = require('electron').remote;

const screenView = getGlobal('screenView');

if (process.env.NODE_ENV === 'production') {
  screenView('ProcessList');
}
export default class ProcessList extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      processDetailsVisible: false,
      processDatailsData: {},
      autoUpdate: false,
      loading: false,
      burningLoading: false,
      data: []
    };
  }

  componentWillMount() {
    this.getProcessList();
    this.processLoop();
  }

  componentWillUnmount() {
    clearInterval(this.processLoopInterval);
  }

  processLoopInterval: any = null;

  async getProcessList() {
    this.setState({ loading: true });

    try {
      const res = await query('select * from system.processes order by elapsed desc');

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

  async killQuery(queryId) {
    const autoUpdateStateCache = this.state.autoUpdate;

    this.setState({
      burningLoading: true,
      autoUpdate: false
    });

    try {
      await query(`KILL QUERY where query_id = '${queryId}'`);

      toaster.show({
        message: 'Shhhhhh...query is burned!',
        intent: Intent.DANGER,
        icon: 'flame'
      });

      this.handleProcessDetailsCancel();
      setTimeout(() => {
        this.getProcessList();
      }, 1000);
    } catch (e) {
      toaster.show({
        message: `Error: ${e.message}`,
        intent: Intent.DANGER,
        icon: 'error'
      });
    }

    setTimeout(() => {
      this.setState({
        burningLoading: false,
        autoUpdate: autoUpdateStateCache
      });
    }, 1000);
  }

  processLoop() {
    this.processLoopInterval = setInterval(() => {
      if (this.state.autoUpdate) {
        this.getProcessList();
      }
    }, 500);
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
              <Button
                intent={Intent.DANGER}
                icon="flame"
                className="pt-fill"
                onClick={() => { this.killQuery(this.state.processDatailsData.query_id); }}
                loading={this.state.burningLoading}
              >
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

            <Tooltip content="Refresh" position={Position.TOP}>
              <Button
                onClick={() => { this.getProcessList(); }}
                className="pt-small pt-minimal"
                icon="refresh"
                text=""
                loading={this.state.loading || this.state.autoUpdate}
              />
            </Tooltip>
            <NavbarDivider />

            <Tooltip content="Refresh list every 0.5s" position={Position.TOP}>
              <div style={{ marginTop: '10px' }}>
                <Switch label="Auto Refresh" checked={this.state.autoUpdate} onChange={this.handleAutoUpdate} style={{ color: '#bfccd6' }} />
              </div>
            </Tooltip>

          </NavbarGroup>

          <NavbarGroup align={Alignment.RIGHT} style={{ height: '35px' }}>
            <Tooltip content="Click in process for more informations." position={Position.LEFT}>
              <Icon
                icon="comment"
                style={{ cursor: 'help', color: '#bfccd6' }}
              />
            </Tooltip>
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
                  <Button
                    intent={Intent.DANGER}
                    icon="flame"
                    className="pt-fill"
                    onClick={() => { this.killQuery(value.query_id); }}
                    loading={this.state.burningLoading}
                  >
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
