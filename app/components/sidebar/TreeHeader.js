import React from 'react';

import {
  Icon,
  Tooltip
} from '@blueprintjs/core';

module.exports = ({ style, node }) => { // eslint-disable-line
  const iconType = node.icon;
  const iconStyle = { marginRight: '7px', marginTop: '3px' };

  if (iconType === 'appstore') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Icon icon={iconType} style={iconStyle} />

          <b style={{ fontSize: '17px' }}>{node.name}</b> <small>({node.total_childrens})</small>

        </div>
      </div>
    );
  } else if (iconType === 'database') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Icon icon={iconType} style={iconStyle} />

          <b>{node.name}</b> <small>({node.total_childrens})</small>

        </div>
      </div>
    );
  } else if (iconType !== '-') {
    return (
      <div style={style.base}>
        <div style={style.title}>

          <Icon icon={iconType} style={iconStyle} />

          <b style={{ fontSize: '13px' }}>{node.name}&nbsp;&nbsp;</b>

          <Tooltip placement="topLeft" title={`${node.rows} rows`} >
            <small className={node.rows === null ? 'hidden' : ''}><Icon type="question-circle-o" style={iconStyle} /></small>
          </Tooltip>

          <small>({node.total_childrens})&nbsp;&nbsp;{node.engine}</small>

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
