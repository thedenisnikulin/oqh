import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import axios from 'axios';

import Room from './Room'
import useInterval from '../../hooks/useInterval'

const Dashboard = (props) => {
  const userData = props.userData;
  const [ isSearching, setIsSearching ] = useState(false);
  const [ isFound, setIsFound ] = useState(false);
  const [ room, setRoom ] = useState({ id: userData.roomId, topic: '', users: null });

  let delay = 3000;
  useInterval(() => {
    if (isSearching) {
      delay = 3000;
      fetch();
    } else {
      fetch();
      delay = null;
    }
  }, delay);

  const fetch = async () => {
    const result = await axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: isSearching ? 'start' : 'break'
    });
    const data = result.data;
    setIsFound(data.isMatchFound);
    if (data.isMatchFound) {
      setRoom({ ...room, users: data.room.users })
      setIsSearching(false);
    }
  };

  return (
    <div>
      <input value={room.topic} onChange={(e) => setRoom({ ...room, topic: e.target.value })} />
      { isSearching && <Timer isSearchingState={{isSearching, setIsSearching}}/> }
      <StartBreakMatchmaking
        isSearchingState={{isSearching, setIsSearching}}
        isFoundState={{isFound, setIsFound}}
      />
      { isFound && <Redirect to={{
        pathname:'/user/room',
        state: {
          userData,
          room,
        }
      }}/> }
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