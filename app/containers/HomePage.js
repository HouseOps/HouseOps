// @flow
import React, { Component } from 'react'
import { Layout, Button } from 'antd'
import SplitPane from 'react-split-pane'
const { Header, Content } = Layout;

import Query from '../components/Query'
import SideBar from '../components/SideBar'
import DatabaseConnConfiguration from '../components/DatabaseConnConfiguration'

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  openSettings = () => {
    this.databaseConnConfiguration.handleOpen()
  };

  reload = () => {
    location.reload(true);
  };

  render() {
    return (

      <Layout>

        <Header style={{backgroundColor: "#222"}}>

          <div style={{float: 'left'}}>
            <h1 style={{color: '#FFF'}}>
              HouseDash
            </h1>
          </div>

          <div style={{float: 'right'}}>

            <Button style={{margin: '1vh'}} type="secondary" icon="reload"
                    onClick={this.reload}>
            </Button>

            <Button style={{margin: '1vh'}} type="primary" icon="setting"
                    onClick={this.openSettings}>
              Database Settings
            </Button>

          </div>

        </Header>

        <Content>

          <SplitPane split="vertical" minSize={200} defaultSize={370} maxSize={470}>
            <SideBar/>
            <Query/>
          </SplitPane>

        </Content>


        <DatabaseConnConfiguration ref={instance => { this.databaseConnConfiguration = instance; }} />



      </Layout>

    );
  }
}
