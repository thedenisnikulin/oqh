import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import Home from './scenes/Home';
import { Login, Register } from './scenes/user/AuthUser';

import Protected from './scenes/Protected'
import Dashboard from './scenes/user/Dashboard'

function App() {

  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');

  const [ userData, setUserData ] = useState({
    email: null,
    username: null,
    password: null,
    tag: null
  });
  const [ access, setAccess ] = useState();
  const [ loading, setLoading ] = useState(true);
  const [ message, setMessage ] = useState();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    await axios.get('http://localhost:7000/user/check-token')
      .then(response => {
        setUserData(response.data.userData);
        setAccess(response.data.access)
        setMessage(response.data.message);
        setLoading(false);
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
          render={(props) => <Login userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />} 
        />

        <Route 
          path="/user/register"
          render={(props) => <Register userData={userData} setUserData={setUserData} />} 
        />

        <Protected path='/user/dashboard' access={access} loading={loading}>
          <Dashboard userData={userData} />
        </Protected>

      </Switch>
    </Router>
  );
}

export default App;
