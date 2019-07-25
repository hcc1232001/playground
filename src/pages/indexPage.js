import React from 'react';
import {Link} from 'react-router-dom';
import routes from 'globals/routes';

const IndexPage = () => {
  return <ul>
    <li><Link to={routes.fbxViewer}>Windows Animation</Link></li>
    <li><Link to={routes.kitchenViewer}>Kitchen Animation</Link></li>
    <li><Link to={routes.homePage}>Game</Link></li>
  </ul>
}

export default IndexPage;