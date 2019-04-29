import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import './App.css';
import Home from './components/Home'
import SignupPage from './components/Signup'
import LoginPage from './components/Login'
import SimpleTable from './components/ChartsTable'
import Chart from './components/Chart'
import Header from './components/Header'
import Viewer from './components/viewer/blueprintViewer'
import Editor from './utils/blueprintEditor'
import Device from './components/Device'
import * as ROUTES from './config/routes';
import { withFirebase } from './components/Firebase';

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
          <Route path={ROUTES.EDITOR} component={Editor} />
          <Route path={ROUTES.VIEWER} component={Viewer} />
          <Route path={ROUTES.DEVICE} component={Device}/>
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
    })
  }

  componentWillUnmount() {
    this.listener();
  }

}

export default withFirebase(App);
