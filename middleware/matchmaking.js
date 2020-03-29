const User = require('../models/index').user;
const Room = require('../models/index').room;

const matchmaking = (req, res, next) => {
    const user = req.body.user
    matchmake();    
};

function addUserToSearchingPool(user) {
    User.findOne({where: {email: user.email}})
        .then(foundUser => {
            foundUser.isSearching = true;
            foundUser.save();
            // User.update({ isSearching: true }, { where: { id: result.id } });
        })
        .catch(err => console.log(err))
};

function matchmake() {
    User.findAll({where: {isSearching: true}})
        .then(foundUsers => {
            if (foundUsers.length > 0){
               Room.create()
                    .then(createdRoom => {
                        foundUsers.map(user => {
                            user.roomId = createdRoom.id;
                            user.isSearching = false;
                            user.save();
                        });
                    }); 
            }
                
        })
}

module.exports = matchmaking
