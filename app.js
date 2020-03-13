const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./models/index').sequelize;
const session = require('express-session')

const app = express();

// Session
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  }
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
app.use('/user', require('./routes/auth/user'))
app.use('/user', require('./routes/userDashboard'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('the server is running on port ' + PORT));