const Sequelize = require('sequelize');
const UserModel = require('./user');
const PoolModel = require('./pool');
const RoomModel = require('./room');

const sequelize = new Sequelize(
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

const User = UserModel(sequelize, Sequelize);
const Pool = PoolModel(sequelize, Sequelize);
const Room = RoomModel(sequelize, Sequelize);

Room.hasMany(User, {foreignKey: 'userId'});
User.belongsTo(Room);

sequelize.sync()
  .then(() => {
    console.log('Databases & tables created!')
});

module.exports = {
  sequelize,
  User,
  Pool,
  Room
};