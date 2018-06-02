/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';

import DoScience from './containers/DoScience';
import ProcessList from './containers/ProcessList';
import ServerSettings from './containers/ServerSettings';
import DatabaseGraph from './containers/DatabaseGraph';

export default () => (
  <App>
    <Switch>
      <Route path="/database-graph" component={DatabaseGraph} />
      <Route path="/server-settings" component={ServerSettings} />
      <Route path="/process-list" component={ProcessList} />
      <Route path="/" component={DoScience} />
    </Switch>
  </App>
);
