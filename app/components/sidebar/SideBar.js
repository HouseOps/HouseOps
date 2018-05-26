// @flow
import React, { Component } from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import { Treebeard, decorators } from 'react-treebeard';
import treeStyle from './TreeStyle';
import treeHeader from './TreeHeader';
import treeToggle from './TreeToggle';

import query from '../../utils/query';

decorators.Toggle = treeToggle;
decorators.Header = treeHeader;

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
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true; // eslint-disable-line
    if (node.children) {
      node.toggled = toggled;
    } // eslint-disable-line
    this.setState({cursor: node});
  }

  async getData() {
    try {
      const databases = await query('SHOW databases');

      const dbTree = await Promise.all(databases.data.data.map(async (database) => {
        const tables = await query(`SELECT name, engine FROM system.tables WHERE database='${database.name}'`);

        this.autoCompleteCollection.push({
          name: database.name, value: database.name, score: 1, meta: 'database - HouseOps'
        });

        const tableTree = await Promise.all(tables.data.data.map(async (table) => {
          const columns = await query(`SELECT * FROM system.columns WHERE database='${database.name}' AND table='${table.name}'`);

          this.autoCompleteCollection.push({
            name: table.name, value: table.name, score: 1, meta: 'table - HouseOps'
          });

          let rows = null;

          if (table.engine === 'ReplicatedMergeTree' || table.engine === 'Distributed' || table.engine === 'MergeTree') {
            rows = await query(`SELECT count(*) as total FROM ${database.name}.${table.name}`);

            rows = parseInt(rows.data.data[0].total, 10);
          }

          let icon = 'table';

          switch (table.engine) {
            case 'Distributed':
              icon = 'cloud';
              break;
            case 'Kafka':
              icon = 'search-around';
              break;
            case 'MaterializedView':
              icon = 'eye-open';
              break;
            case 'ReplicatedMergeTree':
              icon = 'duplicate';
              break;
            case 'MergeTree':
              icon = 'column-layout';
              break;
            default:
              icon = 'th';
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
      // TODO: Solve this
      /* notification.error({
            message: 'Ops...',
            description: `${err.message} - Check your database!`,
            duration: 0
          }); */
    }
  }

  refreshData() {
    this.getData();

    // TODO: Solve this
    /* notification.destroy();

     notification.success({
       message: 'Refreshed!'
     }); */
  }

  render() {
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
