import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import useInterval from '../../hooks/useInterval'

// every request to /mm makes a lot of unnecessary db queries to get current user
// better provide a consistent userdata when checking token

const Dashboard = (props) => {
  const { userData, setUserData } = props;
  const { room, setRoom } = props;

  const [ isSearching, setIsSearching ] = useState(false);
  const [ isRoomFound, setIsRoomFound ] = useState(false);
  const [ isRoomReady, setIsRoomReady ] = useState(false);

  const [ usersSearching, setUsersSearching ] = useState();

  const [ delay, setDelay ] = useState(3000);

  const [ topics, setTopics ] = useState([
    'programming', 'design', 'history', 
    'sport', 'politics', 'foreign languages', 
    'media', 'anime', 'art', 'music', 'random'
  ]);

  useInterval(async () => {
    fetchPeopleSearching();
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
    // I haven't tested it, maybe it is even unecessary
    fetchRoomId();
  }, [])

  const fetchRoomId = () => {
    // MAY NEED USE OF ASYNC
    axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'get_room_id'
    }).then((result) => {
      console.log(result)
      const id = result.data.roomId;
      setIsRoomReady(true);
      setUserData({ ...userData, roomId: id })
    })
  };

  const fetchPeopleSearching = () => {
    // MAY NEED USE OF ASYNC
    isSearching && axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'get_people_searching'
    }).then(result => {
      const data = result.data.usersSearching;
      setUsersSearching(data)
    })
  }

  const findRoom = async () => {
    axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'find_room'
    }).then(result => {
      const data = result.data.isRoomFound;
      console.log(data);
      setIsRoomFound(data);
    })
    
    }

  const checkIfReady = async () => {
    axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'check_if_ready'
    }).then(result => {
      const data = result.data;
      console.log(data)
      console.log('we are here')
      if (data.isRoomReady) {
        console.log('room id before set' + require('util').inspect(room.id))
        setRoom(data.room);
      }
    });
  };

  const breakSearch = async (e) => {
    e.preventDefault();
    setIsSearching(false);
    await axios.post('http://localhost:7000/user/mm', {
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
      { isSearching && <div>users searching {usersSearching}</div> }

      <button onClick={ isSearching ? breakSearch : () => setIsSearching(true) }>
        { isSearching ? <div>break</div> : <div>start</div> }
      </button>

      { isRoomReady && <Redirect to='/users/room'/> }
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