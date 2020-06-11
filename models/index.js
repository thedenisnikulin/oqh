const Sequelize = require('sequelize');

const db = {};     // contains all database instances

db.Sequelize = Sequelize;
db.sequelize = new Sequelize(
  process.env.DB, 
  process.env.DB_LOGIN, 
  process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 9,
      min: 0,
      idle: 10000
    }
});

// instances
db.user = require('./user')(db.sequelize, db.Sequelize);
db.room = require('./room')(db.sequelize, db.Sequelize);
db.chatMessage = require('./chatMessage')(db.sequelize, db.Sequelize);

// associations
db.room.hasMany(db.user, { foreignKey: 'roomId' });
db.room.hasMany(db.chatMessage, { foreignKey: 'roomId' });
db.user.hasMany(db.chatMessage, { foreignKey: 'senderId' });
db.chatMessage.belongsTo(db.user);
db.chatMessage.belongsTo(db.room);

db.sequelize.sync()
  .then(() => {
    console.log('Databases & tables synced')
  }).catch(e => console.log(e));

module.exports = db;