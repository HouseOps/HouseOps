// @flow
import * as React from 'react';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <div style={{ height: '100vh' }}>
        {this.props.children}
      </div>
    );
  }
}
