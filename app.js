const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./models/index').sequelize;

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

// Routes
app.use('/', require('./routes/home'))

app.use('/user', require('./routes/user/auth'))
app.use('/user', require('./routes/user/dashboard'));

app.use('/company', require('./routes/company/auth'));
app.use('/company', require('./routes/company/dashboard'));


const port = process.env.PORT;
app.listen(port, () => console.log('the server is running on port ' + port));