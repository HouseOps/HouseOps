// @flow
import React, { Component } from 'react';

import { Intent, Button } from '@blueprintjs/core';

import { Scrollbars } from 'react-custom-scrollbars';

import { Treebeard, decorators } from 'react-treebeard';
import treeStyle from './TreeStyle';
import treeHeader from './TreeHeader';
import treeToggle from './TreeToggle';

import toaster from '../../utils/toaster';

import { runQuery } from '../../utils/query';
import localStorageVariables from '../../utils/localStorageVariables';

decorators.Toggle = treeToggle;
decorators.Header = treeHeader;

export default class DatabaseTree extends Component {
  constructor() {
    super();

    this.state = {
      data: {},
      error: false,
      loading: true
    };

    this.autoCompleteCollection = [];
  }

  componentWillMount() {
    if (localStorage.getItem(localStorageVariables.database.host)) {
      this.getData();
    }
  }

  onToggle = (node, toggled) => {
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true; // eslint-disable-line
    if (node.children) {
      node.toggled = toggled; // eslint-disable-line
    }
    this.setState({ cursor: node });
  };

  getData = async () => {
    try {
      const databases = await runQuery('SHOW databases').catch((err) => {
        console.log(err);
        toaster.show({
          message: `Error to connect in your database: ${err.message}`,
          intent: Intent.DANGER,
          icon: 'error',
          timeout: 0
        });
      });

      const dbTree = await Promise.all(databases.data.data.map(async (database) => {
        this.autoCompleteCollection.push({
          name: database.name, value: database.name, score: 1, meta: 'database'
        });

        const enginesAndTables = await runQuery(`SELECT engine, groupArray(name) as tables FROM (select * from system.tables where database='${database.name}') group by engine`);

        const enginesAndTablesTree = await Promise.all(enginesAndTables.data.data.map(async (engine) => {
          let icon = 'table';

          switch (engine.engine) {
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

          return {
            icon,
            name: engine.engine,
            // rows,
            total_childrens: engine.tables.length,
            children: await Promise.all(engine.tables.map(async (table) => {
              const columns = await runQuery(`SELECT * FROM system.columns WHERE database='${database.name}' AND table='${table}'`);

              // let rows = null;
              try {
                // rows = await runQuery(`SELECT count(*) as total FROM ${database.name}.${table}`);
                // rows = parseInt(rows.data.data[0].total, 10);
              } catch (err) {
                console.log(err);
              }

              return {
                name: table,
                // rows,
                total_childrens: columns.data.data.length,
                children: columns.data.data.map(value => ({
                  icon: '-',
                  type: `${value.type}`,
                  columnSize: value.data_compressed_bytes,
                  name: value.name
                }))
              };

            }))
          };
        }));

        return {
          name: database.name,
          children: enginesAndTablesTree,
          total_childrens: enginesAndTablesTree.length,
          icon: 'database',
        };
      }));

      const databaseAlias = localStorage.getItem(localStorageVariables.database.alias);

      this.setState({
        data: {
          icon: 'appstore',
          name: databaseAlias || 'server alias',
          database_host: localStorage.getItem(localStorageVariables.database.host),
          toggled: true,
          error: false,
          children: dbTree,
          total_childrens: dbTree.length,
        }
      });

      localStorage.setItem('autoCompleteCollection', JSON.stringify(this.autoCompleteCollection));

      this.setState({
        loading: false
      });
    } catch (err) {
      this.setState({ error: true });
    }
  };

  refreshData = () => {
    this.getData();
  };

  render() {
    return (
      <div
        style={{ padding: '10px', width: '100%', backgroundColor: '#30404D' }}
      >
        { this.state.loading ?
          <Button
            className="pt-small pt-minimal"
            text=""
            loading={this.state.loading || this.state.autoUpdate}
          /> : null
        }

        { !this.state.loading && !this.state.error ?
          <Scrollbars>
            <div
              style={{ marginTop: '10px', width: '500px', overflow: 'hidden' }}
            >
              <Treebeard
                data={this.state.data}
                decorators={decorators}
                onToggle={this.onToggle}
                style={treeStyle}
              />
            </div>
          </Scrollbars>
          : null
        }

        { this.state.error ?
          <span style={{ color: '#738694' }}>Error in connection...</span>
          : null
        }
      </div>
    );
  }
}


/* const columns = await runQuery(`SELECT * FROM system.columns WHERE database='${database.name}' AND table='${table.name}'`);

          this.autoCompleteCollection.push({
            name: table.name, value: table.name, score: 1, meta: 'table - HouseOps'
          });

          let rows = null;

          try {
            if (table.engine === 'ReplicatedMergeTree' || table.engine === 'Distributed' || table.engine === 'MergeTree') {
              rows = await runQuery(`SELECT count(*) as total FROM ${database.name}.${table.name}`);
              rows = parseInt(rows.data.data[0].total, 10);
            }
          } catch (err) {
            console.log(err);
            toaster.show({
              message: `Error in count rows on Database tree: ${err.message}`,
              intent: Intent.DANGER,
              icon: 'error',
              timeout: 0
            });
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
          }); */
