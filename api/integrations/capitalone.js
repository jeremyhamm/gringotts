const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Get access token from Capital One
 * 
 * @return {Promise}
 */
const authenticate = async () => {
  const data = new URLSearchParams();
  data.append('client_id', process.env.CAPITAL_ONE_CLIENT_ID);
  data.append('client_secret', process.env.CAPITAL_ONE_CLIENT_SECRET);
  data.append('grant_type',  'client_credentials');
  
  const headers = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
  
  return await axios.post('https://api-sandbox.capitalone.com/oauth2/token', data, headers);
}


/**
 * Authenicate
 */
router.get('/authentication', async (req, res) => {
  try {
    const token = await authenticate();
    console.log(token.data);

    res.sendStatus(200);
  }
  catch(err) {
    console.log(err);
  }
  
});

router.get('/transactions', (req, res) => {
  res.send('About birds')
});

module.exports = router;