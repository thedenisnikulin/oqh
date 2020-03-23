import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useLocation } from 'react-router-dom';


function Dashboard(props) {
    const { email, username, tag } = props.userData;

  return (
    <div>
      <h1>Hi, {username}</h1>
        <p>Your qualification is {tag}</p>
        <p>{email}</p>
    </div>
  );
}

export default Dashboard;