import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import Home from './scenes/Home';
import { Login, Register } from './scenes/user/AuthUser';
import Protected from './scenes/Protected'
import Dashboard from './scenes/user/Dashboard'

function App() {

  const [userData, setUserData] = useState({
    email: null,
    username: null,
    password: null,
    tag: null,
  });
  const [access, setAccess] = useState(null);
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const response = await axios.get('http://localhost:7000/user/check-token')
      .then(response => {
        setAccess(response.data.access)
      })
  }

  return (
    <Router>
      <Switch>

        <Route path="/home">
          <Home />
        </Route>

        <Route 
          path="/user/login"
          render={(props) => <Login userData={userData} setUserData={setUserData} />} 
        />

        <Route 
          path="/user/register"
          render={(props) => <Register userData={userData} setUserData={setUserData} />} 
        />

        <Protected path='/user/dashboard' access={access}>
          <Dashboard userData={userData} />
        </Protected>

      </Switch>
    </Router>
  );
}

export default App;
