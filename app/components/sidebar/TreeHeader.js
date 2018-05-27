import React from 'react';

import {
  Icon,
  Tooltip,
  Position,
  Text
} from '@blueprintjs/core';

module.exports = ({ style, node }) => { // eslint-disable-line
  const iconType = node.icon;
  const iconStyle = { marginRight: '7px', marginTop: '3px' };

  if (iconType === 'appstore') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Text>
            <Icon icon={iconType} style={iconStyle} />
            <b style={{ fontSize: '17px' }}>{node.name}</b> <small>({node.total_childrens})</small>
          </Text>

        </div>
      </div>
    );
  } else if (iconType === 'database') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Text>
            <Icon icon={iconType} style={iconStyle} />
            <b>{node.name}</b> <small>({node.total_childrens})</small>
          </Text>

        </div>
      </div>
    );
  } else if (iconType !== '-') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Text ellipsize="true">
            <Icon icon={iconType} style={iconStyle} />

            <b style={{ fontSize: '13px' }}>{node.name}&nbsp;&nbsp;</b>

            <Tooltip position={Position.RIGHT} content={`${node.rows} rows`} >
              <small className={node.rows === null ? 'hidden' : ''}><Icon icon="help" style={iconStyle} /></small>
            </Tooltip>

            <small>({node.total_childrens})&nbsp;&nbsp;{node.engine}</small>
          </Text>

        </div>
      </div>
    );
  }

  return (
    <div style={style.base}>
      <div style={style.title}>
        <div style={{ marginLeft: '20px', fontSize: '13px' }}>
          <i><b>{node.name}</b></i> <small>{node.engine}{node.type}</small>
        </div>
      </div>
    </div>
  );
};
