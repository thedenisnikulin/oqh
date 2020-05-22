import React, { useState } from 'react';
import axios from 'axios';

const Register = (props) => {
    const { userData, setUserData }= props.userDataState;
    const { message, setMessage } = props.messageState;
  
    const handleChange = (e) => {
      const { value, name } = e.target;
      setUserData({ ...userData, [name]: value });
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post('http://localhost:7000/register', { 
        username: userData.username,
        bio: userData.bio,
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
            placeholder='Username' 
            onChange={handleChange}
            required
          />
          <input 
            type='text' 
            name='bio' 
            placeholder='Bio' 
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
};

export default Register;