import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import './App.css';
import Home from './Home'
import Login from './Login'
import Header from './Header'

class App extends Component {
  render() {
    return (
      <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App;
