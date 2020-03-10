const Sequelize = require('sequelize');

const sequelize = new Sequelize('dev_db', 'postgres', 'lol', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 9,
      min: 0,
      idle: 10000
    }
});
const models = {
  User: sequelize.import('./user'),
};
Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

module.exports.sequelize = sequelize;
module.exports.models = models;