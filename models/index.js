const Sequelize = require('sequelize');

const db = {};     // contains all db instances

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

db.user = require('./user')(db.sequelize, db.Sequelize);
db.room = require('./room')(db.sequelize, db.Sequelize);

db.room.hasMany(db.user, { foreignKey: 'roomId' });

db.sequelize.sync()
  .then(() => {
    console.log('Databases & tables created!')
});

module.exports = db;