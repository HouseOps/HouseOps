// @flow
import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

import Query from '../components/Query'
import SideBar from '../components/SideBar'

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <Layout style={{height:"100vh"}}>

        <Header style={{backgroundColor:"#222"}}>
          <h1 style={{color: '#FFF'}}>
            HouseDash
          </h1>
        </Header>

        <Layout>

          <Sider style={{backgroundColor:"#CCC"}}>
            <SideBar/>
          </Sider>

          <Layout>

            <Header style={{backgroundColor:"#444"}}>
              <h2 style={{color: '#FFF'}}>
                Discovery section
              </h2>
            </Header>

            <Content>
              <Query/>
            </Content>

            <Footer style={{backgroundColor:"#444", color:'#FFF'}}>Footer</Footer>

          </Layout>

        </Layout>

      </Layout>
    );
  }
}
