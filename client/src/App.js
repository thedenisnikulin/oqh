import React, { useState, useEffect } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import history from './components/history'

import Home from './components/home/Home';
import { Login, Logout } from './components/auth/Login';
import Register from './components/auth/Register';

import Protected from './components/Protected'
import Dashboard from './components/dashboard/Dashboard'
import Room from './components/room/Room'

const App = () => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`

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
  const [ access, setAccess ] = useState(false);  // this state is not working properly with router, gonna use redux later
  const [ loading, setLoading ] = useState(true);
  const [ message, setMessage ] = useState();
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const verifyToken = async () => {
    console.log('access before verification" ' + access)
    console.log(axios.defaults.headers.common['Authorization']);
    await axios.post('http://localhost:7000/token')
      .then(response => response.data.data)
      .then(data => {
        console.log(data)
        if (data.tokenVerificationData.access) {
          setUserData(data.tokenVerificationData.user);
        } else {
          history.push('/login')
        }
        setAccess(data.tokenVerificationData.access)
        setMessage(data.tokenVerificationData.message);
        console.log('access from verification: ' + data.tokenVerificationData.access)
        setLoading(false);
        console.log('access after verification: ' + access)

      })
  }

  return (
      <Router history={history}>
       <Switch>

        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/login"
          render={props => {
            if (isLoggedIn) {
              console.log('a l ' + isLoggedIn)
              return(<Redirect to="/dashboard"/>)
            } else {
              console.log('a l ' + isLoggedIn)
              return(<Login {...props} accessState={{access, setAccess}} userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />)
            }
        }} 
        />

        <Route exact path="/register"
          render={props => access ? <Redirect to="/dashboard" /> : <Register {...props} history={history} userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />} 
        />

        <Protected exact path='/dashboard' verifyToken={verifyToken} access={access} loading={loading}>
          <Dashboard access={access} userDataState={{ userData, setUserData }} roomState={{ room, setRoom }} />
          <Logout history={history} accessState={{access, setAccess}}/>
        </Protected>

        <Protected exact path='/room' verifyToken={verifyToken} access={access} loading={loading}>
          <Room history={history} userDataState={{ userData, setUserData }} roomState={{ room, setRoom }}/>
        </Protected>

      </Switch>
    </Router>
  );
}

export default App;
