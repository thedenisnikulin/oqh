import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import axios from 'axios';

import Room from './Room'
import useInterval from '../../hooks/useInterval'

const Dashboard = (props) => {

  return (
    <div className="dashboard">
      <LeftNavigationBar />
      <News/>
      <Feed />
      <RightNavigationBar userData={props.userData}/>
    </div>
  );
}

const LeftNavigationBar = () => {
  return (
    <div>
    </div>
  );
}

const News = (props) => {

  return (
    <div>

    </div>
  );
}

const Feed = () => {
  return (
    <div>
      
    </div>
  );
}

const RightNavigationBar = (props) => {
  const { email, username, tag, rank } = props.userData;
  const [isSearching, setIsSearching] = useState(false);
  const [isFound, setIsFound] = useState(false);
  useInterval(() => {
    fetch();
  }, isSearching ? 5000 : null);

  const fetch = () => {
    return axios.post('http://localhost:7000/user/mm', {
      user: {email},
      action: isSearching ? 'start' : 'break'
    }).then(result => {
      const data = result.data;
      setIsFound(data.isMatchFound);
      data.isMatchFound && setIsSearching(false)
    })
  };

  return (
    <div>
      <Profile />
      { isSearching && <Timer isSearchingState={{isSearching, setIsSearching}}/> }
      <StartBreakMatchmaking 
        isSearchingState={{isSearching, setIsSearching}}
        isFoundState={{isFound, setIsFound}}
      />
      { isFound && <Redirect to='user/room'/> }
    </div>
  );
}

const Profile = (props) => {

  return(
    <div>

    </div>
  );
}

const Timer = (props) => {
  const { isSearching, setIsSearching } = props.isSearchingState;
  const [timer, setTimer] = useState([0, 0]);
  useInterval(() => {
    if (timer[1] === 60) setTimer([timer[0]+1, timer[1]]);
    setTimer([timer[0], timer[1]+1]);
  }, isSearching ? 1000 : null);

  return(
    <div>
      { timer[0] }:{ timer[1] }
    </div>
  );
}

const StartBreakMatchmaking = (props) => {
  const { isSearching, setIsSearching } = props.isSearchingState;
  const { isFound, setIsFound } = props.isFoundState;

  const handleClick = (e) => {
    e.preventDefault();
    setIsSearching(!isSearching);
  }

  return(
    <div>
      <button onClick={handleClick}>
        { isSearching ? <div>break</div> : <div>start</div> }
      </button>
      
    </div>
  );
}


export default Dashboard;