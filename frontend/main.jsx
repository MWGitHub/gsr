import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';
import co from 'co';

import NotFound from './components/not-found';

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="container group">
          {this.props.children}
        </div>
      </div>
    );
  }
}

class Home extends React.Component {
  render() {
    return (
      <div>
        <p>Test</p>
      </div>
    )
  }
}

var router = (
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Home} />

      <Route path='*' component={NotFound} />
    </Route>
  </Router>
);

$(function () {
  let render = function() {
    ReactDOM.render(router, $('#content')[0]);
  };

  render();
});
