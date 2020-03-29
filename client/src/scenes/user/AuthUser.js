import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';


export const Login = (props) => {
  const { userData, setUserData }= props.userDataState;
  const { message, setMessage } = props.messageState;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:7000/user/login', { email: userData.email, password: userData.password })
      .then(result => {
        console.log(result)
        if (result.data.message) {
          // do that
          setMessage(result.data.message);
        } else {
            localStorage.setItem('accessToken', result.data.data.jwt);
            // TODO: user object to localstorage
            setUserData({
              email: result.data.data.user.email,
              username: result.data.data.user.username,
              password: null,
              tag: result.data.data.user.tag
            });
            setMessage('success');
        }
      })
  }

  return (
    <div>
      <p>{message}</p>
      <p>{JSON.stringify(userData)}</p>
      <form onSubmit={handleSubmit}>
        <input 
          type='email' 
          name='email' 
          placeholder='Your email' 
          onChange={handleChange}
          required
        />
        <input 
          type='password'
          name='password'
          placeholder='Your password'
          onChange={handleChange}
          required
        />
        <input type='submit' value='Sign in'/>
      </form>
    </div>
  );
}

export const Register = (props) => {
  const userData = props.userData;
  const setUserData = props.setUserData;
  const [ message, setMessage ] = useState();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:7000/user/register', { 
      username: userData.username,
      tag: userData.tag,
      email: userData.email, 
      password: userData.password
    })
      .then(result => {
        console.log(result)
        if (result.data.message) {
          // do that
          setMessage(result.data.message);
        } else {
            localStorage.setItem('accessToken', result.data.data.jwt);
            setUserData({
              email: result.data.data.user.email,
              username: result.data.data.user.username,
              tag: result.data.data.user.tag
            });
            setMessage('success');
        }
      })
  }

  return (
    <div>
      <p>{message}</p>
      <p>{JSON.stringify(userData)}</p>
      <form onSubmit={handleSubmit}>
        <input 
          type='text' 
          name='username' 
          placeholder='Username' 
          onChange={handleChange}
          required
        />
        <input 
          type='text' 
          name='tag' 
          placeholder='Tag' 
          onChange={handleChange}
          required
        />
        <input 
          type='email' 
          name='email' 
          placeholder='Email' 
          onChange={handleChange}
          required
        />
        <input 
          type='password'
          name='password'
          placeholder='Password'
          onChange={handleChange}
          required
        />
        <input type='submit' value='Sign up'/>
      </form>
    </div>
  );
}

export const Logout = (props) => {

  const handleClick = () => {
    localStorage.removeItem('accessToken');
  }

  return(
    <div>
      <button onClick={handleClick}>Log out</button>
    </div>
  );
}