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
          return <div className="loading">Loading...</div>
         } else {
          if (access === true) {
            return children
          } else if (access === false) {
            return <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
            }} />
          }
            
         }
         
        }} />
      </div>
      
    );
  }

export default Protected;