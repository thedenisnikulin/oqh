import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

let socket;

const Room = (props) => {
    
    return(
        <div>
            <Chat userDataState={props.userDataState} roomState={props.roomState}/>
        </div>
    );
};

const Chat = (props) => {
    const { userData, setUserData } = props.userDataState;
    const { room, setRoom } = props.roomState;
    const [ message, setMessage ] = useState('');
    const [ history, setHistory ] = useState([]);
    const [ isUserLeaving, setIsUserLeaving ] = useState(false);

    // initialize data on mount
    useEffect(() => {
        socket = io.connect('http://localhost:8000');
        console.log(userData)
        socket.emit('connectRoom', userData.roomId);
        socket.emit('init');
        socket.on('init', (initData) => {
            setHistory(initData.messages);
        })
        return () => {
            leaveRoom();
        }
    }, []);

    // listen to messages
    useEffect(() => {
        socket.on('message', (msg) => {
            setHistory([...history, msg])
        })
    });

    // listen to "leave" event
    useEffect(() => {
        leaveRoom();
        console.log(userData)
    }, [isUserLeaving])


    const leaveRoom = () => {
        // clean up room if no users
        if (room.users.length <= 2) {
            socket.emit('disconnectRoom');
        }
        let arr = room.users;
        console.log(room.users)
        console.log(arr)
        arr = room.users.filter((user) => user.username !== userData.username);
        console.log(arr)
        arr = arr.map(u => { u.isRated = false; return u });
        console.log(arr)
        setRoom({ ...room, id: '', users: arr, isReady: false });
        setUserData({ ...userData, roomId: '' });
        socket.emit('disconnectUser', userData.username);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let msg = {
            message,
            sender: userData,
        }
        socket.emit('message', msg);
        setMessage('');
    }
    const handleChange = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
    };

    return(
        <div>
            {
                history.length === 0 ? <div>start conversation</div> : history.map(msg => 
                    <div>
                        {msg.message} - {msg.sender.username}
                    </div>
                )
            }
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} value={message}/>
                <button>submit</button>
            </form>
            <button onClick={() => setIsUserLeaving(true)}>leave</button>
            { isUserLeaving && <RateUsers userData={userData} roomState={ props.roomState } /> }
        </div>
    );
}

const RateUsers = (props) => {
    const userData = props.userData;
    const { room, setRoom } = props.roomState;
    const [ feedbackCount, setFeedbackCount ] = useState(0);
    const [ isRedirect, setIsRedirect ] = useState(false);

    const handleClick = async (valueToAdd, user) => {
        setFeedbackCount(feedbackCount + 1);
        let arr = room.users;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].username === user.username) {
                arr[i].isRated = true;
                break;
            };
        };
        setRoom({ ...room, users: arr });
        await axios.post('http://localhost:7000/user/room', {
            valueToAdd: valueToAdd,
            user: user,
        });
    };

    return(
        <div>
            {
                room.users.map(user =>
                    <div>
                        <div>
                            { user.username }
                        </div>
                        {
                            !user.isRated ? <div>
                                <button onClick={ () => handleClick(1, user) }>up</button>
                                <button onClick={ () => handleClick(-1, user) }>down</button>
                            </div> : <div>rated</div>
                        }
                    </div>
                )
            }
            { feedbackCount === 3 && <input type='button' value='go back' onClick={ () => setIsRedirect(true) } /> }
            { isRedirect && <Redirect to="/user/dashboard" /> }
        </div>
    );
}

export default Room;