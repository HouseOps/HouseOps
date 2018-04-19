// @flow
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';

import './Query.css'

import {HotKeys} from 'react-hotkeys';

import { Tabs, notification, Button, Layout, Modal, Popover } from 'antd';
const { Header, Content } = Layout;
const TabPane = Tabs.TabPane;

import { Scrollbars } from 'react-custom-scrollbars';

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
      loading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onQuery = this.onQuery.bind(this);
    this.onLoad = this.onLoad(this);

  }

  hotKeysMap = {
    'execute': ['ctrl+enter', 'command+enter']
  };

  hotKeysHandlers = {
    'execute': (event) => this.onQuery()
  };

  onChange(newValue) {

    this.setState({
      value: newValue
    })

  }

  onLoad(editor) {

  }

  renderTableColumns(response) {

    const columns = response.data.meta.map((value, key) => {

      return {
        Header: value.name,
        accessor: value.name
      }

    });

    this.setState({
      table_columns: columns
    })

  }

  async query(query){
    return await axios.post(localStorage.getItem('database_host'), `${query} FORMAT JSON`)
  }

  async onQuery() {

    notification.destroy();

    if(!this.state.loading)
    {

      this.setState({
        loading: true
      });

      try {

        const response = await this.query(this.state.value);

        this.renderTableColumns(response);

        this.setState({
          response: response,
          table_data: response.data.data,
          loading: false
        });

        notification.info({
          message: 'Wow!',
          description: `Elapsed ${response.data.statistics.elapsed.toFixed(3)}ms and read ${response.data.statistics.rows_read} rows with ${parseFloat(response.data.statistics.bytes_read / 10480576).toFixed(2)}Mb.`,
        });

      } catch (err) {

        console.error(err);

        notification.error({
          message: 'Ops...',
          description: `${err.message} - ${err.response.data}`,
          duration: 0
        });

        this.setState({
          table_data: [],
          table_columns: [],
          response: {},
          loading: false
        })

      }

    }

  }


  render() {

    const content = (
      <div>
        <p><b>Ctrl+Enter</b> - Launch query</p>
      </div>
    );

    return (

      <Content style={{padding: '10px'}}>

        <Header style={{backgroundColor: 'transparent', padding: '0', height: 'auto', lineHeight: '0px'}}>

          <Button style={{margin: '10px'}} type="primary" icon="rocket" loading={this.state.loading}
                  onClick={this.onQuery}>
            Launch
          </Button>

          <Button style={{margin: '10px'}} type="danger" icon="close" loading={this.state.loading} disabled>
          </Button>

          <Popover placement="left" content={content} title="Keyboard Shortcuts">
            <Button style={{margin: '10px', float: 'right'}} type="primary" icon="question">
            </Button>
          </Popover>

        </Header>

        <HotKeys keyMap={this.hotKeysMap} handlers={this.hotKeysHandlers}>

          <AceEditor
            style={{width: '100%', marginTop: '10px'}}
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

        </HotKeys>

        <Tabs defaultActiveKey="1">

          <TabPane tab="Table View" key="1">

            <Scrollbars style={{height: 'auto', minHeight: '30vh'}}>

            <ReactTable
              data={this.state.table_data}
              columns={this.state.table_columns}
              defaultPageSize={5}
              className="-striped -highlight"
            />

            </Scrollbars>

          </TabPane>

          <TabPane tab="JSON Result" key="2">
            <Scrollbars style={{height: 'auto', minHeight: '30vh'}}>
            <JSONTree style={{backgroundColor: 'transparent !important'}} data={this.state.response}/>
            </Scrollbars>
          </TabPane>

        </Tabs>


      </Content>
    );
  }
}
