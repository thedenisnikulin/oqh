import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

const Protected = ({ children, verifyToken, access, loading, ...rest }) => {
  useEffect(() => {
    verifyToken();
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