import React from 'react';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import asyncLoadingPage from 'components/asyncLoadingComponent.js';
import routes from 'globals/routes';
import logo from './logo.svg';
import './App.css';

const getRenderPropForRoute = (pageId) => {
  const AppComponent = asyncLoadingPage(pageId);
  return (match) => { return (<AppComponent match={match} />) };
}

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path={routes.joinGame} render={getRenderPropForRoute('joinGame')} />
        <Route path={routes.homePage} render={getRenderPropForRoute('homePage')} />
        <Redirect to={routes.homePage} />
      </Switch>
    </HashRouter>
  );
}

export default App;
