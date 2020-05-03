import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import Home from './components/home/Home';
import { Login, Logout } from './components/auth/Login';
import Register from './components/auth/Register';

import Protected from './components/Protected'
import Dashboard from './components/dashboard/Dashboard'
import Room from './components/room/Room'

const App = () => {

  axios.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + localStorage.getItem('accessToken');

  const [ userData, setUserData ] = useState({
    username: null,
    password: null,
    bio: null,
    roomId: null
  });
  const [ room, setRoom ] = useState({ 
    id: '', 
    topic: '', 
    users: [],
    isReady: false
  });
  const [ access, setAccess ] = useState();
  const [ loading, setLoading ] = useState(true);
  const [ message, setMessage ] = useState();

  const checkToken = async () => {
    await axios.get('http://localhost:7000/check-token')
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

        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/login"
          render={(props) => <Login userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />} 
        />

        <Route exact path="/register"
          render={(props) => <Register userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />} 
        />

        <Protected exact path='/dashboard' checkToken={checkToken} access={access} loading={loading}>
          <Dashboard userDataState={{ userData, setUserData }} roomState={{ room, setRoom }} />
          <Logout />
        </Protected>

        <Protected exact path='/room' checkToken={checkToken} access={access} loading={loading}>
          <Room userDataState={{ userData, setUserData }} roomState={{ room, setRoom }}/>
        </Protected>

      </Switch>
    </Router>
  );
}

export default App;
