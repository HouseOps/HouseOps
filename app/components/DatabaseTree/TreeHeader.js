import React from 'react';

import {
  Icon,
  Tooltip,
  Position,
  Text
} from '@blueprintjs/core';

const prettyBytes = require('pretty-bytes');

module.exports = ({ style, node }) => { // eslint-disable-line
  const iconType = node.icon;
  const iconStyle = { marginRight: '7px', marginTop: '3px' };

  if (iconType === 'appstore') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Text>
            <Icon icon="globe" style={iconStyle} />
            <b style={{ fontSize: '16px' }}>{node.name}</b> <small><i>{node.database_host}</i></small>
          </Text>

        </div>
      </div>
    );
  } else if (iconType === 'database') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Text>
            <b>{node.name}</b> <small> | {node.total_childrens}</small>
          </Text>

        </div>
      </div>
    );
  } else if (iconType !== '-') {
    return (
      <div style={style.base}>
        <div style={style.title}>
          <Tooltip position={Position.TOP_RIGHT} content={`${node.rows} rows`} disabled={node.rows === null}>
            <div>
              <Icon icon={iconType} style={iconStyle} />
              <b style={{ fontSize: '13px' }}>{node.name}&nbsp;&nbsp;</b>
              <small>{node.engine} | {node.total_childrens}</small>
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div style={style.base}>
      <div style={style.title}>
        <div style={{ marginLeft: '20px', fontSize: '13px' }}>
          <b>{node.name}</b>
          <i>
            <small>{node.engine} {node.type} {prettyBytes(parseInt(node.columnSize, 10))}</small>
          </i>
        </div>
      </div>
    </div>
  );
};
