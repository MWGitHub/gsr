import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';
import co from 'co';

import NotFound from './components/not-found';
import Home from './components/home';

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
