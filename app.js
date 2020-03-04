const express = require('express');
const cors = require('cors');

const app = express();

app.use((cors({credentials: true, origin: true})))

app.get('/', (req, res, next) => {
  res.send({express: 'react is connected to express!'});
  console.log('sent')
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('the server is running on port ' + PORT));