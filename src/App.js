import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import './App.css';
import Home from './Home'
import SignupPage from './Signup'
import LoginPage from './Login'
import SimpleTable from './ChartsTable'
import Chart from './Chart'
import Header from './Header'
import * as ROUTES from './config/routes';
import { withFirebase } from './Firebase';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
    };
  }


  render() {
    return (
      <div className="App">
      <Router>
        <Header authUser={this.state.authUser} />
        <Switch>
          <Route exact path={ROUTES.INDEX} component={Home} />
          <Route path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.SIGNUP} component={SignupPage} />
          <Route path={ROUTES.LOGIN} component={LoginPage} />
          <Route path={ROUTES.SIMPLETABLE} component={SimpleTable} />
          <Route path={ROUTES.CHART} component={Chart} />
        </Switch>
      </Router>
      </div>
    );
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null })
        console.log(this.state)
    })
  }

  componentWillUnmount() {
    this.listener();
  }

}

export default withFirebase(App);
