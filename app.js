const app = require('express')();

const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./models/index').sequelize;

const sockets = require('./sockets/chatSocket');
const checkToken = require('./middleware/checkToken');


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
app.post('/login', require('./controllers/loginController'));
app.post('/register', require('./controllers/registerController'));
app.post('/mm', require('./controllers/matchmakingController'));

app.get('/check-token', checkToken)

const port = process.env.PORT;
const server = app.listen(port, () => console.log('the server is running on port ' + port));

// sockets
sockets.init(server, sockets.main);