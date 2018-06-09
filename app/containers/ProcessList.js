// @flow
import React, { Component } from 'react';

import {
  Alignment,
  Button,
  Navbar,
  NavbarGroup,
  Tooltip,
  Position,
  Card,
  Elevation,
  Dialog,
  Intent,
  Callout,
  Switch,
  NavbarDivider,
  Icon
} from '@blueprintjs/core';

import { Scrollbars } from 'react-custom-scrollbars';

import query from '../utils/query';
import toaster from '../utils/toaster';

const prettyBytes = require('pretty-bytes');

const { getGlobal } = require('electron').remote;

const screenView = getGlobal('screenView');

if (process.env.NODE_ENV === 'production') {
  screenView('ProcessList');
}
export default class ProcessList extends Component<> {
  constructor() {
    super();

    this.state = {
      processDetailsVisible: false,
      processDatailsData: {
        read_bytes: 0,
        written_bytes: 0,
        memory_usage: 0,
        peak_memory_usage: 0
      },
      autoUpdate: false,
      loading: false,
      burningLoading: false,
      data: {},
      recording: false
    };
  }

  componentWillMount() {
    this.getProcessList();
    this.processLoop();
  }

  componentWillUnmount() {
    clearInterval(this.processLoopInterval);
  }

  processLoopInterval: object = null;

  async getProcessList(persist = false) {
    this.setState({ loading: true });

    try {
      const res = await query('select * from system.processes order by elapsed desc');

      // TODO: Refactor this
      if (persist) {
        const processCollection = this.state.data;

        res.data.data
          .filter(value => value.query.indexOf('system.processes') < 0)
          .forEach(value => {
            value.captured_at = Date.now(); // eslint-disable-line
            processCollection[value.query_id] = value;
          });

        this.setState({
          data: processCollection
        });
      } else {
        const processCollection = {};

        res.data.data.forEach(value => {
          processCollection[value.query_id] = value;
        });

        this.setState({
          data: processCollection
        });
      }
      // TODO: end of refactor
    } catch (e) {
      this.setState({
        data: {}
      });

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
      if (this.state.autoUpdate && !this.state.recording) {
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

  handleRecording = () => {
    if (!this.state.recording) {
      this.setState({
        recording: true,
        loading: true,
        autoUpdate: true
      });

      this.processLoopInterval = setInterval(() => {
        this.getProcessList(true);
      }, 100);
    } else {
      this.getProcessList();

      this.setState({
        recording: false,
        loading: false,
        autoUpdate: false
      });

      clearInterval(this.processLoopInterval);
    }
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
                <b>client_version_major: </b>
                <i> {this.state.processDatailsData.client_version_major}</i>
              </p>
              <p>
                <b>client_version_minor: </b>
                <i>{this.state.processDatailsData.client_version_minor}</i>
              </p>
            </div>
            <div style={{ float: 'left', width: '430px' }}>
              <p><b>client_revision:</b> <i>{this.state.processDatailsData.client_revision}</i></p>
              <p><b>http_method:</b> <i>{this.state.processDatailsData.http_method}</i></p>
              <p><b>http_user_agent:</b> <i>{this.state.processDatailsData.http_user_agent}</i></p>
              <p><b>quota_key:</b> <i>{this.state.processDatailsData.quota_key}</i></p>
              <p><b>elapsed:</b> <i>{this.state.processDatailsData.elapsed}</i></p>
              <p><b>is_cancelled:</b> <i>{this.state.processDatailsData.is_cancelled}</i></p>
              <p><b>read_rows:</b> <i>{this.state.processDatailsData.read_rows}</i></p>
              <p>
                <b>read_bytes: </b>
                <i>{prettyBytes(parseInt(this.state.processDatailsData.read_bytes, 10))}</i>
              </p>
              <p>
                <b>total_rows_approx:</b> <i>{this.state.processDatailsData.total_rows_approx}</i>
              </p>
              <p><b>written_rows:</b> <i>{this.state.processDatailsData.total_rows_approx}</i></p>
              <p>
                <b>written_bytes: </b>
                <i>{prettyBytes(parseInt(this.state.processDatailsData.written_bytes, 10))}</i>
              </p>
              <p>
                <b>memory_usage: </b>
                <i>{prettyBytes(parseInt(this.state.processDatailsData.memory_usage, 10))}</i>
              </p>
              <p>
                <b>peak_memory_usage: </b>
                <i>{prettyBytes(parseInt(this.state.processDatailsData.peak_memory_usage, 10))}</i>
              </p>
            </div>

            <div style={{ float: 'left', width: '100%', marginTop: '20px' }}>
              <Callout>
                {this.state.processDatailsData.query}
              </Callout>
              <br />
              <Button
                intent={Intent.DANGER}
                icon="heart-broken"
                className="pt-fill"
                onClick={() => { this.killQuery(this.state.processDatailsData.query_id); }}
                loading={this.state.burningLoading}
              >
                Kill process
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

            <Tooltip content="Recording (hidden system.process)" position={Position.TOP}>
              <Button
                onClick={() => { this.handleRecording(); }}
                className="pt-small pt-minimal"
                icon="record"
                text=""
                intent={this.state.recording ? Intent.DANGER : null}
              />
            </Tooltip>
            <NavbarDivider />

            <Tooltip content="Refresh list every 0.5s" position={Position.TOP}>
              <div style={{ marginTop: '10px' }}>
                <Switch label="Auto Refresh" checked={this.state.autoUpdate} disabled={this.state.recording} onChange={this.handleAutoUpdate} style={{ color: '#bfccd6' }} />
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
              Object.keys(this.state.data).map(key => (

                <Card
                  interactive="true"
                  elevation={Elevation.TWO}
                  key={this.state.data[key].query_id}
                  className={{
                    danger: this.state.data[key].elapsed > 5,
                    warning: this.state.data[key].elapsed > 1 && this.state.data[key].elapsed < 5
                  }}
                >
                  <div onClick={() => { {/*eslint-disable-line*/}
                    this.handleProcessDetailsOpen(this.state.data[key]);
                  }}
                  >
                    <p><b>Elapsed time:</b> <i>{this.state.data[key].elapsed} seconds</i></p>
                    <small><p><b>User:</b> <i>{this.state.data[key].user}</i></p></small>
                    <small>
                      <p>
                        <b>Memory Usage: </b>
                        <i>{prettyBytes(parseInt(this.state.data[key].memory_usage, 10))}</i>
                      </p>
                    </small>
                    <small><p><b>Query ID:</b>
                      <i>{this.state.data[key].query_id}</i></p></small>
                    <Callout>
                      <i>
                        {this.state.data[key]
                          .query.substring(0, Math.min(35, this.state.data[key].query.length))}...
                      </i>
                    </Callout>
                  </div>
                  <Button
                    intent={Intent.DANGER}
                    icon="heart-broken"
                    className="pt-fill"
                    onClick={() => {
                      this.killQuery(this.state.data[key].query_id);
                    }}
                    loading={this.state.burningLoading}
                  >
                    Kill process
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
