// @flow
import * as React from 'react';

import { Link } from 'react-router-dom';

import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  Tooltip,
  Position,
  AnchorButton,
  Intent
} from '@blueprintjs/core';

import Settings from '../components/Settings';
import About from '../components/About';
import EULA from '../components/EULA';

import localStorageVariables from '../utils/localStorageVariables';

const { getGlobal } = require('electron').remote;

const reload = getGlobal('reload');

export default class App extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      activeButton: 'do-science'
    };
  }

  componentWillMount() {
    setTimeout(() => {
      if (!localStorage.getItem(localStorageVariables.EULA_Acceptance)) {
        this.eula.handleOpen();
      }
    }, 100);
  }

  reload = () => {
    reload();
  };

  openSettings = () => {
    this.settings.handleOpen();
  };

  openAbout = () => {
    this.about.handleOpen();
  };

  activeButton(activeButton) {
    this.setState({ activeButton });
  }

  render() {
    return (
      <div style={{ height: '100vh', display: 'flex', flexFlow: 'column' }}>

        <Settings
          ref={instance => { this.settings = instance; }}
        />

        <About
          ref={instance => { this.about = instance; }}
        />

        <EULA
          ref={instance => { this.eula = instance; }}
        />

        <div style={{ flex: '0 1 auto' }}>
          <Navbar>

            <NavbarGroup align={Alignment.LEFT} className={(localStorage.getItem(localStorageVariables.database.host) === null ? 'hidden' : '')}>

              <Tooltip content="Do Science" position={Position.BOTTOM_RIGHT}>
                <Link to="/" onClick={() => { this.activeButton('do-science'); }}>
                  <Button className={Classes.MINIMAL} active={this.state.activeButton === 'do-science'} icon="layout-auto" intent={this.state.activeButton === 'do-science' ? Intent.PRIMARY : Intent.NONE} text="" />
                </Link>
              </Tooltip>
              <Tooltip content="Process Management" position={Position.BOTTOM}>
                <Link to="/process-list" onClick={() => { this.activeButton('process-list'); }}>
                  <Button className={Classes.MINIMAL} active={this.state.activeButton === 'process-list'} icon="application" intent={this.state.activeButton === 'process-list' ? Intent.PRIMARY : Intent.NONE} text="" />
                </Link>
              </Tooltip>
              <Tooltip content="Server Settings (soon)" position={Position.BOTTOM}>
                <AnchorButton className={Classes.MINIMAL} icon="settings" text="" disabled />
              </Tooltip>
              <Tooltip content="Server Metrics (soon)" position={Position.BOTTOM}>
                <AnchorButton className={Classes.MINIMAL} icon="pulse" text="" disabled />
              </Tooltip>
              <Tooltip content="Replicated Tables (soon)" position={Position.BOTTOM}>
                <AnchorButton className={Classes.MINIMAL} icon="layers" text="" disabled />
              </Tooltip>
              <Tooltip content="Kafka Tables (soon)" position={Position.BOTTOM}>
                <AnchorButton className={Classes.MINIMAL} icon="search-around" text="" disabled />
              </Tooltip>
              <Tooltip content="ClickHouse Proxy (soon)" position={Position.BOTTOM}>
                <AnchorButton className={Classes.MINIMAL} icon="layout-hierarchy" text="" disabled />
              </Tooltip>
              <Tooltip content="Database Topology (soon)" position={Position.BOTTOM}>
                <AnchorButton className={Classes.MINIMAL} icon="layout" text="" disabled />
              </Tooltip>
            </NavbarGroup>

            <NavbarGroup align={Alignment.RIGHT}>

              <Tooltip content="Reload" position={Position.BOTTOM}>
                <Button onClick={this.reload} className={Classes.MINIMAL} icon="refresh" text="" />
              </Tooltip>

              <NavbarDivider />

              <Tooltip content="Settings" position={Position.BOTTOM}>
                <Button onClick={this.openSettings} className={Classes.MINIMAL} icon="cog" text="" intent={Intent.PRIMARY}/>
              </Tooltip>

              <Tooltip content="About" position={Position.BOTTOM}>
                <Button onClick={this.openAbout} className={Classes.MINIMAL} icon="help" text=""  intent={Intent.PRIMARY}/>
              </Tooltip>

            </NavbarGroup>

          </Navbar>
        </div>

        <div style={{ flex: '1 1 auto' }}>
          {this.props.children}
        </div>

        <div style={{ flex: '0 1 auto' }}>
          <Navbar style={{ height: '20px' }} />
        </div>

      </div>
    );
  }
}
