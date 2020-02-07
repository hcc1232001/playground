import React from 'react';
import {Link} from 'react-router-dom';
import routes from 'globals/routes';

const IndexPage = () => {
  return <ul className="client">
    <li><Link to={routes.fbxViewer}>Windows Animation</Link></li>
    <li><Link to={routes.kitchenViewer}>Kitchen Animation</Link></li>
    <li><Link to={routes.homePage}>Game</Link></li>
    <li><Link to={routes.touchTableViewer}>Touch Table Testing</Link></li>
    <li><Link to={routes.svgAnimator}>svg Testing</Link></li>
  </ul>
}

export default IndexPage;