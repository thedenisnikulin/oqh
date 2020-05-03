import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';


const Protected = ({ children, checkToken, access, loading, ...rest }) => {
  useEffect(() => {
    checkToken();
  }, []);

    return (
      <div>
        <Route {...rest} render={(props) => {
         if (loading) {
          return <h1>Loading...</h1>
         } else {
          if (access === true) {
            return children
          } else {
            return <Redirect to={{
              pathname: '/user/login',
              state: { from: props.location }
            }} />
          }
            
         }
         
        }} />
      </div>
      
    );
  }

export default Protected;