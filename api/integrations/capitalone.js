const express = require('express');
const router = express.Router();
const axios = require('axios');

const authenticate = () => {
  axios({
    method: 'post',
    url: 'https://api-sandbox.capitalone.com/oauth2/token',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    data: {
      client_id: process.env.CAPITAL_ONE_CLIENT_ID,
      client_secret: process.env.CAPITAL_ONE_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
}


// define the about route
router.get('/authentication', (req, res) => {
  const token = authenticate();
  console.log(token);
});

router.get('/transactions', (req, res) => {
  res.send('About birds')
});

module.exports = router;