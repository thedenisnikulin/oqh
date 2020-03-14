const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./models/index').sequelize;
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const app = express();

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
  store: new SequelizeStore({
    db: sequelize
  })
}));

// Database Test
sequelize.authenticate()
  .then((() => {
    console.log('SUCCESS');
  }))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((cors({credentials: true, origin: true})))

// Routes
app.use('/', require('./routes/home'))

app.use('/user', require('./routes/user/auth'))
app.use('/user', require('./routes/user/dashboard'));

app.use('/company', require('./routes/company/auth'));
app.use('/company', require('./routes/company/dashboard'));


const port = process.env.PORT;
app.listen(port, () => console.log('the server is running on port ' + port));