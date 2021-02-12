require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const capitaloneRoutes = require('./integrations/capitalone');

app.use('/api/capitalone', capitaloneRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Gringotts 💰💰💰 http://localhost:${port}`)
});