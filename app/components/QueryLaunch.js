// @flow
import React, {Component} from 'react';

import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarGroup,
  Tooltip,
  Position,
  Dialog,
  Intent,
  Alert,
  InputGroup
} from '@blueprintjs/core';

import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/chaos';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';
import ace from 'brace';

import ReactResizeDetector from 'react-resize-detector';

import {HotKeys} from 'react-hotkeys';

import {Scrollbars} from 'react-custom-scrollbars';

import JSONTree from 'react-json-tree';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import {toaster} from '../utils/toaster';
import executeQuery from '../utils/query';

const {getGlobal} = require('electron').remote;

const trackEvent = getGlobal('trackEvent');

const langTools = ace.acequire('ace/ext/language_tools');

export default class QueryLaunch extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: '',
      editorHeight: '200px',
      shortcutsVisibility: false,
      loading: false,
      confirmDropModalVisible: false,
      response: {},
      table_columns: [],
      table_data: []
    };

    this.aceEditor = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onQuery = this.onQuery.bind(this);
    this.confirmModalCancel = this.confirmModalCancel.bind(this);
    this.confirmModalOk = this.confirmModalOk.bind(this);
    this.onResizeEditor = this.onResizeEditor.bind(this);

    this.autoCompleter();
  }

  hotKeysMap = {
    execute: ['ctrl+enter', 'command+enter']
  };

  hotKeysHandlers = {
    execute: () => this.onQuery()
  };

  onResizeEditor() {
    const height = document.getElementById('editor').clientHeight;

    this.setState({
      editorHeight: `${height - 35}px`
    });
  }

  onLoad() {
    const value = localStorage.getItem('query') ? localStorage.getItem('query') : '';

    this.setState({
      value
    });

    setTimeout(() => {
      this.onResizeEditor();
    }, 100);
  }

  autoCompleter() { //eslint-disable-line
    setInterval(() => {
      const customCompleter = {
        getCompletions: (editor, session, pos, prefix, callback) => {
          callback(null, JSON.parse(localStorage.getItem('autoCompleteCollection')));
        }
      };

      langTools.completer = null;

      langTools.addCompleter(customCompleter);
    }, 1000);
  }

  onChange(newValue) {
    localStorage.setItem('query', newValue);

    this.setState({
      value: newValue
    });
  }

  renderTableColumns(response) {
    const columns = response.data.meta.map((value) => ({
      Header: value.name,
      accessor: value.name
    }));

    this.setState({
      table_columns: columns
    });
  }

  getHost() { //eslint-disable-line
    if (localStorage.getItem('database_user') && localStorage.getItem('database_pass')) {
      return `http://${localStorage.getItem('database_user')}:${localStorage.getItem('database_pass')}@${localStorage.getItem('database_host').replace('http://', '')}`;
    }

    return localStorage.getItem('database_host');
  }

  handleConfirmDROP = (e) => this.setState({confirmDROP: e.target.value});

  confirmModalCancel() {
    this.setState({
      confirmDropModalVisible: false,
      loading: false
    });
  }

  confirmModalOk() {

    if (this.state.confirmDROP === 'DROP') {
      this.setState({
        confirmDropModalVisible: false
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

  }

  async query(content) {
    trackEvent('User Interaction', 'QueryLaunch executed');
    return executeQuery(content);
  }

  getQuery() {
    if (this.aceEditor.current.editor.getSelectedText().length > 0) {
      return this.aceEditor.current.editor.getSelectedText();
    }

    return this.state.value;
  }

  async onQuery(e, dropConfirmation = false) {
    if (!this.state.loading) {
      try {
        const query = this.getQuery();

        if (!dropConfirmation && query.toLowerCase().indexOf('drop') > -1) {
          this.setState({
            confirmDropModalVisible: true
          });

          return;
        }

        this.setState({
          loading: true
        });

        const response = await this.query(query);

        if (response.data) {
          this.renderTableColumns(response);
        }

        this.setState({
          response,
          table_data: response ? response.data.data : [],
          loading: false
        });

        if (response.data) {
          toaster.show({
            message: `Return ${response.data.rows} rows, elapsed ${response.data.statistics.elapsed.toFixed(3)}ms, process ${response.data.statistics.rows_read} rows in ${parseFloat(response.data.statistics.bytes_read / 10480576).toFixed(2)}Mb.`,
            intent: Intent.SUCCESS,
            icon: 'tick-circle',
            timeout: 5000
          });
        } else {
          toaster.show({
            message: 'Your query running ok.',
            intent: Intent.SUCCESS,
            icon: 'tick-circle',
            timeout: 5000
          });
        }
      } catch (err) {
        console.error(err);

        toaster.show({
          message: err.response && err.response.data ? `${err.message} - ${err.response.data}` : `${err.message}`,
          intent: Intent.DANGER,
          icon: 'error',
          timeout: 0
        });

        this.setState({
          table_data: [],
          table_columns: [],
          response: {},
          loading: false
        });
      }
    }
  }

  shortcutsHandleClose = () => {
    this.setState({shortcutsVisibility: false});
  };
  shortcutsHandleOpen = () => {
    this.setState({shortcutsVisibility: true});
  };

  render() {
    return (
      <div id="editor" style={{height: '100%'}}>

        <Alert
          isOpen={this.state.confirmDropModalVisible}
          intent={Intent.DANGER}
          icon="trash"
          cancelButtonText="No, you save me."
          confirmButtonText="Yes, I want!"
          onConfirm={this.confirmModalOk}
          onCancel={this.confirmModalCancel}
        >
          <div>
            <s><b>Oh my god</b></s>, you <b>really want</b> to execute <b>DROP</b> command?
            <br/><br/>

            <small>Type <b>DROP</b> to confirm:</small>
            <InputGroup type="text" className="pt-input-group" value={this.state.confirmDROP}
                        onChange={this.handleConfirmDROP}/>
            <br/>
          </div>
        </Alert>

        <Navbar style={{height: '35px', marginTop: '0px', marginLeft: '0px', zIndex: '0', backgroundColor: '#293742'}}>

          <NavbarGroup align={Alignment.LEFT} style={{height: '35px'}}>

            <Tooltip content="Launch query" position={Position.BOTTOM}>
              <Button loading={this.state.loading} onClick={this.onQuery} className="pt-small pt-minimal" icon="play"
                      text=""/>
            </Tooltip>

          </NavbarGroup>

          <NavbarGroup align={Alignment.RIGHT} style={{height: '35px'}}>

            <Tooltip content="Keyboard Shortcuts and Help" position={Position.BOTTOM}>
              <Button onClick={this.shortcutsHandleOpen} className={Classes.MINIMAL} icon="comment" text=""/>
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
            editorProps={{$blockScrolling: true}}
            ref={this.aceEditor}
            setOptions={{
              enableLiveAutocompletion: true,
              showLineNumbers: true,
              tabSize: 2
            }}
          />

        </HotKeys>

        <ReactResizeDetector handleHeight onResize={this.onResizeEditor}/>

        <Dialog
          icon="comment"
          isOpen={this.state.shortcutsVisibility}
          onClose={this.shortcutsHandleClose}
          title="Keyboard Shortcuts and Help"
        >
          <div className="pt-dialog-body">

            <h4>Help</h4>
            Select text to run query localized or all text in editor is executed.

            <br/><br/><br/>

            <h4>Keyboard Shortcuts</h4>
            <b>CTRL or COMMAND + ENTER</b> -- Launch query

          </div>
        </Dialog>
      </div>
    );
  }
}
