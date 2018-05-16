// @flow
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';
import SplitPane from 'react-split-pane';

import { HotKeys } from 'react-hotkeys';

import { Tabs, notification, Button, Layout, Modal, Popover, Row, Col } from 'antd';

import { Scrollbars } from 'react-custom-scrollbars';

import axios from 'axios';
import JSONTree from 'react-json-tree';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

const { Header, Content } = Layout;
const TabPane = Tabs.TabPane;

export default class Query extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: '',
      response: {},
      table_columns: [],
      table_data: [],
      loading: false
    };

    this.aceEditor = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onQuery = this.onQuery.bind(this);

  }

  hotKeysMap = {
    execute: ['ctrl+enter', 'command+enter']
  };

  hotKeysHandlers = {
    execute: (event) => this.onQuery()
  };

  onLoad(editor) {

    const value = localStorage.getItem('query') ? localStorage.getItem('query') : '';

    this.setState({
      value
    });

  }

  onChange(newValue) {

    localStorage.setItem('query', newValue);

    this.setState({
      value: newValue
    });

  }

  renderTableColumns(response) {
    const columns = response.data.meta.map((value, key) => ({
      Header: value.name,
      accessor: value.name
    }));

    this.setState({
      table_columns: columns
    });
  }

  getHost(){

    if(localStorage.getItem('database_user') && localStorage.getItem('database_pass')){
      return `http://${localStorage.getItem('database_user')}:${localStorage.getItem('database_pass')}@${localStorage.getItem('database_host').replace('http://', '')}`;
    }

    return localStorage.getItem('database_host')

  }

  async query(query) {

    console.log(query);
    return await axios.post(this.getHost(), `${query} FORMAT JSON`);

  }

  async onQuery() {

    notification.destroy();

    if (!this.state.loading) {

      this.setState({
        loading: true
      });

      try {


        let response = '';

        if(this.aceEditor.current.editor.getSelectedText().length > 0) {
          response = await this.query(this.aceEditor.current.editor.getSelectedText());
        } else {
          response = await this.query(this.state.value);
        }

        if (response.data) {
          this.renderTableColumns(response);
        }

        this.setState({
          response,
          table_data: response ? response.data.data : [],
          loading: false
        });

        if (response.data) {
          notification.success({
            message: 'Wow!',
            description: `Elapsed ${response.data.statistics.elapsed.toFixed(3)}ms and read ${response.data.statistics.rows_read} rows with ${parseFloat(response.data.statistics.bytes_read / 10480576).toFixed(2)}Mb.`,
          });
        } else {
          notification.success({
            message: 'Nice!',
            description: 'Your command running ok.',
          });
        }
      } catch (err) {
        console.error(err);

        notification.error({
          message: 'Ops...',
          description: err.response && err.response.data ? `${err.message} - ${err.response.data}` : `${err.message}`,
          duration: 0
        });

        this.setState({
          table_data: [],
          table_columns: [],
          response: {},
          loading: false
        });
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
      <Content style={{ padding: '10px' }}>

        <SplitPane split="horizontal" defaultSize={600}>

          <Row style={{ width: '100%', padding: '10px' }}>

            <Col span={24} >
              <Header style={{backgroundColor: 'transparent', padding: '0', height: 'auto', lineHeight: '0px'}}
              >

                <Button
                  style={{ margin: '10px' }}
                  type="primary"
                  icon="rocket"
                  loading={this.state.loading}
                  onClick={this.onQuery}
                >
                    Launch
                </Button>

                <Button style={{ margin: '10px' }} type="danger" icon="close" loading={this.state.loading} disabled />

                <Popover placement="left" content={content} title="Keyboard Shortcuts">
                  <Button style={{ margin: '10px', float: 'right' }} type="primary" icon="question" />
                </Popover>

              </Header>

              <HotKeys keyMap={this.hotKeysMap} handlers={this.hotKeysHandlers}>

                <AceEditor
                  style={{ marginTop: '10px', display: 'flex', backgroundColor: 'black', width: '100%' }}
                  mode="sql"
                  theme="monokai"
                  onChange={this.onChange}
                  onLoad={this.onLoad}
                  value={this.state.value}
                  defaultValue={this.state.value}
                  name="aceEditor"
                  editorProps={{ $blockScrolling: true }}
                  ref={this.aceEditor}
                  setOptions={{
                      enableLiveAutocompletion: true,
                      showLineNumbers: true,
                      tabSize: 2
                    }}
                />

              </HotKeys>
            </Col>

          </Row>

          <Row style={{ height: '100%', display: 'flex' }}>

            <Col span={24} style={{ backgroundColor: '#EEE', width: '100%', zIndex: '100' }}>

              <Tabs defaultActiveKey="1" style={{ height: '100%' }}>

                <TabPane tab="Table View" key="1">

                  <Scrollbars style={{ height: 'auto', minHeight: '30vh' }}>

                    <ReactTable
                      data={this.state.table_data}
                      columns={this.state.table_columns}
                      defaultPageSize={5}
                      className="-striped -highlight"
                    />

                  </Scrollbars>

                </TabPane>

                <TabPane tab="JSON Result" key="2">
                  <Scrollbars style={{ height: 'auto', minHeight: '30vh' }}>
                    <JSONTree style={{ backgroundColor: 'transparent !important' }} data={this.state.response} />
                  </Scrollbars>
                </TabPane>

              </Tabs>

            </Col>

          </Row>

        </SplitPane>

      </Content>
    );
  }
}
