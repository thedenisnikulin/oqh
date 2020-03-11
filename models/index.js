const Sequelize = require('sequelize');
const UserModel = require('./user');

const sequelize = new Sequelize('dev_db', 'postgres', 'ReAapJJdm0', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 9,
      min: 0,
      idle: 10000
    }
});

const User = UserModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => {
    console.log('Databases & tables created!')
});

module.exports = {
  sequelize,
  User,
};