// @flow
import React, { Component } from 'react';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';

import { Treebeard, decorators } from 'react-treebeard';

import { Scrollbars } from 'react-custom-scrollbars';

import { Tabs, notification, Button, Layout, Icon } from 'antd';

import axios from 'axios';

const {
  Header, Footer, Sider, Content
} = Layout;

decorators.Toggle = ({ style, node }) => (
  <div style={{
position: 'relative', display: 'inline-block', height: '13px', width: '20px', transform: 'rotateZ(0deg)', marginTop: '4px'
}}>
    <svg height="13px" width="13px" viewBox="0 0 60 140" style={{ fill: '#bbb' }}>
      <g>
        <path d="m40.4,121.3c-0.8,0.8-1.8,1.2-2.9,1.2s-2.1-0.4-2.9-1.2c-1.6-1.6-1.6-4.2 0-5.8l51-51-51-51c-1.6-1.6-1.6-4.2 0-5.8 1.6-1.6 4.2-1.6 5.8,0l53.9,53.9c1.6,1.6 1.6,4.2 0,5.8l-53.9,53.9z" />
      </g>
    </svg>
  </div>
);

decorators.Header = ({ style, node }) => {
  const iconType = node.icon;
  const iconStyle = { marginRight: '5px' };

  if (iconType === 'appstore') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Icon type={iconType} style={{ fontSize: '17px', marginRight: '5px' }} />

          <b style={{ fontSize: '17px' }}>{node.name}</b> <small>({node.total_childrens})</small>

        </div>
      </div>
    );
  } else if (iconType === 'database') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Icon type={iconType} style={{ fontSize: '14px', marginRight: '5px' }} />

          <b>{node.name}</b> <small>({node.total_childrens})</small>

        </div>
      </div>
    );
  } else if (iconType !== '-') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Icon type={iconType} style={iconStyle} />

          <b style={{ fontSize: '13px' }}>{node.name}</b> <small>({node.total_childrens}) - {node.engine}</small>

        </div>
      </div>
    );
  }

  return (
    <div style={style.base}>
      <div style={style.title}>
        <div style={{ marginLeft: '20px', fontSize: '13px' }}>
          <i>{node.name}</i> <small>{node.engine}{node.type}</small>
        </div>
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

    this.getData();

    this.onToggle = this.onToggle.bind(this);
    this.getData = this.getData.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  onToggle(node, toggled) {
    if (this.state.cursor) { this.state.cursor.active = false; }
    node.active = true;
    if (node.children) { node.toggled = toggled; }
    this.setState({ cursor: node });
  }

  async query(query) {
    return await axios.post(localStorage.getItem('database_host'), `${query} FORMAT JSON`);
  }

  async getData() {
    try {
      const databases = await this.query('SHOW databases');

      const db_tree = await Promise.all(databases.data.data.map(async (database) => {
        const tables = await this.query(`SELECT name, engine FROM system.tables WHERE database='${database.name}'`);

        const t_tree = await Promise.all(tables.data.data.map(async (table) => {
          const columns = await this.query(`SELECT * FROM system.columns WHERE database='${database.name}' AND table='${table.name}'`);

          let icon = 'table';

          switch (table.engine) {
            case 'Distributed': icon = 'cloud-o';
              break;
            case 'Kafka': icon = 'share-alt';
              break;
            case 'MaterializedView': icon = 'eye-o';
              break;
            case 'ReplicatedMergeTree': icon = 'copy';
              break;
            case 'MergeTree': icon = 'profile';
              break;
          }

          return {
            icon,
            name: table.name,
            engine: table.engine,
            total_childrens: columns.data.data.length,
            children: columns.data.data.map(value => ({
              icon: '-',
              type: `${value.type} (${parseInt(parseInt(value.data_compressed_bytes, 10) / 1024, 10)} kb)`,
              name: value.name
            }))

          };
        }));

        return {
          name: database.name,
          children: t_tree,
          total_childrens: t_tree.length,
          icon: 'database',
        };
      }));

      this.setState({
        data: {
          icon: 'appstore',
          name: 'Databases',
          toggled: true,
          children: db_tree,
          total_childrens: db_tree.length,
        }
      });
    } catch (err) {
      notification.error({
        message: 'Ops...',
        description: `${err.message} - Check your database!`,
        duration: 0
      });
    }
  }

  refreshData() {
    this.getData();

    notification.destroy();

    notification.success({
      message: 'Refreshed!'
    });
  }

  render() {
    return (


      <Content style={{ background: '#333', height: '100vh' }}>

        <Content style={{ padding: '10px', marginTop: '-30px' }}>
          <Button
            style={{ marginTop: '2vh', width: '100%' }}
            type="dashed"
            icon="reload"
            loading={this.state.loading}
            onClick={this.refreshData}
          />
        </Content>

        <Scrollbars style={{ height: '80vh' }}>
          <Content style={{ padding: '10px' }}>
            <Treebeard data={this.state.data} decorators={decorators} onToggle={this.onToggle} />
          </Content>
        </Scrollbars>

      </Content>

    );
  }
}
