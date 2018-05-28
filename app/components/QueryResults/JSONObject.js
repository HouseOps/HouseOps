// @flow
import React, { Component } from 'react';

import JSONTree from 'react-json-tree';
import { Scrollbars } from 'react-custom-scrollbars';

export default class JSONObject extends Component {

  constructor(props) {
    super(props);

    console.log(props);

  }

  render() {
    return (
      <div style={{width: '99%', height: '95%', overflow: 'hidden'}}>
        { this.props.data.data ?
          <Scrollbars>
            <JSONTree data={this.props.data} />
          </Scrollbars>
          : <h5 style={{color: '#293742'}}>Wake me when you have results for me render...zZzzZzzZz</h5>
        }
      </div>
    );
  }
}
