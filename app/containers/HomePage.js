// @flow
import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

import Query from '../components/Query'

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <Layout style={{height:"100vh"}}>

        <Sider style={{backgroundColor:"#CCC"}}>Sider</Sider>

        <Layout>

          <Header style={{backgroundColor:"#444"}}>
            <h1 style={{color: '#FFF'}}>
              <Icon type="share-alt" /> Discovery the future
            </h1>
          </Header>

          <Content>
            <Query/>
          </Content>

          <Footer style={{backgroundColor:"#444"}}>Footer</Footer>
        </Layout>

      </Layout>
    );
  }
}
