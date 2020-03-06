import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Test from './Test';

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
        <Route path="/home">
          <h1>look: {home}</h1>
        </Route>
        <Route path="/page">
          <Test/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
