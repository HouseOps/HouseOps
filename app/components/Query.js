// @flow
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';

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
      res_error: '',
      table_columns: [],
      table_data: []
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

    axios.post('http://localhost:8123', `${this.state.value} FORMAT JSON`)
      .then(function (response) {

        s.makeColumnsTable(response);

        s.setState({
          response: response,
          res_error: '',
          table_data: response.data.data
        })

      })
      .catch(function (error) {

        s.setState({
          response: {},
          res_error: error.response.data
        })

      });

  }

  render() {

    return (

      <div>

        <div id="statusBar">ace rocks!</div>

        <AceEditor
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

        <p>{this.state.res_error}</p>

        <button onClick={this.onQuery}> Make Query!! </button>

        <JSONTree data={this.state.response} />

        <div>
          <ReactTable
            data={this.state.table_data}
            columns={this.state.table_columns}
            defaultPageSize={5}
            className="-striped -highlight"
          />
          <br />
        </div>



      </div>


    );
  }
}
