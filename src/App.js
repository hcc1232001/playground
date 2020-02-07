import React from 'react';
import {HashRouter, BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import asyncLoadingPage from 'components/asyncLoadingComponent.js';
import routes from 'globals/routes';
// import logo from './logo.svg';
import './App.css';

import JoinGame from 'pages/joinGame';
import HomePage from 'pages/homePage';
import FbxViewer from 'pages/fbxViewer';
import KitchenViewer from 'pages/kitchenViewer';
import IndexPage from 'pages/indexPage';
import TouchTableViewer from 'pages/touchTableViewer';
import TouchTable from 'pages/touchTable';
import AnimatingLines from 'pages/animatingLines';
import SvgAnimator from 'pages/svgAnimator';

const templates = {
  joinGame: JoinGame,
  homePage: HomePage,
  fbxViewer: FbxViewer,
  kitchenViewer: KitchenViewer,
  indexPage: IndexPage,
  touchTableViewer: TouchTableViewer,
  touchTable: TouchTable,
  animatingLines: AnimatingLines,
  svgAnimator: SvgAnimator,
};

const getRenderPropForRoute = (pageId) => {
  // const AppComponent = asyncLoadingPage(pageId);
  const AppComponent = templates[pageId];
  return (match) => { return (<AppComponent match={match} />) };
  
}

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path={routes.joinGame} render={getRenderPropForRoute('joinGame')} />
        {/* <Route path={routes.createGame} render={getRenderPropForRoute('createGame')} /> */}
        <Route path={routes.homePage} render={getRenderPropForRoute('homePage')} />
        {/* <Route path={routes.fbxViewerOfName} render={getRenderPropForRoute('fbxViewer')} /> */}
        {/* <Route path={routes.kitchenViewer} render={getRenderPropForRoute('kitchenViewer')} /> */}
        {/* <Route path={routes.indexPage} render={getRenderPropForRoute('indexPage')} /> */}
        {/* <Route path={routes.touchTableViewer} render={getRenderPropForRoute('touchTableViewer')} /> */}
        {/* <Route path={routes.touchTable} render={getRenderPropForRoute('touchTable')} /> */}
        {/* <Route path={routes.animatingLines} render={getRenderPropForRoute('animatingLines')} /> */}
        {/* <Route path={routes.svgAnimator} render={getRenderPropForRoute('svgAnimator')} /> */}
        <Redirect to={routes.homePage} />
      </Switch>
    </HashRouter>
  );
}

export default App;
