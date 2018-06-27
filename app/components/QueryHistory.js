// @flow
import React, { Component } from 'react';
import {
  Dialog,
  Callout,
  Intent,
  Button
} from '@blueprintjs/core';

import { Scrollbars } from 'react-custom-scrollbars';

import moment from 'moment';

import toaster from '../utils/toaster';

import localStorageVariables from '../utils/localStorageVariables';

// TODO: Implement this feature in future
/* const { getGlobal } = require('electron').remote;
const copyToClipboard = getGlobal('copyToClipboard'); */

export default class QueryHistory extends Component {
  constructor() {
    super();

    this.state = {
      visibility: false,
      history: []
    };
  }

  componentWillMount() {
    this.getHistory();
  }

  getHistory = () => {
    const history = localStorage.getItem(localStorageVariables.QUERY_HISTORY) ?
      JSON.parse(localStorage.getItem(localStorageVariables.QUERY_HISTORY)) : [];

    this.setState({
      history: history.reverse()
    });
  };

  handleClearHistory = () => {
    localStorage.setItem(localStorageVariables.QUERY_HISTORY, []);
    this.handleClose();
    toaster.show({
      message: 'The querys history is cleared.',
      intent: Intent.SUCCESS,
      icon: 'tick-circle'
    });
  };

  handleOpen = () => {
    this.getHistory();

    // TODO: Refactor this
    setTimeout(() => {
      if (this.state.history.length === 0) {
        toaster.show({
          message: 'The querys history is empty.',
          intent: Intent.WARNING,
          icon: 'disable'
        });
      } else {
        this.setState({ visibility: true });
      }
    }, 100);
  };

  // TODO: Implement this feature in future
  /* handleCopyQuery = (query) => {
    copyToClipboard(query);

    toaster.show({
      message: 'Query copied to clipboard.',
      intent: Intent.SUCCESS,
      icon: 'tick-circle'
    });
  }; */

  handleClose = () => {
    this.setState({ visibility: false });
  };

  render() {
    return (

      <div>
        <Dialog
          isOpen={this.state.visibility}
          onClose={this.handleClose}
          style={{ width: '1000px' }}
          title="Querys History"
        >

          <br />
          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button
                intent={Intent.DANGER}
                onClick={this.handleClearHistory}
                text="Clear"
                icon="trash"
              />
            </div>
          </div>

          <div className="pt-dialog-body">
            <div style={{ height: '500px' }}>
              <Scrollbars>
                {
                  this.state.history.map(value => (
                    <p key={value.at} className="queryHistory">
                      <Callout intent={value.query.success ? Intent.SUCCESS : Intent.DANGER}>
                        <b><small>{moment(value.at).format('LL LTS')}</small></b>
                        <pre>
                          {value.query.text}
                        </pre>
                        <small><i>{value.query.error || value.query.statistics}</i></small>
                      </Callout>
                    </p>
                  ))
                }
              </Scrollbars>
            </div>
          </div>
        </Dialog>

      </div>
    );
  }
}
