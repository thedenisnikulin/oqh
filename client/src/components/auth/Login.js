import React from 'react';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core'

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
    <div className="auth-wrap">
    	<div className="split left">
        <div className="centered">
          <p>{message}</p>
          <p>{JSON.stringify(userData)}</p>
          <form className="form-wrap" onSubmit={handleSubmit}>
            <TextField style={{margin: "0 0 1rem 0"}} fullWidth required id="filled-basic" variant="filled" label="username" type="text" name="username" onChange={handleChange} />
            <TextField style={{margin: "0 0 1rem 0"}} fullWidth required id="filled-basic" variant="filled" label="password" type="password" name="password" onChange={handleChange} />
            <div>
            <Button fullWidth style={{backgroundColor: "#74D69D"}} variant="contained" type="submit" color="primary">Log in</Button>
            </div>
          </form>
        </div>
        
    	</div>
		<div className="split right split-rect">
      <div className="centered">
        hello
      </div>
    </div>
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