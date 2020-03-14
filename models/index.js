const Sequelize = require('sequelize');
const UserModel = require('./user');
const CompanyModel = require('./company');

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
const Company = CompanyModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => {
    console.log('Databases & tables created!')
});

module.exports = {
  sequelize,
  User,
  Company
};