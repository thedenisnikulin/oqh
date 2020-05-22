import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { green } from '@material-ui/core/colors/green';
import axios from 'axios';

import Home from './components/home/Home';
import { Login, Logout } from './components/auth/Login';
import Register from './components/auth/Register';

import Protected from './components/Protected'
import Dashboard from './components/dashboard/Dashboard'
import Room from './components/room/Room'

const App = () => {

  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
  const theme = createMuiTheme({
    palette: {
      primary: green
    }
  })
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

  const verifyToken = async () => {
    console.log('before')
    console.log(axios.defaults.headers.common['Authorization']);
    await axios.post('http://localhost:7000/token')
      .then(response => {
        console.log(response)
        const data = response.data.data.tokenVerificationData;
        data.user && setUserData(data.user);
        data.message && setMessage(data.message);
        setAccess(data.access)
        setLoading(false);
        console.log('after')
      })
  }

  return (
    <MuiThemeProvider theme={theme}>
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

        <Protected exact path='/dashboard' verifyToken={verifyToken} access={access} loading={loading}>
          <Dashboard userDataState={{ userData, setUserData }} roomState={{ room, setRoom }} />
          <Logout />
        </Protected>

        <Protected exact path='/room' verifyToken={verifyToken} access={access} loading={loading}>
          <Room userDataState={{ userData, setUserData }} roomState={{ room, setRoom }}/>
        </Protected>

      </Switch>
    </Router>
    </MuiThemeProvider>
  );
}

export default App;
