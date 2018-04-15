// @flow
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';

import axios from 'axios';
import JSONTree from 'react-json-tree'

export default class Query extends Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      value: '',
      response: {},
      res_error: ''
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

  onQuery() {

    const s = this;

    axios.post('http://localhost:8123', `${this.state.value} FORMAT JSON`)
      .then(function (response) {

        s.setState({
          response: response
        })

      })
      .catch(function (error) {

        s.setState({
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

      </div>


    );
  }
}
