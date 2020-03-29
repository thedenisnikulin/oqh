const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./models/index').sequelize;
const checkToken = require('./middleware/checkToken');

const app = express();


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
app.use(checkToken)

// Routes
app.use('/', require('./routes/home'))

app.use('/user', require('./routes/user/auth'))
app.use('/user', require('./middleware/checkToken'));
app.use('/user', require('./routes/user/dashboard'));
app.post('/mm', require('./middleware/matchmaking'));


const port = process.env.PORT;
app.listen(port, () => console.log('the server is running on port ' + port));