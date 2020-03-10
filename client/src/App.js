import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
// Importing components
import Home from './scenes/Home/Home';
import Auth from './scenes/Auth/Auth';

function App() {
  const [home, setHome] = useState();

  useEffect(() => {
    axios.get('http://localhost:5000/home')
      .then(res => setHome(res.data.home))
      .then(res => console.log(res))
      .catch(err => console.log(err))
  });

  return (
    <Router>
      <Switch>
        <Route path="/" component={Home}>
          <Redirect to="/home" />
        </Route>
        <Route path="/home" component={Home} />
        <Route path="/auth" component={Auth} />
      </Switch>
    </Router>
  );
}

export default App;
