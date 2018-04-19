// @flow
import React, { Component } from 'react';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';

import './SideBar.css'

import {Treebeard, decorators} from 'react-treebeard';

import { Scrollbars } from 'react-custom-scrollbars';

import { Tabs, notification, Button, Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

import axios from 'axios';

decorators.Header = ({style, node}) => {

  const iconType = node.children ? 'database' : 'table';
  const iconClass = `fa fa-${iconType}`;
  const iconStyle = {marginRight: '5px'};

  return (
    <div style={style.base}>
      <div style={style.title}>
        <i className={iconClass} style={iconStyle}/>
        {node.name} <small>{node.engine}{node.type}</small>
      </div>
    </div>
  );

};

export default class SideBar extends Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      data: {}
    };

    this.getData()

    this.onToggle = this.onToggle.bind(this);
    this.getData = this.getData.bind(this);
    this.refreshData = this.refreshData.bind(this);

  }

  onToggle(node, toggled){
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ cursor: node });
  }

  async query(query){
    return await axios.post(localStorage.getItem('database_host'), `${query} FORMAT JSON`)
  }

  async getData(){

    try{

      const databases = await this.query('SHOW databases');

      const db_tree = await Promise.all(

        databases.data.data.map(async (database) => {

          const tables = await this.query(`SELECT name, engine FROM system.tables WHERE database='${database.name}'`);

          const t_tree = await Promise.all(

            tables.data.data.map(async (table) => {

              const columns = await this.query(`SELECT * FROM system.columns WHERE database='${database.name}' AND table='${table.name}'`);

              return {
                name: table.name,
                engine: table.engine,
                children: columns.data.data
              }

            })

          );

          return {
            name: database.name,
            children: t_tree
          }

        })

      );

      this.setState({
        data:{
          name: 'Databases',
          toggled: true,
          children: db_tree
        }
      })

    }
    catch(err){

      notification.error({
        message: 'Ops...',
        description: err.message + ' - Check your database!',
        duration: 0
      })

    }

  }

  refreshData(){

    this.getData();

    notification.destroy();

    notification.success({
      message: 'Refreshed!'
    });

  }

  render() {

    return (


        <Content style={{background: '#333'}}>

          <Content style={{padding: '10px', marginTop: '-30px'}}>
            <Button style={{marginTop: '2vh', width: '100%'}} type="dashed" icon="reload" loading={this.state.loading}
                    onClick={this.refreshData}>
            </Button>
          </Content>

          <Scrollbars style={{height: '90vh'}}>

            <Content style={{padding:'10px'}}>
              <Treebeard data={this.state.data} decorators={decorators} onToggle={this.onToggle}/>
            </Content>

          </Scrollbars>

        </Content>

    );
  }
}
