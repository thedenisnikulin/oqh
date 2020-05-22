import React, { useState } from 'react';
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
    axios.post('http://localhost:7000/login', { 
      username: userData.username,
      password: userData.password 
    })
      .then(response => {
        const data = response.data
        console.log(data)
        if (data.error) {
          setMessage(data.error);
        } else {
            localStorage.setItem('accessToken', data.data.jwt);
            setUserData({
              username: data.data.user.username,
              bio: data.data.user.bio
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
          placeholder='Your username' 
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