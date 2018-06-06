// @flow
import React, { Component } from 'react';

import axios from 'axios';

import {
  Alignment,
  Button,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Tooltip,
  Position,
  Dialog,
  Intent,
  Alert,
  InputGroup,
  Callout,
  AnchorButton
} from '@blueprintjs/core';

import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/chaos';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';
import ace from 'brace';

import ReactResizeDetector from 'react-resize-detector';

import { HotKeys } from 'react-hotkeys';

import 'react-table/react-table.css';

import toaster from '../utils/toaster';
import executeQuery from '../utils/query';
import localStorageVariables from '../utils/localStorageVariables';

const prettyBytes = require('pretty-bytes');

const { getGlobal } = require('electron').remote;

const trackEvent = getGlobal('trackEvent');

const langTools = ace.acequire('ace/ext/language_tools');

type Props = {
  onData: object
};

export default class QueryLaunch extends Component<Props> {
  props: Props;
  queryRequest: object;
  queryRequestCancel: object;

  constructor() {
    super();

    this.state = {
      value: '',
      currentQuery: '',
      editorHeight: '200px',
      shortcutsVisibility: false,
      loading: false,
      confirmDropModalVisible: false,
      queryStatistics: '',
      databaseList: []
    };
  }

  componentWillMount() {
    this.aceEditor = React.createRef();
    this.autoCompleter();
    this.getDatabaseList();
  }

  hotKeysMap = {
    execute: ['ctrl+enter', 'command+enter']
  };

  hotKeysHandlers = {
    execute: () => this.onQuery()
  };

  onResizeEditor = () => {
    const height = document.getElementById('editor').clientHeight;

    this.setState({
      editorHeight: `${height - 35}px`
    });
  };

  getDatabaseList = async () => {
    const res = await executeQuery('show databases');

    const databases = res.data.data.map(value => value.name);

    this.setState({ databaseList: databases });
  };

  onLoad = () => {
    const value = localStorage.getItem('query') ? localStorage.getItem('query') : '';

    this.setState({
      value
    });

    setTimeout(() => {
      this.onResizeEditor();
    }, 100);
  };

  autoCompleter = () => { //eslint-disable-line
    // TODO: Fix this to execute only when DatabaseTree is updated.
    setTimeout(() => {
      const col = JSON.parse(localStorage.getItem('autoCompleteCollection'));
      const newCol = [];

      col.forEach((value) => {
        let include = true;

        newCol.forEach((_value) => {
          if (value.name === _value.name) {
            include = false;
          }
        });

        if (include) {
          newCol.push(value);
        }
      });

      const customCompleter = {
        getCompletions: (editor, session, pos, prefix, callback) => {
          callback(null, newCol);
        }
      };

      langTools.completer = null;

      langTools.addCompleter(customCompleter);
    }, 5000);
  };

  onChange = (newValue) => {
    localStorage.setItem('query', newValue);

    this.setState({
      value: newValue
    });
  };

  handleConfirmDROP = (e) => this.setState({ confirmDROP: e.target.value });

  confirmModalCancel = () => {
    this.setState({
      confirmDropModalVisible: false,
      confirmDROP: '',
      loading: false
    });
  };

  confirmModalOk = () => {
    if (this.state.confirmDROP === 'DROP') {
      this.setState({
        confirmDropModalVisible: false,
        confirmDROP: ''
      });

      this.onQuery(null, true);
    } else {
      toaster.show({
        message: 'Type DROP to confirm.',
        intent: Intent.WARNING,
        icon: 'error',
        timeout: 5000
      });
    }
  };

  query = async (content) => {
    trackEvent('User Interaction', 'QueryLaunch executed');
    return executeQuery(content);
  };

  getQuery = () => {
    let queryText = this.aceEditor.current.editor.getSelectedText() || this.state.value;

    // remove the ending spaces and semicolons
    queryText = queryText.replace(/;*\s*$/, '');
    return queryText;
  };

  onQuery = async (e, dropConfirmation = false) => {
    if (!this.state.loading) {
      try {
        const query = this.getQuery();

        this.setState({ currentQuery: query });

        if (
          (!localStorage.getItem(localStorageVariables.Disable_Drop_Alert_Confirm) || localStorage.getItem(localStorageVariables.Disable_Drop_Alert_Confirm) === 'false') &&
          !dropConfirmation &&
          query.toLowerCase().indexOf('drop') > -1
        ) {
          this.setState({
            confirmDropModalVisible: true
          });

          return;
        }

        this.setState({
          loading: true
        });

        // TODO: Refactor this!!!
        let databaseEndpoint = localStorage.getItem(localStorageVariables.database.host);

        if (localStorage.getItem(localStorageVariables.database.user)) {
          databaseEndpoint = `${databaseEndpoint}/?user=${localStorage.getItem(localStorageVariables.database.user)}`;
        }

        if (localStorage.getItem(localStorageVariables.database.pass)) {
          databaseEndpoint = `${databaseEndpoint}&password=${localStorage.getItem(localStorageVariables.database.pass)}`;
        }

        if (localStorage.getItem(localStorageVariables.database.use)) {
          databaseEndpoint += `?database=${localStorage.getItem(localStorageVariables.database.use)}`;
        }

        const fakeThis = this;
        this.queryRequest = await axios.post(databaseEndpoint, `${query} FORMAT JSON`, {
          cancelToken: new axios.CancelToken((c) => {
            fakeThis.queryRequestCancel = c;
          })
        });
        //

        if (this.queryRequest.data) {
          this.props.onData(this.queryRequest.data);
        } else {
          this.props.onData({});
        }

        if (this.queryRequest.data) {
          this.setState({
            queryStatistics: `returned ${this.queryRequest.data.rows} rows, elapsed ${this.queryRequest.data.statistics.elapsed.toFixed(3)}ms, ${this.queryRequest.data.statistics.rows_read} rows processed on ${prettyBytes(parseInt(this.queryRequest.data.statistics.bytes_read, 10))} of data`
          });
        } else {
          this.setState({
            queryStatistics: ''
          });
          toaster.show({
            message: 'Your query running ok.',
            intent: Intent.SUCCESS,
            icon: 'tick-circle',
            timeout: 5000
          });
        }

        this.setState({
          loading: false
        });
      } catch (err) {
        console.error(err);

        this.props.onData({});

        const toasterMsg = err.response && err.response.data ? `${err.message} - ${err.response.data}` : `${err.message}`;

        toaster.show({
          message: err.message ? toasterMsg : 'Query is aborted.',
          intent: Intent.DANGER,
          icon: 'error',
          timeout: 0
        });

        this.setState({
          loading: false,
          queryStatistics: ''
        });
      }
    }
  };

