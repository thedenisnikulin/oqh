import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useLocation } from 'react-router-dom';


const Dashboard = (props) => {

  return (
    <div className="dashboard">
      <Navigation />
      <Profile userData={props.userData}/>
      <News />
      <Matchmaking />
    </div>
  );
}

const Profile = (props) => {
  const { email, username, tag, rank } = props.userData;

  return (
    <div className="dashboard-profile">
      <div>{username}</div>
      <div>{email}</div>
      <div>{tag}</div>
      <div>{rank}</div>
    </div>
  );
}


const Matchmaking = (props) => {

  const handleClick = (e) => {
    e.preventDefault();

  }

  return (
    <div className="mm">
      <button value="start" onClick={handleClick} />
    </div>
  );
}

const Navigation = () => {
  return (
    <div className="navigation">

    </div>
  );
}

const News = () => {
  return (
    <div className="news">
      
    </div>
  );
}


export default Dashboard;