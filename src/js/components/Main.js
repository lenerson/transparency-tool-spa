import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from 'grommet/components/App';
import Split from 'grommet/components/Split';

import NavSidebar from './NavSidebar';
import { navResponsive } from '../actions/nav';

import AuthenticatedRoute from './AuthenticatedRoute';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import Tasks from '../screens/Tasks';
import Task from '../screens/Task';
import Users from '../screens/admin/users/Users';
import User from '../screens/admin/users/User';
import NotFound from '../screens/NotFound';

class Main extends Component {
  constructor() {
    super();
    this._onResponsive = this._onResponsive.bind(this);
  }

  _onResponsive(responsive) {
    this.props.dispatch(navResponsive(responsive));
  }

  render() {
    const {
      nav: { active: navActive, enabled: navEnabled, responsive }
    } = this.props;
    const includeNav = (navActive && navEnabled);
    let nav;
    if (includeNav) {
      nav = <NavSidebar />;
    }
    const priority = (includeNav && responsive === 'single' ? 'left' : 'right');

    return (
      <App centered={false}>
        <Router>
          <Split
            priority={priority}
            flex='right'
            onResponsive={this._onResponsive}
          >
            {nav}
            <Switch>
              <AuthenticatedRoute exact={true} path='/' component={Dashboard} />
              <AuthenticatedRoute path='/dashboard' component={Dashboard} />
              <Route path='/login' component={Login} />
              <AuthenticatedRoute path='/tasks/:id' component={Task} />
              <AuthenticatedRoute path='/tasks' component={Tasks} />
              <AuthenticatedRoute path='/users' component={Users} />
              <AuthenticatedRoute path='/user/:id?' component={User} />
              <Route path='/*' component={NotFound} />
            </Switch>
          </Split>
        </Router>
      </App>
    );
  }
}

Main.defaultProps = {
  nav: {
    active: true, // start with nav active
    enabled: true, // start with nav disabled
    responsive: 'multiple'
  }
};

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.shape({
    active: PropTypes.bool,
    enabled: PropTypes.bool,
    responsive: PropTypes.string
  })
};

const select = state => ({
  nav: state.nav
});

export default connect(select)(Main);
