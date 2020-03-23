import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';


const Protected = ({ children, access, ...rest }) => {

  console.log(access);
    return (
      <div>
        <Route {...rest} render={(props) => {
         if (access === null) {
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