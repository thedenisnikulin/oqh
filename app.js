const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');

const app = express();

// Database
const sequelize = new Sequelize('lol', 'lol', 'loool', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 9,
    min: 0,
    idle: 10000
  }
});
sequelize.authenticate()
  .then((() => {
    console.log('SUCCESS');
    var Posts = sequelize.define('posts', {
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      }
    },
    { freezeTableName: true }
    );
    Posts.sync({ force: true })
      .then(() => {
        return Posts.create({
          title: "I'm the title from database!",
          content: "Hello from the content"
        });
    });
  }))
  .catch(err => console.log(err));

// App
app.use((cors({credentials: true, origin: true})))

app.get('/', (req, res, next) => {
  Posts.findAll({})
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  res.redirect('/home');
});

app.get('/home', (req, res, next) => {
  res.send({home: 'react is connected to express!'});
  console.log('sent1')
  next();
});
app.get('/page', (req, res, next) => {
  res.send({page: 'second page mothafucka!'});
  console.log('sent2')
  next();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('the server is running on port ' + PORT));