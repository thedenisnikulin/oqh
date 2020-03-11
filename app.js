const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./models/index').sequelize;

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
app.use('/auth/register', require('./routes/auth/registerUser'))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('the server is running on port ' + PORT));