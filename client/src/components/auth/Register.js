import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core'

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
        .then(response => response.data)
        .then(data => {
          console.log(data)
          if (data.success) {
            localStorage.setItem('accessToken', data.data.jwt);
            setUserData({
              username: data.data.user.username,
              bio: data.data.user.bio
            });
            props.history.push('/dashboard')
          };
          setMessage(data.message)
        })
    }
  
    return (
      <div className="auth-wrap">
      <div className="split right">
        <div className='auth-title'><span style={{fontWeight: "400"}}>chatterest |</span> REGISTER</div>
        <div className="centered">
          <p>{message}</p>
          <p>{JSON.stringify(userData)}</p>
          <form className="form-wrap" onSubmit={handleSubmit}>
            <TextField style={{margin: "0 0 1rem 0"}} fullWidth required 
              id="outlined-basic" 
              variant="outlined" 
              label="username" 
              type="text" 
              name="username" 
              onChange={handleChange} 
            />
            <TextField style={{margin: "0 0 1rem 0"}} fullWidth required 
              id="outlined-basic" 
              variant="outlined" 
              label="password" 
              type="password" 
              name="password" 
              onChange={handleChange} />
            <TextField style={{margin: "0 0 1rem 0"}} fullWidth required 
              id="outlined-basic" 
              variant="outlined" 
              label="bio" 
              type="bio" 
              name="bio" 
              onChange={handleChange} />
            <div>
            <Button style={{backgroundColor: "#74D69D"}} fullWidth
              variant="contained" 
              type="submit" 
              color="primary"
            > Log in
            </Button>
            </div>
          </form>
          <div>Already registered? {<Link to="/login">Login</Link>}</div>
        </div>
        
      </div>
      <div className="split left split-rect">
        <div className="centered">
          <img style={{height: "20rem"}} src={require('../../assets/auth.svg')}/>
        </div>
      </div>
    </div>  
    );
};

export default Register;