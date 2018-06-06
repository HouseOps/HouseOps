// @flow
import React, { Component } from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Scrollbars } from 'react-custom-scrollbars';

type Props = {
  data: object
};

export default class _Table extends Component<Props> {
  props: Props;

  renderTableColumns() {
    if (this.props.data.meta) {
      const columns = this.props.data.meta.map((value) => ({
        Header: value.name,
        accessor: value.name
      }));

      return columns;
    }

    return [];
  }

  render() {
    return (
      <div style={{ width: '99%', height: '90%', overflow: 'hidden' }}>
        { !this.props.data.data ?
          <div className="cardResult"><h5 style={{ color: '#293742' }}>Wake me when you have results for render...zZzzZzzZz</h5></div>
          : null
        }

        {
          this.props.data.data &&
          this.props.data.meta.length === 1 &&
          this.props.data.data.length === 1 ?
            <div className="cardResult">
              <h1 style={{ color: '#CED9E0' }}>{this.props.data.data[0][this.props.data.meta[0].name]}<br />
                <h3 style={{ color: '#A7B6C2' }}>{this.props.data.meta[0].name}</h3>
              </h1>
            </div>
            : null
        }

        {
          this.props.data.data &&
          (this.props.data.meta.length > 1 || this.props.data.data.length > 1) ?
            <Scrollbars>
              <ReactTable
                data={this.props.data.data}
                filterable
                columns={this.renderTableColumns()}
                className="-striped -highlight"
              />
            </Scrollbars>
            : null
        }
      </div>
    );
  }
}
