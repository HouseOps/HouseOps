// @flow
import React, { Component } from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Scrollbars } from 'react-custom-scrollbars';

export default class _Table extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      table_data: [],
      table_columns: []
    }

  }

  renderTableColumns() {

    if (this.props.data.meta) {
      const columns = this.props.data.meta.map((value) => ({
        Header: value.name,
        accessor: value.name
      }));

      return columns;
    } else {
      return [];
    }

  }

  render() {
    return (
      <div style={{width: '99%', height: '95%', overflow: 'hidden'}}>

        { this.props.data.data ?
          <Scrollbars>
            <ReactTable
              data={this.props.data.data}
              columns={this.renderTableColumns()}
              className="-striped -highlight"
            />
          </Scrollbars>
          : <h5 style={{color: '#293742'}}>Wake me when you have results for me render...zZzzZzzZz</h5>
        }

      </div>
    );
  }
}
