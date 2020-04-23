import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import axios from 'axios';

import Room from './Room'
import useInterval from '../../hooks/useInterval'

// every request to /mm makes a lot of unnecessary db queries to get current user
// better provide a consistent userdata when checking token

const Dashboard = (props) => {
  const { userData, setUserData } = props.userDataState;
  const [ room, setRoom ] = useState({ id: '', topic: '', users: [] });
  const [ isSearching, setIsSearching ] = useState(false);
  const [ isRoomFound, setIsRoomFound ] = useState(false);
  const [ isRoomReady, setIsRoomReady ] = useState(false);
  const [ delay, setDelay ] = useState(3000);

  // backend sends one room but it gives another room
  // maybe because it calls findRoom twice
  useInterval(async () => {
    if (!isRoomFound) {
      await findRoom();
      console.log('i found it')
    } else if (!isRoomReady){
      await checkIfReady();
      console.log('i checked it')
    }
  }, isSearching ? delay : null);

  useEffect(() => {
    console.log('room id after set ' + room.id);
    console.log(`LOG:\nuserdata: ${require('util').inspect(userData)}\nroom: ${require('util').inspect(room)}\nflags: ${require('util').inspect({
      search: isSearching,
      found: isRoomFound,
      ready: isRoomReady
    })}`);
    if (room.id !== '') {
      setIsSearching(false);
      setIsRoomReady(true);
      setUserData({ ...userData, roomId: room.id })
    }
    
  }, [room])

  useEffect(() => {
    axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'get_room_id'
    }).then((resp) => {
      console.log(resp)
    })
  }, [])

  // find room once, then check while not ready

  const findRoom = async () => {
    let result = await axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'find_room'
    });
    const data = result.data;
    console.log(data);
    setIsRoomFound(data.isRoomFound);
    }

  const checkIfReady = async () => {
    let result = await axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'check_if_ready'
    });
    const data = result.data;
    console.log(data)
    console.log('we are here')
    if (data.isRoomReady) {
      console.log('room id before set' + require('util').inspect(room.id))
      setRoom(data.room);
    }
    
  };

  const breakSearch = async (e) => {
    e.preventDefault();
    setIsSearching(false);
    let result = await axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'break'
    });
  }

  return (
    <div>
      <input 
        value={room.topic} 
        onChange={(e) => setRoom({ ...room, topic: e.target.value })} 
      />

      { isSearching && <Timer isSearching={isSearching}/> }

      <button onClick={ isSearching ? breakSearch : () => setIsSearching(true) }>
        { isSearching ? <div>break</div> : <div>start</div> }
      </button>

      { isRoomReady && <Redirect to={{
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
  const { isSearching } = props;
  const [timer, setTimer] = useState([0, 0]);
  useInterval(() => {
    // this is somehow ont working
    if (timer[1] === 60) setTimer([timer[0]+1, timer[1]]);
    setTimer([timer[0], timer[1]+1]);
  }, isSearching ? 1000 : null);

  return(
    <div>
      { timer[0] }:{ timer[1] }
    </div>
  );
}


export default Dashboard;