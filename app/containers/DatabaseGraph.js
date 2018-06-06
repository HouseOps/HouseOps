// @flow
import React, { Component } from 'react';

import Graph from 'react-graph-vis';

import {
  Alignment,
  Button,
  Navbar,
  NavbarGroup,
  Tooltip,
  Position,
  Intent
} from '@blueprintjs/core';

import query from '../utils/query';
import toaster from '../utils/toaster';

const { getGlobal } = require('electron').remote;

const screenView = getGlobal('screenView');

if (process.env.NODE_ENV === 'production') {
  screenView('ServerSettings');
}
export default class DatabaseGraph extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: {
        nodes: [],
        edges: []
      }
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.makeGraph();
    }, 100);
  }

  async makeGraph() {
    this.setState({
      loading: true
    });

    try {
      const nodes = [];
      const edges = [];

      const databases = await query('select * from system.databases');
      const tables = await query('select * from system.tables');
      const columns = await query('select * from system.columns');

      nodes.push({
        id: `db_${localStorage.getItem('Database_Alias')}`,
        label: `<b>${localStorage.getItem('Database_Alias')}</b>\n<i>${localStorage.getItem('Database_Host')}</i>`,
        shape: 'dot',
        color: '#fff',
        size: 100,
        font: {
          size: 20,
          multi: true
        },
        mass: 10
      });

      databases.data.data.forEach(value => {

        nodes.push({
          id: value.name,
          label: value.name,
          shape: 'dot',
          color: '#DB3737',
          size: 40,
          font: {
            size: 16,
            bold: true
          },
          mass: 10
        });

        edges.push({
          from: value.name,
          to: `db_${localStorage.getItem('Database_Alias')}`,
          arrows: {
            to: {
              enabled: false
            },
            from: {
              enabled: false
            }
          },
          width: 0.15,
          smooth: {
            type: 'continuous'
          }
        });

      });

      tables.data.data.forEach(async table => {

        nodes.push({
          id: `t_${table.name}`,
          label: `<b>${table.name}</b>\n<i>${table.engine}</i>`,
          shape: 'dot',
          color: '#F2B824',
          size: 20,
          font: {
            size: 10,
            multi: true
          },
          mass: 20
        });

        edges.push({
          from: `t_${table.name}`,
          to: table.database,
          arrows: {
            to: {
              enabled: false
            },
            from: {
              enabled: false
            }
          },
          width: 0.15,
          smooth: {
            type: 'continuous'
          }
        });

      });

      columns.data.data.forEach((column) => {
        nodes.push({
          id: `c_${column.name}_${column.table}`,
          label: `<b>${column.name}</b>\n<i>${column.type} | ${parseInt(parseInt(column.data_compressed_bytes, 10) / 1024, 10)}kb</i>`,
          shape: 'dot',
          color: '#48AFF0',
          size: 4,
          font: {
            size: 6,
            multi: true
          },
          mass: 1
        });

        edges.push({
          from: `c_${column.name}_${column.table}`,
          to: `t_${column.table}`,
          width: 0.2,
          smooth: {
            type: 'continuous'
          },
          arrows: {
            to: {
              enabled: false
            },
            from: {
              enabled: false
            }
          }
        });
      });

      this.setState({
        data: {
          nodes,
          edges
        }
      });
    } catch (e) {
      toaster.show({
        message: `Error: ${e.message}`,
        intent: Intent.DANGER,
        icon: 'error'
      });
    }

    this.setState({ loading: false });
  }

  handleSearch = (e) => {

    if (!this.state.cache_data) {
      this.setState({ cache_data: this.state.data });
    }

    const data = this.state.cache_data.filter(value => value.name.indexOf(e.target.value.toLowerCase()) > -1);

    this.setState({
      data
    });

  };

  render() {

    const options = {
      physics: {
        stabilization: false,
        maxVelocity: 60,
        solver: 'barnesHut'
      },
      autoResize: true,
      layout: {
        hierarchical: false
      },
      nodes: {
        font: {
          color: '#fff'
        }
      },
      edges: {
        smooth: true
      }
    };

    return (

      <div>

        <Navbar
          style={{
            height: '35px', marginTop: '0px', marginLeft: '0px', zIndex: '0', backgroundColor: '#293742'
          }}
        >

          <NavbarGroup align={Alignment.LEFT} style={{ height: '35px' }}>

            <Tooltip content="Refresh" position={Position.TOP}>
              <Button
                onClick={() => {
                  this.makeGraph();
                }}
                className="pt-small pt-minimal"
                icon="refresh"
                text=""
                loading={this.state.loading || this.state.autoUpdate}
              />
            </Tooltip>

          </NavbarGroup>

        </Navbar>

        <div className="database-topology">
          <Graph graph={this.state.data} options={options} />
        </div>
      </div>

    );
  }
}
