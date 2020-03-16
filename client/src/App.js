import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
// Importing components
import Home from './scenes/Home/Home';
import AuthUser from './scenes/user/AuthUser';

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/" component={Home}>
          <Redirect to="/home" />
        </Route>
        <Route path="/home" component={Home} />
        <Route path="/user" component={AuthUser} />
      </Switch>
    </Router>
  );
}

export default App;
