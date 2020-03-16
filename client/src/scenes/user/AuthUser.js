import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

const AuthUser = () => {
  const [loginData, setLoginData] = useState();
  const [registerData, setRegisterData] = useState();

  axios.all([
    axios.post('/user/login'),
    axios.post('/user/register')
  ])
    .then()

  return (
    <Router>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Switch>
    </Router>
  );
}

const Login = (props) => {
  return (
    <div>

    </div>
  );
}

const Register = (props) => {
  return (
    <div>
      
    </div>
  );
}


export default AuthUser;
