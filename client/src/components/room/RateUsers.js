import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import UserAvatar from "../UserAvatar";

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
        await axios.post('http://localhost:7000/room/add-rep', {
            valueToAdd: valueToAdd,
            username: user.username,
        });
    };

    return(
        <div className="rate-users-container">
            <div className="rate-title">How do you like these guys?</div>
            <div className="rating">
                {
                    room.users.map(user =>
                        <div className="user-to-rate">
                            <div className="user-data-rate">
                                <UserAvatar username={user.username} size="small" />
                                <div className="member-username">
                                    @{ user.username }
                                </div>
                            </div>
                            {
                                !user.isRated ? <div className="rate-buttons-container">
                                    <IconButton color="primary" style={{color: "#74D69D"}} onClick={ () => handleClick(1, user) }>
                                        <ExpandLessIcon />
                                    </IconButton>
                                    <IconButton color="primary" style={{color: "#FF8383"}} onClick={ () => handleClick(-1, user) }>
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </div> : <div style={{marginRight: "2rem"}}>rated</div>
                            }
                        </div>
                    )
                }
                { isRedirect && <Redirect to="/dashboard" /> }
            </div>
            { 
                feedbackCount === 3 && 
                    <input type='button' value='go back' onClick={ () => setIsRedirect(true) } /> 
            }
        </div>
        
    );
}

export default RateUsers;