  shortcutsHandleClose = () => {
    this.setState({ shortcutsVisibility: false });
  };

  shortcutsHandleOpen = () => {
    this.setState({ shortcutsVisibility: true });
  };

  useDatabase = (e) => {
    localStorage.setItem(localStorageVariables.database.use, e.target.value);

    toaster.show({
      message: e.target.value ? `Using database ${e.target.value}.` : 'Using database default',
      intent: Intent.WARNING,
      icon: 'database',
      timeout: 5000
    });
  };

  ignoreQueryResponse = () => {
    this.queryRequestCancel();
    this.setState({ loading: false });
  };

  render() {
    return (
      <div id="editor" style={{ height: '100%' }}>

        <Alert
          isOpen={this.state.confirmDropModalVisible}
          intent={Intent.DANGER}
          icon="trash"
          cancelButtonText="NO, you save me."
          confirmButtonText="YES, I want!"
          onConfirm={this.confirmModalOk}
          onCancel={this.confirmModalCancel}
        >
          <div>
            <s><b>Oh my god</b></s>, you <b>really want</b> to execute <b>DROP</b> command?
            <br /><br />

            <Callout>
              <small>{this.state.currentQuery}</small>
            </Callout>

            <br />
            <small>Type <b>DROP</b> to confirm:</small>
            <InputGroup
              type="text"
              className="pt-input-group"
              value={this.state.confirmDROP}
              onChange={this.handleConfirmDROP}
            />
            <br />

            <small>You can disable this alert in settings.</small>
            <br /><br />
          </div>
        </Alert>

        <Navbar
          style={{
            height: '35px', marginTop: '0px', marginLeft: '0px', zIndex: '0', backgroundColor: '#293742'
          }}
        >

          <NavbarGroup align={Alignment.LEFT} style={{ height: '35px' }}>

            <Tooltip content="Launch query" position={Position.BOTTOM}>
              <Button
                loading={this.state.loading}
                onClick={this.onQuery}
                className="pt-small pt-minimal"
                icon="play"
                intent={Intent.SUCCESS}
                text=""
              />
            </Tooltip>

            <Tooltip content="Abort query" position={Position.BOTTOM}>
              <AnchorButton
                onClick={this.ignoreQueryResponse}
                className="pt-small pt-minimal"
                icon="stop"
                text=""
                intent={Intent.DANGER}
                disabled={!this.state.loading}
              />
            </Tooltip>

            <NavbarDivider />

            <div className="pt-select pt-dark pt-minimal database-select">
              <select id="select" onChange={this.useDatabase} defaultValue={localStorage.getItem(localStorageVariables.database.use)} >
                {
                  !localStorage.getItem(localStorageVariables.database.use) ? <option value="">select database</option> : null
                }

                {
                  this.state.databaseList.map(value => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ))
                }
              </select>
            </div>

          </NavbarGroup>

          <NavbarGroup align={Alignment.RIGHT} style={{ height: '35px' }}>

            <small style={{ color: '#bfccd6' }}>{this.state.queryStatistics}</small>

            {
              this.state.queryStatistics ? <NavbarDivider /> : null
            }

            <Tooltip content="Keyboard Shortcuts and Help" position={Position.LEFT}>
              <Button
                onClick={this.shortcutsHandleOpen}
                className="pt-small pt-minimal"
                icon="comment"
                text=""
              />
            </Tooltip>

          </NavbarGroup>

        </Navbar>

        <HotKeys keyMap={this.hotKeysMap} handlers={this.hotKeysHandlers}>

          <AceEditor
            style={{
              margin: '0', width: '100%'
            }}
            mode="sql"
            height={this.state.editorHeight}
            theme="chaos"
            onChange={this.onChange}
            onLoad={this.onLoad}
            value={this.state.value}
            defaultValue={this.state.value}
            name="aceEditor"
            editorProps={{ $blockScrolling: true }}
            ref={this.aceEditor}
            setOptions={{
              enableLiveAutocompletion: true,
              showLineNumbers: true,
              tabSize: 2,
              liveAutocompletionThreshold: 1,
              fontSize: '14px'
            }}
          />

        </HotKeys>

        <ReactResizeDetector
          handleHeight
          onResize={this.onResizeEditor}
        />

        <Dialog
          icon="comment"
          isOpen={this.state.shortcutsVisibility}
          onClose={this.shortcutsHandleClose}
          title="Keyboard Shortcuts and Help"
        >
          <div className="pt-dialog-body">

            <h4>Help</h4>
            Select text to run query localized or all text in editor is executed.

            <br /><br /><br />

            <h4>Keyboard Shortcuts</h4>
            <b>CTRL or COMMAND + ENTER</b> -- Launch query

          </div>
        </Dialog>
      </div>
    );
  }
}
