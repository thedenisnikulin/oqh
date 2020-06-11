import React from "react";

/* 
    There is a static avatar that is picked randomly for each user.
    The avatar is picked by the first letter of the username
    (this idea is a bit of weird, but I'm kinda lazy to
    keep all the avatars on server, so this one is the most
    convenient solution for me)
*/
const UserAvatar = (props) => {
    const firstLetter = props.username.substring(0, 1);
    const size = props.size;
    const letters = [
        "abcde", "fghij",
        "klmn", "opqr",
        "stuv", "wxyz"
    ];

    const pickAvatar = () => {
        let avatarIndex;
        for (let i = 0; i < letters.length; i++) {
            if (letters[i].includes(firstLetter)) {
                avatarIndex = i;
                break;
            }
        }
        return avatarIndex;
    };

    return(
        <div>{
            size === "large" && <img style={{
                height: '6rem',
                margin: "0 1.2rem 1.2rem 0"
            }} src={require(`../assets/av${pickAvatar()}.svg`)} />
        } {
            size === "small" && <img style={{
                height: '2.7rem',
            }} src={require(`../assets/av${pickAvatar()}.svg`)} />
        }</div>
    )
}

export default UserAvatar;