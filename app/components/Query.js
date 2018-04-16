// @flow
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';

import { Tabs, notification, Button } from 'antd';
const TabPane = Tabs.TabPane;



import axios from 'axios';
import JSONTree from 'react-json-tree'

import ReactTable from "react-table";
import "react-table/react-table.css";

export default class Query extends Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      value: 'select * from teste.examples',
      response: {},
      table_columns: [],
      table_data: [],
      iconLoading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onQuery = this.onQuery.bind(this);
    this.onLoad = this.onLoad(this);

  }

  onChange(newValue) {

    this.setState({
      value: newValue
    })

  }

  onLoad(editor) {

  }

  makeColumnsTable(response){

    const a = response.data.meta.map((value, key) => {

      return {
        Header: value.name,
        accessor: value.name
      }

    });

    console.log(a);

    this.setState({
      table_columns: a
    })

  }

  onQuery() {

    const s = this;

    this.setState({
      iconLoading: true
    });

    /*elapsed:0.006271266
rows_read:5001
bytes_read:762090*/

    axios.post('http://localhost:8123', `${this.state.value} FORMAT JSON`)
      .then(function (response) {

        s.makeColumnsTable(response);

        notification.info({
          message: 'Wow!',
          description: `Elapsed ${response.data.statistics.elapsed.toFixed(3)}ms and read ${response.data.statistics.rows_read} rows with ${parseFloat(response.data.statistics.bytes_read / 10480576).toFixed(2)}Mb.`,
          duration: 9999
        });

        s.setState({
          response: response,
          table_data: response.data.data,
          iconLoading: false
        })

      })
      .catch(function (error) {

        notification.error({
          message: 'Ops...',
          description: error.response.data,
          duration: 0
        });

        s.setState({
          response: {},
          iconLoading: false
        })

      });

  }

  render() {

    return (

      <div>

        <AceEditor
          style={{width:'100%'}}
          mode="sql"
          theme="monokai"
          onChange={this.onChange}
          onLoad={this.onLoad}
          value={this.state.value}
          defaultValue={this.state.value}
          name="aceEditor"
          editorProps={{$blockScrolling: true}}
          setOptions={{
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 2
          }}
        />

        <Button style={{margin: '1vh'}} type="primary" icon="rocket" loading={this.state.iconLoading} onClick={this.onQuery}>
          Launch query
        </Button>

        <Tabs defaultActiveKey="1">

          <TabPane tab="Table View" key="1">
            <ReactTable
              data={this.state.table_data}
              columns={this.state.table_columns}
              defaultPageSize={5}
              className="-striped -highlight"
            />
          </TabPane>

          <TabPane tab="JSON Result" key="2">
            <JSONTree data={this.state.response} />
          </TabPane>

        </Tabs>

      </div>


    );
  }
}
