const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Get access token from Capital One
 * https://developer.capitalone.com/documentation/o-auth
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
};

/**
 * Get bank products
 */
const products = async () => {
  //curl -i -k --tlsv1.2 -H "Authorization: Bearer jT7LJYpI4wLG8Q2KGHgNNiAPO84BYDpBXQyPXsksHO6g71MxwCUoOU" -H "Accept: application/json;v=5" -H "Content-Type: application/json" -d "{\"isCollapseRate\":true}" -X POST "https://api-sandbox.capitalone.com/deposits/products/~/search"
  
  const data = {
    'isCollapseRate': true
  }
  
  const headers = {
    headers: {
      'Authorization': 'Bearer',
      'Content-Type': 'application/json'
    }
  };

  return await axios.post('https://api-sandbox.capitalone.com/deposits/products/~/search', data, headers);
};


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

/**
 * Bank products
 */
router.get('/products', (req, res) => {
  const products = await products();
  console.log(products);
  
  try {
    res.sendStatus(200);
  }
  catch(err) {
    console.log(err);
  }
});

module.exports = router;