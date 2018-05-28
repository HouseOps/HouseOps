// @flow
import React, { Component } from 'react';

import { Tab, Tabs, TabId } from '@blueprintjs/core';

import Table from './Table';
import JSONObject from './JSONObject';

export default class QueryResults extends Component<Props> {
  constructor() {
    super();

    this.state = {
      navbarTabId: 'table'
    };

    setTimeout(() => {
      this.setState({ navbarTabId: 'table' });
    }, 200);
  }

  handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() {
    return (
      <div
        style={{
          paddingLeft: '20px', backgroundColor: '#394B59', height: '100%', overflow: 'hidden'
        }}
      >
        <Tabs
          id="TabsExample"
          animate="true"
          large="true"
          onChange={this.handleNavbarTabChange}
          selectedTabId={this.state.navbarTabId}
          renderActiveTabPanelOnly="true"
        >
          <Tab id="table" title="Table"panel={<Table data={this.props.data} />} />
          <Tab id="jsonObject" title="JSON Object"panel={<JSONObject data={this.props.data} />} />
        </Tabs>
      </div>
    );
  }
}
