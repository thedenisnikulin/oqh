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
    username: "me",
    password: null,
    bio: "yeh",
    roomId: "this"
  });
  const [ room, setRoom ] = useState({ 
    id: 'blablabla', 
    topic: 'media', 
    users: [
      {
        id: "bluh",
        username: "test1",
        bio: "heeeeey",
        roomId: 'this'
      },
      {
        id: "bluh",
        username: "test2",
        bio: "heeeeey",
        roomId: 'this'
      },
      {
        id: "bluh",
        username: "test3",
        bio: "heeeeey",
        roomId: 'this'
      },
      {
        id: "bluh",
        username: "test4",
        bio: "heeeeey",
        roomId: 'this'
      }
    ],
    isReady: false
  });
  // change access = false; loading = true;
  const [ access, setAccess ] = useState(true);  // this state is not working properly with router, gonna use redux later
  const [ loading, setLoading ] = useState(false);
  const [ message, setMessage ] = useState();

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
<<<<<<< HEAD
          <Home history={history}/>
=======
          <Home />
>>>>>>> dependabot/npm_and_yarn/client/websocket-extensions-0.1.4
        </Route>

        <Route exact path="/login"
          render={props => {
            if (access) {
              console.log('a l ' + access)
              return(<Redirect to="/dashboard"/>)
            } else {
              console.log('a l ' + access)
              return(<Login {...props} accessState={{access, setAccess}} userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />)
            }
        }} 
        />

        <Route exact path="/register"
          render={props => access ? <Redirect to="/dashboard" /> : <Register {...props} history={history} userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />} 
        />

        <Protected exact path='/dashboard' verifyToken={verifyToken} access={access} loading={loading}>
          <Dashboard accessState={{access, setAccess}} userDataState={{ userData, setUserData }} roomState={{ room, setRoom }} />
        </Protected>

        <Protected exact path='/room' verifyToken={verifyToken} access={access} loading={loading}>
          <Room history={history} userDataState={{ userData, setUserData }} roomState={{ room, setRoom }}/>
        </Protected>

      </Switch>
    </Router>
  );
}

export default App;
