const { Room } = require('../models/index');

const matchmaking = (req, res, next) => {
    Room.create({
        userId: [
        ]
    });
};

/*
1 move all ids to pool
2 create room by all these ids gotten from pool
*/


module.exports = matchmaking