import React, { Component } from 'react';
import logo from './logo.svg';
import TopBar from './components/TopBar';
import AppContainer from './components/AppContainer';
import { Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

class App extends Component {
  render(){
    return(
      <div className="ui grid">
        <TopBar/>
      <div className="spacer row"/>
      <div className="row">
        <AppContainer/>
      </div>
    </div>
    )
  }
}

export default App;
