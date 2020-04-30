import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import useInterval from '../../hooks/useInterval'

// every request to /mm makes a lot of unnecessary db queries to get current user
// better provide a consistent userdata when checking token

const Dashboard = (props) => {
  const { userData, setUserData } = props.userDataState;
  const { room, setRoom } = props.roomState;

  const [ isSearching, setIsSearching ] = useState(false);
  const [ isRoomFound, setIsRoomFound ] = useState(false);
  const [ isRoomReady, setIsRoomReady ] = useState(false);

  const [ usersSearching, setUsersSearching ] = useState();

  const [ delay, setDelay ] = useState(3000);

  useInterval(async () => {
    //fetchPeopleSearching();
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

  const findRoom = () => {
    axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'find_room'
    }).then(result => {
      const data = result.data.isRoomFound;
      console.log('fr ' + data);
      setIsRoomFound(data);
    })
    
    }

  const checkIfReady = async () => {
    let result = await axios.post('http://localhost:7000/user/mm', {
      user: { username: userData.username },
      topic: room.topic.toLowerCase(),
      action: 'check_if_ready'
    })
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

      <TopicSelection roomState={props.roomState} />

      <button onClick={ isSearching ? breakSearch : () => setIsSearching(true) }>
        { isSearching ? <div>break</div> : <div>start</div> }
      </button>

      { isSearching && <Timer isSearching={isSearching}/> }
      { isSearching && <div>users searching: {usersSearching}</div> }

     

      { isRoomReady && <Redirect to='/user/room'/> }
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
};

const TopicSelection = (props) => {
  const INITIAL_TOPICS = [
    'random', 'programming', 'design', 'history', 
    'sport', 'politics', 'foreign languages', 
    'media', 'anime', 'art', 'music', 'code'
  ];
  const { room, setRoom } = props.roomState;
  const [ changeableTopics, setChangeableTopics ] = useState([]);
  const [ topic, setTopic ] = useState('');

  const handleButtonClick = (e) => {
    e.preventDefault();
    let value = e.target.value.slice(1);
    console.log('e ' + value)
    setRoom({ ...room, topic: value});
  }
  useEffect(() => {
    console.log(room)
  }, [room])

  useEffect(() => {
    if (topic === '') {
      setChangeableTopics(INITIAL_TOPICS);
    } else {
      setChangeableTopics(INITIAL_TOPICS.filter(t => t.includes(topic)));
    } 
    
  }, [topic])

  const handleSearchChange = (e) => {
    e.preventDefault();
    setTopic(e.target.value);
  }

  return(
    <div>
      <input placeholder='search...' onChange={handleSearchChange}/>
      <div>
        {
          changeableTopics.map(topic => 
            <input type='button' value={'#' + topic} onClick={handleButtonClick} />
          )
        }
      </div>
    </div>
  );
}


export default Dashboard;