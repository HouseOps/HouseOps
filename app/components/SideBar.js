// @flow
import React, { Component } from 'react';

import {
  Icon,
  Tooltip
} from '@blueprintjs/core';

import { Treebeard, decorators } from 'react-treebeard';

import { Scrollbars } from 'react-custom-scrollbars';

import axios from 'axios';

decorators.Toggle = () => (
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

decorators.Header = ({ style, node }) => { // eslint-disable-line
  const iconType = node.icon;
  const iconStyle = { marginRight: '7px', marginTop: '3px' };

  if (iconType === 'appstore') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Icon icon={iconType} style={iconStyle} />

          <b style={{ fontSize: '17px' }}>{node.name}</b> <small>({node.total_childrens})</small>

        </div>
      </div>
    );
  } else if (iconType === 'database') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Icon icon={iconType} style={iconStyle} />

          <b>{node.name}</b> <small>({node.total_childrens})</small>

        </div>
      </div>
    );
  } else if (iconType !== '-') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Icon icon={iconType} style={iconStyle} />

          <b style={{ fontSize: '13px' }}>{node.name}&nbsp;&nbsp;</b>

          <Tooltip placement="topLeft" title={`${node.rows} rows`} >
            <small className={node.rows === null ? 'hidden' : ''}><Icon type="question-circle-o" style={iconStyle} /></small>
          </Tooltip>

          <small>({node.total_childrens})&nbsp;&nbsp;{node.engine}</small>

        </div>
      </div>
    );
  }

  return (
    <div style={style.base}>
      <div style={style.title}>
        <div style={{ marginLeft: '20px', fontSize: '13px' }}>
          <i><b>{node.name}</b></i> <small>{node.engine}{node.type}</small>
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

    this.autoCompleteCollection = [];

    this.getData();

    this.onToggle = this.onToggle.bind(this);
    this.getData = this.getData.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  onToggle(node, toggled) {
    if (this.state.cursor) { this.state.cursor.active = false; }
    node.active = true; // eslint-disable-line
    if (node.children) { node.toggled = toggled; } // eslint-disable-line
    this.setState({ cursor: node });
  }

  async query(query) { // eslint-disable-line
    return axios.post(localStorage.getItem('database_host'), `${query} FORMAT JSON`);
  }

  async getData() {
    try {
      const databases = await this.query('SHOW databases');

      const dbTree = await Promise.all(databases.data.data.map(async (database) => {
        const tables = await this.query(`SELECT name, engine FROM system.tables WHERE database='${database.name}'`);

        this.autoCompleteCollection.push({
          name: database.name, value: database.name, score: 1, meta: 'database - HouseOps'
        });

        const tableTree = await Promise.all(tables.data.data.map(async (table) => {
          const columns = await this.query(`SELECT * FROM system.columns WHERE database='${database.name}' AND table='${table.name}'`);

          this.autoCompleteCollection.push({
            name: table.name, value: table.name, score: 1, meta: 'table - HouseOps'
          });

          let rows = null;

          if (table.engine === 'ReplicatedMergeTree' || table.engine === 'Distributed' || table.engine === 'MergeTree') {
            rows = await this.query(`SELECT count(*) as total FROM ${database.name}.${table.name}`);

            rows = parseInt(rows.data.data[0].total, 10);
          }

          let icon = 'table';

          switch (table.engine) {
            case 'Distributed': icon = 'cloud';
              break;
            case 'Kafka': icon = 'search-around';
              break;
            case 'MaterializedView': icon = 'eye-open';
              break;
            case 'ReplicatedMergeTree': icon = 'duplicate';
              break;
            case 'MergeTree': icon = 'column-layout';
              break;
            default: icon = 'th';
          }

          columns.data.data.forEach((value) => {
            this.autoCompleteCollection.push({
              name: value.name, value: value.name, score: 1, meta: `column / ${value.type} - HouseOps`
            });
          });

          return {
            icon,
            name: table.name,
            engine: table.engine,
            rows,
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
          children: tableTree,
          total_childrens: tableTree.length,
          icon: 'database',
        };
      }));

      this.setState({
        data: {
          icon: 'appstore',
          name: 'Databases',
          toggled: true,
          children: dbTree,
          total_childrens: dbTree.length,
        }
      });


      localStorage.setItem('autoCompleteCollection', JSON.stringify(this.autoCompleteCollection));
    } catch (err) {
      /*    notification.error({
            message: 'Ops...',
            description: `${err.message} - Check your database!`,
            duration: 0
          });*/
    }
  }

  refreshData() {
    this.getData();

    /* notification.destroy();

     notification.success({
       message: 'Refreshed!'
     });*/
  }

  render() {
    const treeStyle = {
      tree: {
        base: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: '14px',
          height: '90%'
        },
        node: {
          base: {
            position: 'relative'
          },
          link: {
            cursor: 'pointer',
            position: 'relative',
            padding: '0px 5px',
            display: 'block'
          },
          activeLink: {
            background: 'transparent'
          },
          toggle: {
            base: {
              position: 'relative',
              display: 'inline-block',
              verticalAlign: 'top',
              marginLeft: '-5px',
              height: '24px',
              width: '24px'
            },
            wrapper: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              margin: '-7px 0 0 -7px',
              height: '14px'
            },
            height: 14,
            width: 14,
            arrow: {
              fill: '#9DA5AB',
              strokeWidth: 0
            }
          },
          header: {
            base: {
              display: 'inline-block',
              verticalAlign: 'top',
              color: '#DDD'
            },
            connector: {
              width: '2px',
              height: '12px',
              borderLeft: 'solid 2px black',
              borderBottom: 'solid 2px black',
              position: 'absolute',
              top: '0px',
              left: '-21px'
            },
            title: {
              lineHeight: '24px',
              verticalAlign: 'middle'
            }
          },
          subtree: {
            listStyle: 'none',
            paddingLeft: '19px'
          },
          loading: {
            color: '#E2C089'
          }
        }
      }
    };

    return (


      <div style={{marginTop: '10px'}}>
        <Scrollbars>
          <Treebeard
            data={this.state.data}
            decorators={decorators}
            onToggle={this.onToggle}
            style={treeStyle}
          />
        </Scrollbars>
      </div>

    );
  }
}
